import db from "../models/index.js";
const { ApiKey, ApiUsage, Bid, User, Profile, Degree, Certification, License, Course, Work } = db;
import crypto from "crypto";
import { get } from "http";
import { Op, fn, col } from "sequelize";

/**
 * Generate a new API Key for the ar_app or dashboard client
 */
export const generateApiKey = async (req, res) => {
  try {
    // 1. Secure token generation using crypto
    const newKey = crypto.randomBytes(32).toString('hex'); 
    
    // Assign scopes based on the client type (passed in request body)
    // Example: clientType could be 'dashboard' or 'ar_app'
    let assignedScopes = ["read:alumni_of_day"]; // Default
    if (req.user.role === 'dashboard') {
        assignedScopes = ["read:alumni", "read:analytics"];
    }

    // 2. Create the key record in the database
    const apiKey = await ApiKey.create({
      key: newKey,
      label: req.body?.label || "Default Key",
      userId: req.user.id,
      scopes: assignedScopes
    });

    // 3. Respond with 201 Created and the raw key 
    res.status(201).json({ 
      msg: "API Key generated successfully", 
      apiKey: newKey 
    });
  } catch (err) {
    // 4. Proper error handling for database or logic failures 
    res.status(500).json({ msg: err.message });
  }
};

/**
 * Revoke an existing API Key
 */
export const revokeApiKey = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find and update the key only if it belongs to the logged-in user
      const apiKeys = await ApiKey.findOne({
        where: { id, userId: req.user.id }
      });

      if (!apiKeys) {
        return res.status(404).json({ msg: "Key not found or unauthorized" });
      }

      apiKeys.isActive = false;
      await apiKeys.save();

    // 2. Consistent success response
    res.status(200).json({ msg: "Key revoked successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * List all API Keys for the authenticated user
 */
export const listApiKeys = async (req, res) => {
  try {
    const keys = await ApiKey.findAll({ 
      where: { userId: req.user.id }
      // attributes: ['id', 'label', 'isActive', 'createdAt']
    });

    res.status(200).json({ msg: "API Keys retrieved successfully", apiKeys: keys });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * Retrieve usage statistics for a specific API Key
 */
export const getKeyStats = async (req, res) => {
  try {
    const { id } = req.params;

    const apiKey = await ApiKey.findOne({ where: { id, userId: req.user.id } });
    if (!apiKey) {
      return res.status(404).json({ msg: "Key not found or unauthorized" });
    }

    // Retrieve usage stats: total hits and recent logs
    const usageCount = await ApiUsage.count({ where: { apiKeyId: id } });
    const logs = await ApiUsage.findAll({ 
        where: { apiKeyId: id },
        limit: 10,
        order: [['createdAt', 'DESC']] 
    });

    res.status(200).json({ 
      msg: "API Key usage stats retrieved successfully", 
      stats: { 
        totalHits: usageCount,
        recentLogs: logs 
      } 
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * Retrieve the profile of the Alumnus of the Day
 */
export const getAlumnusOfTheDay = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format
    
    // Find today's winner
    const winningBid = await Bid.findOne({
      where: { bidDate: today, isWinner: true },
      include: [{
        model: User,
        include: [{
          model: Profile,
          include: [Degree, Certification, License, Course, Work]
        }]
      }]
    });

    if (!winningBid) return res.status(404).json({ msg: "No featured Alumnus today." });

    // Get profile
    const profile = winningBid.User.Profile;
    const profileData = profile.toJSON();

    if (!profileData.profileImage) profileData.profileImage = "/uploads/profile-default.jpg";

    res.status(200).json({ msg: "Profile retrieved successfully", profile: profileData });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * HELPER: Generates the filter object for Analytics
 * Filters by Degree Title (Programme) and Completion Date (Graduation)
 */
// const getFilters = (query) => {
//   const { programme, gradDate } = query;
//   const filter = {};
//   if (programme) filter['$Profile.Degrees.title$'] = programme;
//   // if (gradDate) filter['$Profile.Degrees.completionDate$'] = { [Op.like]: `%${gradDate}%` };
//   if (gradDate) {
//     filter['$Profile.Degrees.completionDate$'] = {
//       [Op.between]: [
//         `${gradDate}-01-01`,
//         `${gradDate}-12-31`
//       ]
//     };
//   }
//   // if (programme) {
//   //   filter.title = programme;
//   // }
//   // if (gradDate) {
//   //   filter.completionDate = { [Op.like]: `%${gradDate}%` };
//   // }
//   console.log("Generated filters for analytics:", filter);
//   return filter;
// };
const getFilters = (query, base = '') => {
  const { programme, gradDate } = query;
  const filter = {};

  const degreePath = base === 'Profile'
    ? '$Degrees'
    : '$Profile.Degrees';

  if (programme) {
    filter[`${degreePath}.title$`] = programme;
  }

  if (gradDate) {
    filter[`${degreePath}.completionDate$`] = {
      [Op.between]: [
        `${gradDate}-01-01`,
        `${gradDate}-12-31`
      ]
    };
  }

  console.log("Generated filters:", filter);
  return filter;
};

/**
 * 1. Curriculum Skills Gap
 * Identifies certifications alumni have obtained that are not in the curriculum.
 */
export const getSkillsGapData = async (req, res) => {
  console.log("Received query parameters for skills gap:", req.query);
  try {
    // Using Sequelize's fn and col to count certifications per title
    const countCertId = fn('COUNT', fn('DISTINCT', col('Certification.id')));

    // Group by title and count the number of certifications for each title, applying filters
    const gaps = await Certification.findAll({
      attributes: ['title', [countCertId, 'count']],
      include: [{ 
        model: Profile, 
        attributes: [], 
        include: [{ 
          model: Degree, 
          attributes: [],
          // where: getFilters(req.query)
        }] 
      }],
      where: getFilters(req.query),
      group: ['Certification.title'],
      order: [[countCertId, 'DESC']],
      raw: true, // Return raw data for easier processing in the frontend
      subQuery: false // Important to prevent subquery generation which can cause issues with grouping and counting
    });
    res.json(gaps);
  } catch (err) {
    res.status(500).json({ msg: "Error calculating skills gap", error: err.message });
  }
};

/**
 * 3. Employment Distribution (Job Titles)
 * Identifies the most common job titles among alumni, with filters for programme and graduation date.
 */
export const getJobTitleTrends = async (req, res) => {
  try {
    // Using Sequelize's fn and col to count works per job title
    const countWorkId = fn('COUNT', fn('DISTINCT', col('Work.id')));

    // Group by jobTitle and count the number of works for each title, applying filters
    const trends = await Work.findAll({
      attributes: ['jobTitle', [countWorkId, 'count']],
      include: [{ 
        model: Profile, 
        attributes: [], 
        include: [{ 
          model: Degree, 
          attributes: [],
          // where: getFilters(req.query)
        }] 
      }],
      where: getFilters(req.query),
      group: ['Work.jobTitle'],
      order: [[countWorkId, 'DESC']],
      raw: true,
      subQuery: false
    });
    res.json(trends);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching job trends" });
  }
};

/**
 * 4. Top n Employers
 * Identifies the most common employers (companies) among alumni, with filters for programme and graduation date.
 */
export const getTopEmployers = async (req, res) => {
  try {
    const n = parseInt(req.query.limit) || 5;
    const countWorkId = fn('COUNT', fn('DISTINCT', col('Work.id')));
    const employers = await Work.findAll({
      attributes: ['company', [countWorkId, 'count']],
      include: [{ 
        model: Profile, 
        attributes: [], 
        include: [{ 
          model: Degree, 
          attributes: [],
          // where: getFilters(req.query)
        }] 
      }],
      where: getFilters(req.query),
      group: ['Work.company'],
      order: [[countWorkId, 'DESC']],
      limit: n,
      raw: true,
      subQuery: false
    });
    res.json(employers);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching employers" });
  }
};

/**
 * 5. Geographical Distribution
 * Identifies the most common cities or countries where alumni are located, with filters for programme and graduation date.
 */
export const getGeographicalDist = async (req, res) => {
  try {
    const countProfileId = fn('COUNT', fn('DISTINCT', col('Profile.id')));
    const geo = await Profile.findAll({
      attributes: ['city', 'country', [countProfileId, 'count']],
      include: [{ 
        model: Degree, 
        attributes: [], 
        // where: getFilters(req.query) 
      }],
      where: getFilters(req.query, 'Profile'),
      group: ['Profile.city', 'Profile.country'],
      order: [[countProfileId, 'DESC']],
      raw: true,
      subQuery: false
    });
    res.json(geo);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching geography" });
  }
};

/**
 * Get Alumni Directory (Filtered List)
 */
export const getAlumniDirectory = async (req, res) => {
  try {
    const alumni = await User.findAll({
      where: { 
        role: 'alumni',
        ...getFilters(req.query)
      },
      include: [{
        model: Profile,
        required: true, // Only include users with profiles
        // where: getFilters(req.query), // Apply filters to the Profile
        // include: [Degree, Certification, License, Course, Work]
        attributes: [], 
        include: [{
          model: Degree,
          // where: getFilters(req.query), // Apply filters to the Degree
          attributes: [], 
        }, {
          model: Certification,
          attributes: [], 
        }, {
          model: License,
          attributes: [], 
        }, {
          model: Course,
          attributes: [], 
        }, {
          model: Work,
          attributes: [], 
        }]
      }],
      // raw: true,
      subQuery: false

    });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching directory" });
  }
};