import { body, validationResult, param } from 'express-validator';

// Standardized helper to catch and return validation errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(400).json({ 
    errors: errors.array().map(err => ({ field: err.path, msg: err.msg })) 
  });
};

/** 
 * AUTHENTICATION ROUTES VALIDATION
 * */ 

// Email Validation
export const emailValidation = [
  body('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail()
    .custom(value => {
      if (!value.endsWith('@westminster.ac.uk') && !value.endsWith('@my.westminster.ac.uk')) {
        throw new Error('Please use your university email address.');
      }
      return true;
    }),
  validate
];

// Password Validation
export const passwordValidation = [
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/).withMessage('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'),
  validate
];

// Role Validation (for registration)
export const roleValidation = [
  body('role')
    .optional() // Allow it to be optional, default will be set in controller
    .isIn(['alumni', 'developer', 'dashboard']).withMessage('Role must be one of: alumni, developer, dashboard'),
  validate
];

/**
 * PROFILE VALIDATION
 */

// shared rules
const profileRules = [
  body("city")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage("City must be under 100 characters"),

  body("country")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage("Country must be under 100 characters"),

  body("bio")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage("Bio must be under 500 characters"),

  body("linkedInUrl")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Invalid LinkedIn URL"),

  body("attendedEvent")
    .optional()
    .isBoolean().withMessage("attendedEvent must be true or false"),

  body("sponsorshipBalance")
    .optional()
    .isFloat({ min: 0 }).withMessage("Must be a positive number"),
];

// CREATE
export const profileCreateValidation = [
  body("fullName")
    .trim()
    .notEmpty().withMessage("Full name is required"),

  ...profileRules,
  validate,
];

// UPDATE
export const profileUpdateValidation = [
  body("fullName")
    .optional()
    .trim()
    .notEmpty().withMessage("Full name cannot be empty"),

  ...profileRules,
  validate,
];


/**
 * DEGREE
 */

const degreeRules = [
  body("completionDate")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("Invalid date format"),

  body("officialUrl")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Invalid University URL"),
];

export const degreeCreateValidation = [
  body("title").trim().notEmpty().withMessage("Degree title is required"),
  body("institution").trim().notEmpty().withMessage("Institution is required"),
  ...degreeRules,
  validate,
];

export const degreeUpdateValidation = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("institution").optional().trim().notEmpty().withMessage("Institution cannot be empty"),
  ...degreeRules,
  validate,
];


/**
 * WORK / EXPERIENCE
 */

const workRules = [
  body("endDate")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("Invalid end date format"),

  body("description")
    .optional({ checkFalsy: true })
    .trim(),
];

export const workCreateValidation = [
  body("jobTitle").trim().notEmpty().withMessage("Job title is required"),
  body("company").trim().notEmpty().withMessage("Company name is required"),

  body("startDate")
    .notEmpty().withMessage("Start date is required")
    .bail()
    .isISO8601().withMessage("Invalid start date"),

  ...workRules,
  validate,
];

export const workUpdateValidation = [
  body("jobTitle").optional().trim().notEmpty().withMessage("Job title cannot be empty"),
  body("company").optional().trim().notEmpty().withMessage("Company cannot be empty"),

  body("startDate")
    .optional()
    .isISO8601().withMessage("Invalid start date"),

  ...workRules,
  validate,
];


/**
 * CERTIFICATIONS
 */

const certificationRules = [
  body("completionDate")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("Invalid date"),

  body("certificationUrl")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Invalid URL"),
];

export const certificationCreateValidation = [
  body("title").trim().notEmpty().withMessage("Certification name is required"),
  body("issuer").trim().notEmpty().withMessage("Organization is required"),
  ...certificationRules,
  validate,
];

export const certificationUpdateValidation = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("issuer").optional().trim().notEmpty().withMessage("Issuer cannot be empty"),
  ...certificationRules,
  validate,
];


/**
 * LICENSES
 */

const licenseRules = [
  body("completionDate")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("Invalid date"),

  body("licenseUrl")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Invalid URL"),
];

export const licenseCreateValidation = [
  body("title").trim().notEmpty().withMessage("License name is required"),
  body("awardingBody").trim().notEmpty().withMessage("Organization is required"),
  ...licenseRules,
  validate,
];

export const licenseUpdateValidation = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("awardingBody").optional().trim().notEmpty().withMessage("Organization cannot be empty"),
  ...licenseRules,
  validate,
];


/**
 * COURSES
 */

const courseRules = [
  body("completionDate")
    .optional({ checkFalsy: true })
    .isISO8601().withMessage("Invalid date"),

  body("courseUrl")
    .optional({ checkFalsy: true })
    .isURL().withMessage("Invalid URL"),
];

export const courseCreateValidation = [
  body("title").trim().notEmpty().withMessage("Course name is required"),
  body("institution").trim().notEmpty().withMessage("Institution is required"),
  ...courseRules,
  validate,
];

export const courseUpdateValidation = [
  body("title").optional().trim().notEmpty().withMessage("Title cannot be empty"),
  body("institution").optional().trim().notEmpty().withMessage("Institution cannot be empty"),
  ...courseRules,
  validate,
];

/**
 * ID PARAMETER VALIDATION
 * Used for all PUT and DELETE routes
 * Since your models use DataTypes.UUIDV4, we must validate for UUID format.
 */
export const idParamValidation = [
  param('id')
    .isUUID(4) // Specifically checks for UUID Version 4 format
    .withMessage('Invalid ID format. Expected a valid UUID.'),
  validate
];

/**
 * 7. IMAGE UPLOAD VALIDATION
 * Validates that a file was uploaded and is an image
 */
export const imageUploadValidation = (req, res, next) => {
  // console.log("file:", req.file);
  // console.log("body:", req.body);
  // 1. Check if file exists (Multer puts it in req.file)
  if (!req.file) {
    return res.status(400).json({ msg: "Please select an image to upload." });
  }

  // 2. Validate File Type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ msg: "Invalid file type. Only JPG, PNG, and WebP are allowed." });
  }

  // 3. Validate File Size (Multer usually handles this in config, but we check here too for safety)
  // 2MB = 2 * 1024 * 1024 bytes
  if (req.file.size > 2 * 1024 * 1024) {
    return res.status(400).json({ msg: "File too large. Maximum size is 2MB." });
  }

  next();
};

/**
 * BIDDING ROUTES VALIDATION
 */
// Bid Validation
export const bidValidation = [
  body('amount')
    .notEmpty().withMessage('Bid amount is required')
    .isFloat({ min: 0.01 }).withMessage('Bid must be a positive number (minimum £0.01)')
    // Sanitize: ensure it's a number to 2 decimal places
    .customSanitizer(value => parseFloat(value).toFixed(2)),
  validate
];

/**
 * API KEY ROUTES VALIDATION
 */
// API Key Generation Validation
// export const apiKeyGenerationValidation = [
//   body('label')
//     .optional({ checkFalsy: true }) // Allow it to be empty, default will be set in controller
//     .trim()
//     .isLength({ max: 50 }).withMessage('Label must be under 50 characters'),
//   validate
// ];
export const apiKeyGenerationValidation = [
  // Validate client type
  body("clientType")
    .notEmpty().withMessage("Client type is required")
    .isIn(["dashboard", "ar_app"]).withMessage("Invalid client type"),

  // Validate label
  body("label")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage("Label must be under 50 characters"),

  validate
];