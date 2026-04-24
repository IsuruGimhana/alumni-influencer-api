import express from "express";
import { getMe, register, login, logout, verifyEmail, forgotPassword, resetPassword } from "../controllers/authController.js";
import { emailValidation, passwordValidation, roleValidation } from "../middleware/validator.js";

const router = express.Router();

router.get("/me", getMe);

router.post("/register", emailValidation, passwordValidation, roleValidation, register);
router.post("/login", emailValidation, passwordValidation, login);
router.post("/logout", logout);

router.get("/verify/:token", verifyEmail);
router.post("/password/forgot", emailValidation, forgotPassword);
router.post("/password/reset/:token", passwordValidation, resetPassword);

export default router;