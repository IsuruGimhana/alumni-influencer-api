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
  profileCreateValidation,
  profileUpdateValidation,

  degreeCreateValidation,
  degreeUpdateValidation,

  certificationCreateValidation,
  certificationUpdateValidation,

  workCreateValidation,
  workUpdateValidation,

  licenseCreateValidation,
  licenseUpdateValidation,

  courseCreateValidation,
  courseUpdateValidation,

  idParamValidation,
  imageUploadValidation,
} from "../middleware/validator.js";

const router = express.Router();

// Publicly accessible resource
// router.get("/featured/alumnus-of-the-day", getAlumnusOfTheDay);

// --- Base Profile ---
router.get("/me", protect, authorize("alumni"), getMyProfile);
router.post("/", protect, authorize("alumni"), profileCreateValidation, createOrUpdateProfile);
router.put("/", protect, authorize("alumni"), profileUpdateValidation, createOrUpdateProfile);
router.post("/me/image", protect, authorize("alumni"), upload.single("profileImage"), imageUploadValidation, uploadImage);

// --- Sub-Resources of Profile ---
router.post("/degrees", protect, authorize("alumni"), degreeCreateValidation, addDegree);
router.put("/degrees/:id", protect, authorize("alumni"), idParamValidation, degreeUpdateValidation, updateDegree);
router.delete("/degrees/:id", protect, authorize("alumni"), idParamValidation, deleteDegree);

router.post("/certifications", protect, authorize("alumni"), certificationCreateValidation, addCertification);
router.put("/certifications/:id", protect, authorize("alumni"), idParamValidation, certificationUpdateValidation, updateCertification);
router.delete("/certifications/:id", protect, authorize("alumni"), idParamValidation, deleteCertification);

router.post("/experiences", protect, authorize("alumni"), workCreateValidation, addWork);
router.put("/experiences/:id", protect, authorize("alumni"), idParamValidation, workUpdateValidation, updateWork);
router.delete("/experiences/:id", protect, authorize("alumni"), idParamValidation, deleteWork);

router.post("/licenses", protect, authorize("alumni"), licenseCreateValidation, addLicense);
router.put("/licenses/:id", protect, authorize("alumni"), idParamValidation, licenseUpdateValidation, updateLicense);
router.delete("/licenses/:id", protect, authorize("alumni"), idParamValidation, deleteLicense);

router.post("/courses", protect, authorize("alumni"), courseCreateValidation, addCourse);
router.put("/courses/:id", protect, authorize("alumni"), idParamValidation, courseUpdateValidation, updateCourse);
router.delete("/courses/:id", protect, authorize("alumni"), idParamValidation, deleteCourse);

export default router;