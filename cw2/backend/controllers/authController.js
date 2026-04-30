import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

const User = db.User;

/**
 * Get Current User
 *
 * Returns the authenticated user's data using the protect middleware.
 *
 * Logic:
 * - Relies on protect middleware for authentication.
 * - Returns user attached to req.user.
 */
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Not authenticated" });
    }

    res.status(200).json(req.user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

/**
 * Get CSRF Token
 * 
 * Generates a secure CSRF token, sets it in a cookie, and returns it in the response.
 *
 * Logic:
 * - Generate a random 32-byte token using crypto.
 * - Set the token in a cookie named "XSRF-TOKEN"
 */
export const getCsrfToken = (req, res) => {
  const csrfToken = crypto.randomBytes(32).toString("hex");

  res.cookie("XSRF-TOKEN", csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",//false for development, true for production (HTTPS)
    sameSite: "lax",
    path: "/",
  });

  res.status(200).json({ csrfToken });
};

/**
 * User Registration
 *
 * Creates a new user account with email verification and secure password storage.
 *
 * Logic:
 * - Validate university email domain.
 * - Enforce strong password policy.
 * - Check if user already exists.
 * - Hash password using bcrypt (salt rounds = 10).
 * - Generate email verification token with expiry.
 * - Store user with unverified status.
 * - Send verification email to user.
 */
export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Domain Validation
    const allowedDomains = ["@westminster.ac.uk", "@my.westminster.ac.uk"];

    if (!allowedDomains.some(domain => email.endsWith(domain))) {
      return res.status(400).json({ msg: "Please use your university email address." });
    }

    // CRITERIA: Password Strength Validation
    // Min 8 chars, 1 upper, 1 lower, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        msg: "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character." 
      });
    }

    // Check existing user
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ msg: "User already exists. Please login or check your email." });
    }

    // CRITERIA: Bcrypt Hashing (Salt Rounds: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create verification token (32 bytes random string)
    const token = crypto.randomBytes(32).toString("hex");

    const verificationToken = token;
    const verificationTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour

    const user = await User.create({
      email,
      password: hashedPassword, // CRITERIA: Secure Storage
      role: role || "alumni",
      verificationToken,
      verificationTokenExpiry,
    });

    // In production, use an environment variable for the Frontend URL
    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5050";
    const verificationLink = `${frontendUrl}/verify/${token}`;

    // Send verification email
    await sendEmail(
      email,
      "Verify your Westminster Account",
      `<p>Click the link below to verify your account. This link expires in 1 hour:</p>
       <a href="${verificationLink}">${verificationLink}</a>`
    );
    res.status(201).json({ msg: "Registration successful." });
    // console.log(verificationLink);
    // res.status(201).json({ msg: "A verification link has been sent! Check your inbox." });
    // res.status(201).json({ msg: verificationLink }); // TEMP: Return the verification link in response for testing

  } catch (err) {
    // res.status(500).json({ error: "Server error during registration." });
    res.status(500).json({ msg: err.message });
  }
};

/**
 * User Login
 *
 * Authenticates user and issues JWT session cookie.
 *
 * Logic:
 * - Find user by email.
 * - Compare hashed password using bcrypt.
 * - Ensure email is verified before login.
 * - Generate JWT token with 1-day expiry.
 * - Store token in HTTP-only cookie.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ msg: "Email not verified" });
    }

    // JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ msg: "Login successful" });

  } catch (err) {
    res.status(500).json({ msg: "Login error." });
  }
};

/**
 * User Logout
 *
 * Clears authentication session by removing JWT cookie.
 */
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // Set to true in production (HTTPS)
    sameSite: "strict",
  });
  
  res.status(200).json({ msg: "Logout successful" });
};

/**
 * Email Verification
 *
 * Activates user account after validating email verification token.
 *
 * Logic:
 * - Find user by verification token.
 * - Check token validity and expiry.
 * - Mark user as verified.
 * - Clear verification token fields.
 */
export const verifyEmail = async (req, res) => {

  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "Invalid token" });
    }

    if (user.verificationTokenExpiry < Date.now()) {
      return res.status(400).json({ msg: "Token expired" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;

    await user.save();

    res.status(200).json({ msg: "Email verified successfully. You can now log in." });

  } catch (err) {
    res.status(500).json({ msg: "Verification failed." });
  }
};

/**
 * Forgot Password
 *
 * Initiates password reset process by sending reset link via email.
 *
 * Logic:
 * - Find user by email.
 * - Generate secure reset token with expiry (30 mins).
 * - Save token in database.
 * - Send password reset email with link.
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1000 * 60 * 30; // 30 mins

    await user.save();

    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5050";
    const resetLink = `${frontendUrl}/reset-password/${token}`;

    await sendEmail(
      email,
      "Password Reset",
      `<p>Reset password: <a href="${resetLink}">${resetLink}</a></p>`
    );

    console.log(resetLink);
    res.status(200).json({ msg: "A reset link has been sent! Check your inbox." });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * Reset Password
 *
 * Resets user password using a valid reset token.
 *
 * Logic:
 * - Validate reset token and expiry.
 * - Enforce strong password policy.
 * - Hash new password using bcrypt.
 * - Update user password and clear reset token fields.
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      where: { resetToken: token },
    });

    if (!user) {
      return res.status(404).json({ msg: "Invalid token" });
    }

    if (user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ msg: "Token expired" });
    }

    // CRITERIA: Password Strength Validation
    // Min 8 chars, 1 upper, 1 lower, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        msg: "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character." 
      });
    }

    // CRITERIA: Bcrypt Hashing (Salt Rounds: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword; // CRITERIA: Secure Storage
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.status(200).json({ msg: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};