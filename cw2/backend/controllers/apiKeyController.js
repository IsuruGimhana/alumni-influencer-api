import db from "../models/index.js";
const { ApiKey, ApiUsage, Bid, User, Profile, Degree, Certification, License, Course, Work } = db;
import crypto from "crypto";
// import { get } from "http";
import { Op, fn, col, literal } from "sequelize";
import { Parser } from 'json2csv';
import PDFDocument from "pdfkit";

/**
 * Generate a new API Key for the ar_app or dashboard client
 */

export const generateApiKey = async (req, res) => {
  try {
    const { label, clientType } = req.body;

    const allowedTypes = ["dashboard", "ar_app"];

    if (!allowedTypes.includes(clientType)) {
      return res.status(400).json({ msg: "Invalid client type" });
    }

    const newKey = crypto.randomBytes(32).toString("hex");

    let assignedScopes = [];

    if (clientType === "dashboard") {
      assignedScopes = ["read:alumni", "read:analytics"];
    } else if (clientType === "ar_app") {
      assignedScopes = ["read:alumni_of_day"];
    }

    const apiKey = await ApiKey.create({
      key: newKey,
      label: label?.trim() || `${clientType} key`,
      userId: req.user.id,
      scopes: assignedScopes,
      clientType
    });

    res.status(201).json({
      msg: `API Key for ${clientType} generated`,
      apiKey: newKey
    });

  } catch (err) {
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
 * Counts external certifications held by alumni to identify skills missing from the university curriculum.
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
 * 2. Job Title Trends
 * Identifies the top 5 most common professional roles (e.g., Software Engineer) held by graduates.
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
      limit: 5,
      raw: true,
      subQuery: false
    });
    res.json(trends);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching job trends" });
  }
};

/**
 * 3. Top Employers
 * Lists the top 5 companies or organizations that employ the highest number of alumni.
 */
export const getTopEmployers = async (req, res) => {
  try {
    // const n = parseInt(req.query.limit) || 5;
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
      // limit: n,
      limit: 5,
      raw: true,
      subQuery: false
    });
    res.json(employers);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching employers" });
  }
};

/**
 * 4. Geographical Distribution
 * Maps the global reach of alumni by counting total graduates per city and country.
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
      limit: 5,
      raw: true,
      subQuery: false
    });
    res.json(geo);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching geography" });
  }
};

/**
 * 5. Certification Trends
 * Tracks the growth of upskilling by grouping certification completion counts by month and year.
 */
export const getCertificationTrend = async (req, res) => {
  try {
    const data = await Certification.findAll({
      attributes: [
        [
          fn(
            'TO_CHAR',
            fn('DATE_TRUNC', 'month', col('Certification.completionDate')),
            'Mon YYYY'
          ),
          'month'
        ],
        [fn('COUNT', col('Certification.id')), 'count']
      ],
      include: [{
        model: Profile,
        attributes: [],
        include: [{
          model: Degree,
          attributes: []
        }]
      }],
      where: getFilters(req.query),
      group: [fn('DATE_TRUNC', 'month', col('Certification.completionDate'))],
      order: [[fn('DATE_TRUNC', 'month', col('Certification.completionDate')), 'ASC']],
      raw: true,
      subQuery: false
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching certification trends", error: err.message });
  }
};

/**
 * 6. Programme Distribution
 * Breaks down the alumni population by their specific field of study or degree title.
 */
export const getProgrammeDistribution = async (req, res) => {
  try {
    const countUserId = fn('COUNT', fn('DISTINCT', col('User.id')));

    const data = await User.findAll({
      attributes: [
        // Use the dot notation that matches the include hierarchy
        [col('Profile.Degrees.title'), 'programme'],
        [countUserId, 'count']
      ],
      include: [{
        model: Profile,
        attributes: [],
        required: true,
        include: [{
          model: Degree,
          attributes: [],
          required: true,
        }]
      }],
      where: {
        role: 'alumni',
        ...getFilters(req.query) 
      },
      group: [col('Profile.Degrees.title')],
      order: [[countUserId, 'DESC']],
      raw: true,
      subQuery: false
    });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// export const generateDashboardReport = async (req, res) => {
//   try {
//     const filters = getFilters(req.query);

//     const countCertId = fn('COUNT', fn('DISTINCT', col('Certification.id')));
//     const countWorkId = fn('COUNT', fn('DISTINCT', col('Work.id')));

//     // -----------------------------
//     // SKILLS GAP
//     // -----------------------------
//     const skills = await Certification.findAll({
//       attributes: ['title', [countCertId, 'count']],
//       include: [{
//         model: Profile,
//         attributes: [],
//         include: [{
//           model: Degree,
//           attributes: [],
//         }]
//       }],
//       where: filters,
//       group: ['Certification.title'],
//       order: [[countCertId, 'DESC']],
//       raw: true,
//       subQuery: false
//     });

//     // -----------------------------
//     // JOBS
//     // -----------------------------
//     const jobs = await Work.findAll({
//       attributes: ['jobTitle', [countWorkId, 'count']],
//       include: [{
//         model: Profile,
//         attributes: [],
//         include: [{
//           model: Degree,
//           attributes: [],
//         }]
//       }],
//       where: filters,
//       group: ['Work.jobTitle'],
//       order: [[countWorkId, 'DESC']],
//       limit: 5,
//       raw: true,
//       subQuery: false
//     });

//     // -----------------------------
//     // EMPLOYERS
//     // -----------------------------
//     const employers = await Work.findAll({
//       attributes: ['company', [countWorkId, 'count']],
//       include: [{
//         model: Profile,
//         attributes: [],
//         include: [{
//           model: Degree,
//           attributes: [],
//         }]
//       }],
//       where: filters,
//       group: ['Work.company'],
//       order: [[countWorkId, 'DESC']],
//       limit: 5,
//       raw: true,
//       subQuery: false
//     });

//     // -----------------------------
//     // PDF GENERATION
//     // -----------------------------
//     const doc = new PDFDocument();

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename=dashboard_report.pdf"
//     );

//     doc.pipe(res);

//     doc.fontSize(18).text("Alumni Intelligence Report", { align: "center" });
//     doc.moveDown();

//     // Filters info (IMPORTANT UX)
//     doc.fontSize(10).text(
//       `Filters: Programme=${req.query.programme || "All"} | Year=${req.query.gradDate || "All"}`
//     );
//     doc.moveDown();

//     // Skills
//     doc.fontSize(14).text("Top Skills Gap");
//     skills.slice(0, 5).forEach(s =>
//       doc.text(`- ${s.title}: ${s.count}`)
//     );

//     doc.moveDown();

//     // Jobs
//     doc.text("Top Job Roles");
//     jobs.forEach(j =>
//       doc.text(`- ${j.jobTitle}: ${j.count}`)
//     );

//     doc.moveDown();

//     // Employers
//     doc.text("Top Employers");
//     employers.forEach(e =>
//       doc.text(`- ${e.company}: ${e.count}`)
//     );

//     doc.end();

//   } catch (err) {
//     res.status(500).json({
//       msg: "Failed to generate report",
//       error: err.message,
//     });
//   }
// };


export const generateDashboardReport = async (req, res) => {
  try {
    const { charts, filters } = req.body;

    const COLORS = {
      primary: "#2563eb",
      secondary: "#64748b",
      background: "#f8fafc",
      text: "#1e293b",
      cardBg: "#ffffff",
      border: "#e2e8f0"
    };

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
      bufferPages: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Alumni_Report.pdf");
    doc.pipe(res);

    // ================= HELPER: CARD =================
    const addChartCard = (title, image, x, y, width, height) => {
      // Card background (no shadow support in PDFKit)
      doc
        .roundedRect(x, y, width, height, 8)
        .fillColor(COLORS.cardBg)
        .fill();

      // Border (optional for modern look)
      doc
        .roundedRect(x, y, width, height, 8)
        .lineWidth(0.5)
        .strokeColor(COLORS.border)
        .stroke();

      // Title
      doc
        .fillColor(COLORS.primary)
        .fontSize(11)
        .text(title.toUpperCase(), x + 15, y + 15, {
          characterSpacing: 1,
          width: width - 30
        });

      // Image
      if (image) {
        doc.image(image, x + 10, y + 40, {
          fit: [width - 20, height - 60],
          align: "center",
          valign: "center"
        });
      } else {
        doc
          .fillColor(COLORS.secondary)
          .fontSize(10)
          .text("No data available", x, y + height / 2, {
            width,
            align: "center"
          });
      }
    };

    // ================= HEADER =================
    doc.rect(0, 0, doc.page.width, 100).fillColor(COLORS.primary).fill();

    doc
      .fillColor("#ffffff")
      .fontSize(22)
      .text("ALUMNI ANALYTICS", 40, 35);

    doc
      .fontSize(10)
      .text(`GENERATED: ${new Date().toLocaleDateString()}`, 40, 65);

    // Filter box
    doc
      .roundedRect(380, 35, 170, 45, 5)
      .fillColor("#ffffff")
      .fill();

    doc
      .fillColor(COLORS.primary)
      .fontSize(8)
      .text(`PROGRAMME: ${filters?.programme || "All"}`, 390, 42)
      .text(`YEAR: ${filters?.gradDate || "All"}`, 390, 55);

    // ================= GRID =================
    const cardWidth = 250;
    const cardHeight = 220;
    const gutter = 20;

    const startY = 120;

    // Row 1
    addChartCard("Skills Gap", charts?.skills, 40, startY, cardWidth, cardHeight);
    addChartCard("Cert Trends", charts?.cert, 40 + cardWidth + gutter, startY, cardWidth, cardHeight);

    // Row 2
    addChartCard("Job Trends", charts?.jobs, 40, startY + cardHeight + gutter, cardWidth, cardHeight);
    addChartCard(
      "Geography",
      charts?.geo,
      40 + cardWidth + gutter,
      startY + cardHeight + gutter,
      cardWidth,
      cardHeight
    );

    // Row 3
    addChartCard(
      "Top Employers",
      charts?.emp,
      40,
      startY + (cardHeight + gutter) * 2,
      cardWidth,
      cardHeight
    );

    addChartCard(
      "Distribution",
      charts?.prog,
      40 + cardWidth + gutter,
      startY + (cardHeight + gutter) * 2,
      cardWidth,
      cardHeight
    );

    // ================= FOOTER =================
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);

      doc
        .fillColor(COLORS.secondary)
        .fontSize(8)
        .text(
          `Page ${i + 1} of ${range.count} - Confidential Alumni Report`,
          40,
          doc.page.height - 30,
          { align: "center", width: doc.page.width - 80 }
        );
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF");
  }
};

export const formatAlumni = (user) => {
  const profile = user.Profile || {};
  const degree = profile.Degrees?.[0] || {};

  const work =
    profile.Works?.find(w => w.isCurrent) ||
    profile.Works?.sort(
      (a, b) =>
        new Date(b.startDate || 0) - new Date(a.startDate || 0)
    )[0] ||
    {};

  const baseUrl = process.env.BASE_URL; // e.g. http://localhost:5050

  return {
    id: user.id,
    fullName: profile.fullName || "N/A",
    email: user.email,

    location:
      profile.city && profile.country
        ? `${profile.city}, ${profile.country}`
        : "N/A",

    programme: degree.title || "N/A",

    graduationYear: degree.completionDate
      ? new Date(degree.completionDate).getFullYear()
      : "N/A",

    currentRole: work.jobTitle || "Unemployed/Private",
    company: work.company || "N/A",

    profileImage:
      profile.profileImage || `${baseUrl}/uploads/profile-default.jpg`
  };
};

export const getAlumniDirectory = async (req, res) => {
  try {
    const alumni = await User.findAll({
      where: {
        role: "alumni",
        ...getFilters(req.query),
      },
      include: [
        {
          model: Profile,
          required: true,
          include: [Degree, Work],
        },
      ],
      subQuery: false,
    });

    const formatted = alumni.map(formatAlumni);

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching directory" });
  }
};

export const exportAlumniCSV = async (req, res) => {
  try {
    const alumni = await User.findAll({
      where: {
        role: "alumni",
        ...getFilters(req.query),
      },
      include: [
        {
          model: Profile,
          required: true,
          include: [Degree, Work],
        },
      ],
      subQuery: false,
    });

    const csvData = alumni.map((u) => {
      const a = formatAlumni(u);

      return {
        FirstName: a.fullName,
        Email: a.email,
        Location: a.location,
        Programme: a.programme,
        GraduationYear: a.graduationYear,
        CurrentRole: a.currentRole,
        Company: a.company,
      };
    });

    const csv = new Parser().parse(csvData);

    res.header("Content-Type", "text/csv");
    res.attachment("alumni_directory.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({
      msg: "Export failed",
      error: err.message,
    });
  }
};

export const exportAlumniPDF = async (req, res) => {
  console.log("Received query parameters for PDF export:", req.query);
  try {
    const alumni = await User.findAll({
      where: {
        role: "alumni",
        ...getFilters(req.query),
      },
      include: [
        {
          model: Profile,
          required: true,
          include: [Degree, Work],
        },
      ],
      subQuery: false,
    });

    const doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=alumni_directory.pdf"
    );

    doc.pipe(res);

    doc.fontSize(18).text("Alumni Directory", { align: "center" });
    doc.moveDown();

    // Filters info
    doc.fontSize(10).text(
      `Filters: Programme=${req.query.programme || "All"} | Year=${req.query.gradDate || "All"}`
    );
    doc.moveDown();

    alumni.forEach((u, idx) => {
      const a = formatAlumni(u);

      doc.fontSize(12).text(`${idx + 1}. ${a.fullName}`, { continued: true }).fontSize(10).text(` (${a.email})`);
      doc.text(`   Location: ${a.location}`);
      doc.text(`   Programme: ${a.programme} (${a.graduationYear})`);
      doc.text(`   Current Role: ${a.currentRole} at ${a.company}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    res.status(500).json({
      msg: "PDF Export failed",
      error: err.message,
    });
  }
}

export const getProgrammes = async (req, res) => {
  const programmes = await Degree.findAll({
    attributes: [
      [fn('DISTINCT', col('title')), 'title']
    ],
    raw: true
  });

  res.json(programmes.map(p => p.title));
};

export const getGraduationYears = async (req, res) => {
  try {
    const years = await Degree.findAll({
      attributes: [
        [fn('EXTRACT', literal('YEAR FROM "completionDate"')), 'year']
      ],
      group: ['year'],
      raw: true
    });

    res.json(
      years
        .map(y => Number(y.year))
        .sort((a, b) => b - a)
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch years" });
  }
};