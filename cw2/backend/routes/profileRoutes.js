import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";
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
  // getAlumnusOfTheDay
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
// router.get("/featured/alumnus-of-the-day", getAlumnusOfTheDay);

// --- Base Profile ---
router.get("/me", protect, authorize("alumni"), getMyProfile);
router.post("/", protect, authorize("alumni"), profileValidation, createOrUpdateProfile);
router.post("/me/image", protect, authorize("alumni"), upload.single("profileImage"), imageUploadValidation, uploadImage);

// --- Sub-Resources of Profile ---
router.post("/degrees", protect, authorize("alumni"), degreeValidation, addDegree);
router.put("/degrees/:id", protect, authorize("alumni"), idParamValidation, degreeValidation, updateDegree);
router.delete("/degrees/:id", protect, authorize("alumni"), idParamValidation, deleteDegree);

router.post("/certifications", protect, authorize("alumni"), certificationValidation, addCertification);
router.put("/certifications/:id", protect, authorize("alumni"), idParamValidation, certificationValidation, updateCertification);
router.delete("/certifications/:id", protect, authorize("alumni"), idParamValidation, deleteCertification);

router.post("/experience", protect, authorize("alumni"), workValidation, addWork); // 'experience' is more descriptive than 'work'
router.put("/experience/:id", protect, authorize("alumni"), idParamValidation, workValidation, updateWork);
router.delete("/experience/:id", protect, authorize("alumni"), idParamValidation, deleteWork);

router.post("/licenses", protect, authorize("alumni"), licenseValidation, addLicense);
router.put("/licenses/:id", protect, authorize("alumni"), idParamValidation, licenseValidation, updateLicense);
router.delete("/licenses/:id", protect, authorize("alumni"), idParamValidation, deleteLicense);

router.post("/courses", protect, authorize("alumni"), courseValidation, addCourse);
router.put("/courses/:id", protect, authorize("alumni"), idParamValidation, courseValidation, updateCourse);
router.delete("/courses/:id", protect, authorize("alumni"), idParamValidation, deleteCourse);

export default router;