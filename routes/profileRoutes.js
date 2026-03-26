import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createOrUpdateProfile, addDegree, addCertification, addLicense, addCourse, addWorkExperience } from "../controllers/profileController.js";

const router = express.Router();

router.post("/", protect, createOrUpdateProfile);
router.post("/degree", protect, addDegree);
router.post("/certification", protect, addCertification);
router.post("/license", protect, addLicense);
router.post("/course", protect, addCourse);
router.post("/work", protect, addWorkExperience);

export default router;