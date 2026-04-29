import express from "express";
const router = express.Router();

import trackUsage from "../middleware/apiKeyMiddleware.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";

import {
  generateApiKey,
  revokeApiKey,
  listApiKeys,
  getKeyStats,
  getAlumnusOfTheDay,
  getSkillsGapData,
  getJobTitleTrends,
  getTopEmployers,
  getGeographicalDist,
  getCertificationTrend,
  getProgrammeDistribution,
  getAlumniDirectory,
  exportAlumniCSV,
  exportAlumniPDF,
  generateDashboardReport,
  getProgrammes,
  getGraduationYears
} from "../controllers/apiKeyController.js";

import {
  apiKeyGenerationValidation,
  idParamValidation
} from "../middleware/validator.js";


// DEVELOPER (API MANAGEMENT)

// Create API Key
router.post("/", protect, authorize("developer"), apiKeyGenerationValidation, generateApiKey);

// List API Keys
router.get("/me", protect, authorize("developer"), listApiKeys);

// Revoke API Key
router.delete("/:id", protect, authorize("developer"), idParamValidation, revokeApiKey);

// Get API Key Stats
router.get("/:id/stats", protect, authorize("developer"), idParamValidation, getKeyStats);



// EXTERNAL CLIENT (AR APP)

// Alumni of the Day (API KEY ONLY)
router.get("/featured/alumnus-of-the-day", trackUsage("read:alumni_of_day"), getAlumnusOfTheDay);


// DASHBOARD (ADMIN ANALYTICS)

router.get("/analytics/skills-gap", trackUsage("read:analytics"), getSkillsGapData);

router.get("/analytics/job-trends", trackUsage("read:analytics"), getJobTitleTrends);

router.get("/analytics/top-employers", trackUsage("read:analytics"), getTopEmployers);

router.get("/analytics/geography", trackUsage("read:analytics"), getGeographicalDist);

router.get("/analytics/certification-trends", trackUsage("read:analytics"),getCertificationTrend);

router.get("/analytics/programme-distribution", trackUsage("read:analytics"), getProgrammeDistribution);

router.post("/analytics/generate-report", trackUsage("read:analytics"), generateDashboardReport);

// DASHBOARD (DIRECTORY)

router.get("/directory", trackUsage("read:alumni"), getAlumniDirectory);

router.get("/directory/export/csv", trackUsage("read:alumni"), exportAlumniCSV);

router.get("/directory/export/pdf", trackUsage("read:alumni"), exportAlumniPDF);

router.get("/directory/options/programmes", trackUsage("read:alumni"), getProgrammes);

router.get("/directory/options/years", trackUsage("read:alumni"), getGraduationYears);

export default router;