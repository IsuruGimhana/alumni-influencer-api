// routes/apiRoutes.js
import express from "express";
const router = express.Router();

import trackUsage from "../middleware/apiKeyMiddleware.js";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";
import { generateApiKey, revokeApiKey, listApiKeys, getKeyStats, getAlumnusOfTheDay } from "../controllers/apiKeyController.js";
import { apiKeyGenerationValidation, idParamValidation } from "../middleware/validator.js";

// Private Developer Routes (Require JWT/Cookie Authentication)

// create api key
router.post("/", protect, authorize("developer"), apiKeyGenerationValidation, generateApiKey); 

// get all api keys of the current developer
router.get("/me", protect, authorize("developer"), listApiKeys);

// revoke a specific api key (deactivate it)
router.delete("/:id", protect, authorize("developer"), idParamValidation, revokeApiKey);

// get usage stats for a specific api key
router.get("/:id/stats", protect, authorize("developer"), idParamValidation, getKeyStats);

// Public API Route (Requires Bearer Token)
router.get("/featured/alumnus-of-the-day", trackUsage, getAlumnusOfTheDay);

export default router;