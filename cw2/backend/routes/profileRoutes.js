import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";
import upload from "../config/multer.js";
import {
  getMyProfile,
  // createOrUpdateProfile,
  createProfile,
  updateProfile,
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
import { verifyCSRF } from "../middleware/csrfMiddleware.js";

const router = express.Router();

// Publicly accessible resource
// router.get("/featured/alumnus-of-the-day", getAlumnusOfTheDay);

// --- Base Profile ---
router.get("/me", protect, authorize("alumni"), getMyProfile);
router.post("/", verifyCSRF, protect, authorize("alumni"), profileCreateValidation, createProfile);
router.put("/", verifyCSRF, protect, authorize("alumni"), profileUpdateValidation, updateProfile);
router.post("/me/image", verifyCSRF, protect, authorize("alumni"), upload.single("profileImage"), imageUploadValidation, uploadImage);

// --- Sub-Resources of Profile ---
router.post("/degrees", verifyCSRF, protect, authorize("alumni"), degreeCreateValidation, addDegree);
router.put("/degrees/:id", verifyCSRF, protect, authorize("alumni"), idParamValidation, degreeUpdateValidation, updateDegree);
router.delete("/degrees/:id", verifyCSRF, protect, authorize("alumni"), idParamValidation, deleteDegree);

router.post("/certifications", verifyCSRF, protect, authorize("alumni"), certificationCreateValidation, addCertification);
router.put("/certifications/:id", verifyCSRF, protect, authorize("alumni"), idParamValidation, certificationUpdateValidation, updateCertification);
router.delete("/certifications/:id", verifyCSRF, protect, authorize("alumni"), idParamValidation, deleteCertification);

router.post("/experiences", verifyCSRF, protect, authorize("alumni"), workCreateValidation, addWork);
router.put("/experiences/:id", verifyCSRF, protect, authorize("alumni"), idParamValidation, workUpdateValidation, updateWork);
router.delete("/experiences/:id", verifyCSRF, protect, authorize("alumni"), idParamValidation, deleteWork);

router.post("/licenses", verifyCSRF, protect, authorize("alumni"), licenseCreateValidation, addLicense);
router.put("/licenses/:id", verifyCSRF, protect, authorize("alumni"), idParamValidation, licenseUpdateValidation, updateLicense);
router.delete("/licenses/:id", verifyCSRF, protect, authorize("alumni"), idParamValidation, deleteLicense);

router.post("/courses", verifyCSRF, protect, authorize("alumni"), courseCreateValidation, addCourse);
router.put("/courses/:id", verifyCSRF, protect, authorize("alumni"), idParamValidation, courseUpdateValidation, updateCourse);
router.delete("/courses/:id", verifyCSRF, protect, authorize("alumni"), idParamValidation, deleteCourse);

export default router;