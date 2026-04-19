// routes/apiRoutes.js
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
  getAlumniDirectory 
} from "../controllers/apiKeyController.js";
import { apiKeyGenerationValidation, idParamValidation } from "../middleware/validator.js";


// create api key
router.post("/", protect, authorize("ar_app", "dashboard"), apiKeyGenerationValidation, generateApiKey); 

// get all api keys of the current user
router.get("/me", protect, authorize("ar_app", "dashboard"), listApiKeys);

// revoke a specific api key (deactivate it)
router.delete("/:id", protect, authorize("ar_app", "dashboard"), idParamValidation, revokeApiKey);

// get usage stats for a specific api key
router.get("/:id/stats", protect, authorize("ar_app", "dashboard"), idParamValidation, getKeyStats);

// AR App Routes (Require 'read:alumni_of_day' scope)
router.get("/featured/alumnus-of-the-day", trackUsage("read:alumni_of_day"), getAlumnusOfTheDay);

// Dashboard Analytics Routes (Require 'read:analytics' scope)
router.get("/analytics/skills-gap", trackUsage("read:analytics"), getSkillsGapData);
router.get("/analytics/job-trends", trackUsage("read:analytics"), getJobTitleTrends);
router.get("/analytics/top-employers", trackUsage("read:analytics"), getTopEmployers);
// TODO: Implement Industry Analytics
// router.get("/analytics/industry", trackUsage("read:analytics"), getTopIndustries);
router.get("/analytics/geography", trackUsage("read:analytics"), getGeographicalDist);

// View Alumni Directory (Requires 'read:alumni' scope)
router.get("/directory", trackUsage("read:alumni"), getAlumniDirectory);

export default router;