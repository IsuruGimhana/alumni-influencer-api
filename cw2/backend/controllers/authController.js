import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

const User = db.User;

// GET ME
export const getMe = async (req, res) => {
  try {
    // cookie-based JWT
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ msg: "Not authenticated" });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // get user
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] } // NEVER send password
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("User fetched:", user);
    res.status(200).json(user);

  } catch (err) {
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

// REGISTER
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
    // TODO: change this back after checking.
    // await sendEmail(
    //   email,
    //   "Verify your Westminster Account",
    //   `<p>Click the link below to verify your account. This link expires in 1 hour:</p>
    //    <a href="${verificationLink}">${verificationLink}</a>`
    // );
    // res.status(201).json({ msg: "Registration successful." });
    // TODO: change this back after checking.
    // res.status(201).json({ msg: "A verification link has been sent! Check your inbox." });
    console.log(verificationLink);
    res.status(201).json({ msg: verificationLink }); // TEMP: Return the verification link in response for testing

  } catch (err) {
    // res.status(500).json({ error: "Server error during registration." });
    res.status(500).json({ msg: err.message });
  }
};

// LOGIN
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
      secure: false, // set true in production (HTTPS)
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ msg: "Login successful" });

  } catch (err) {
    res.status(500).json({ msg: "Login error." });
  }
};

// LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false, // Set to true in production (HTTPS)
    sameSite: "strict",
  });
  
  res.status(200).json({ msg: "Logout successful" });
};

// EMAIL VERIFICATION
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

// FORGOT PASSWORD
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

    // reuse your email function
    // TODO: change this back after checking.
    // await sendEmail(
    //   email,
    //   "Password Reset",
    //   `<p>Reset password: <a href="${resetLink}">${resetLink}</a></p>`
    // );

    res.status(200).json({ msg: "A reset link has been sent! Check your inbox." });
    console.log(resetLink);

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// RESET PASSWORD
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