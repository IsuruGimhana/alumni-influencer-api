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
import {
  profileValidation,
  degreeValidation,
  certificationValidation,
  workValidation,
  licenseValidation,
  courseValidation,
  idParamValidation,
  imageUploadValidation
} from "../middleware/validator.js";

const router = express.Router();

// Publicly accessible resource
router.get("/featured/alumnus-of-the-day", getAlumnusOfTheDay);

// --- Base Profile ---
router.get("/me", protect, getMyProfile);
router.post("/", protect, profileValidation, createOrUpdateProfile);
router.post("/me/image", protect, upload.single("profileImage"), imageUploadValidation, uploadImage);

// --- Sub-Resources of Profile ---
router.post("/degrees", protect, degreeValidation, addDegree);
router.put("/degrees/:id", protect, idParamValidation, degreeValidation, updateDegree);
router.delete("/degrees/:id", protect, idParamValidation, deleteDegree);

router.post("/certifications", protect, certificationValidation, addCertification);
router.put("/certifications/:id", protect, idParamValidation, certificationValidation, updateCertification);
router.delete("/certifications/:id", protect, idParamValidation, deleteCertification);

router.post("/experience", protect, workValidation, addWork); // 'experience' is more descriptive than 'work'
router.put("/experience/:id", protect, idParamValidation, workValidation, updateWork);
router.delete("/experience/:id", protect, idParamValidation, deleteWork);

router.post("/licenses", protect, licenseValidation, addLicense);
router.put("/licenses/:id", protect, idParamValidation, licenseValidation, updateLicense);
router.delete("/licenses/:id", protect, idParamValidation, deleteLicense);

router.post("/courses", protect, courseValidation, addCourse);
router.put("/courses/:id", protect, idParamValidation, courseValidation, updateCourse);
router.delete("/courses/:id", protect, idParamValidation, deleteCourse);

export default router;