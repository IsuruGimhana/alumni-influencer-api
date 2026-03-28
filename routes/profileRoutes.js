import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";
import {
  getMyProfile,
  createOrUpdateProfile,
  uploadImage,
  addDegree,
  updateDegree,
  deleteDegree,
  addCertification,
  updateCertification,
  deleteCertification,
  addWork,
  updateWork,
  deleteWork,
  addLicense,
  updateLicense,
  deleteLicense,
  addCourse,
  updateCourse,
  deleteCourse,
  getAlumnusOfTheDay
} from "../controllers/profileController.js";

const router = express.Router();

// --- 1. Public Routes ---
// This is for the AR client (no 'protect' needed)
router.get("/alumnus-of-the-day", getAlumnusOfTheDay);

// --- 2. Base Profile Routes (Protected) ---
router.get("/me", protect, getMyProfile);
router.post("/", protect, createOrUpdateProfile);
router.post("/upload-image", protect, upload.single("profileImage"), uploadImage);

// --- 3. Education (Degrees) ---
router.post("/degree", protect, addDegree);
router.put("/degree/:id", protect, updateDegree);
router.delete("/degree/:id", protect, deleteDegree);

// --- 4. Professional Certifications ---
router.post("/certification", protect, addCertification);
router.put("/certification/:id", protect, updateCertification);
router.delete("/certification/:id", protect, deleteCertification);

// --- 5. Employment History (Work) ---
router.post("/work", protect, addWork);
router.put("/work/:id", protect, updateWork);
router.delete("/work/:id", protect, deleteWork);

// --- 6. Professional Licenses ---
router.post("/license", protect, addLicense);
router.put("/license/:id", protect, updateLicense);
router.delete("/license/:id", protect, deleteLicense);

// --- 7. Short Courses ---
router.post("/course", protect, addCourse);
router.put("/course/:id", protect, updateCourse);
router.delete("/course/:id", protect, deleteCourse);

export default router;