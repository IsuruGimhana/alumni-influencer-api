import multer from "multer";
import path from "path";
import fs from "fs";

/**
 * File Upload Middleware (Multer)
 *
 * Handles image uploads for user profile pictures.
 *
 * Logic:
 * - Ensures uploads directory exists before storing files.
 * - Stores files on disk with unique filenames (userId + timestamp).
 * - Restricts uploads to image formats (jpg, jpeg, png, webp).
 * - Enforces file size limit (2MB max).
 * - Rejects invalid file types before saving to disk.
 */

// Ensure upload directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Create the uploads directory if it doesn't exist
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use user ID and timestamp to create a unique filename, preserving the original extension
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mimetype = allowedTypes.test(file.mimetype); // Check MIME type (e.g., "image/jpeg")
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Only .png, .jpg, .jpeg and .webp formats are allowed!"));
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: fileFilter
});

export default upload;