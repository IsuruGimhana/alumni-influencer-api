import db from "../models/index.js";
const { ApiKey, ApiUsage, Bid, User, Profile, Degree, Certification, License, Course, Work } = db;
import crypto from "crypto";

/**
 * Generate a new API Key for the Developer
 */
export const generateApiKey = async (req, res) => {
  try {
    // 1. Secure token generation using crypto [cite: 196, 197]
    const newKey = crypto.randomBytes(32).toString('hex'); 
    
    // 2. Create the key record linked to the Developer (req.user.id)
    const apiKey = await ApiKey.create({
      key: newKey,
      label: req.body?.label || "Default Key",
      userId: req.user.id
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

    // 1. Find and update the key only if it belongs to the logged-in Developer
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
 * List all API Keys for the Developer
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