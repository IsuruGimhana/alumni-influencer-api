import express from "express";
import { getMe, getCsrfToken, register, login, logout, verifyEmail, forgotPassword, resetPassword } from "../controllers/authController.js";
import { emailValidation, passwordValidation, roleValidation } from "../middleware/validator.js";
import protect from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.get("/csrf-token", getCsrfToken);

router.post("/register", authRateLimiter, emailValidation, passwordValidation, roleValidation, register);
router.post("/login", authRateLimiter, emailValidation, passwordValidation, login);
router.post("/logout", logout);

router.get("/verify/:token", verifyEmail);
router.post("/password/forgot", emailValidation, forgotPassword);
router.post("/password/reset/:token", passwordValidation, resetPassword);

export default router;