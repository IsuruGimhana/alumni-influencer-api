import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

const User = db.User;

// REGISTER
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check university email
    const allowedDomains = ["@westminster.ac.uk", "@my.westminster.ac.uk"];

    if (!allowedDomains.some(domain => email.endsWith(domain))) {
      return res.status(400).json({ msg: "Please use your university email address." });
    }

    // check existing user
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ msg: "User already exists. Please login or check your email." });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create verification token (32 bytes random string)
    const token = crypto.randomBytes(32).toString("hex");

    const verificationToken = token;
    const verificationTokenExpiry = Date.now() + 1000 * 60 * 60; // 1 hour

    const user = await User.create({
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry,
    });

    // In production, use an environment variable for the Frontend URL
    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5050";
    const verificationLink = `${frontendUrl}/api/auth/verify/${token}`;

    // send verification email
    await sendEmail(
      email,
      "Verify your Westminster Account",
      `<p>Click the link below to verify your account. This link expires in 1 hour:</p>
       <a href="${verificationLink}">${verificationLink}</a>`
    );
    // res.status(201).json({ msg: "Registration successful." });
    res.status(201).json({ msg: "Verification email sent! Check your inbox." });

  } catch (err) {
    // res.status(500).json({ error: "Server error during registration." });
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ msg: "Email not verified" });
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

    res.json({ msg: "Login successful" });

  } catch (err) {
    res.status(500).json({ error: "Login error." });
  }
};

export const verifyEmail = async (req, res) => {

  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid token" });
    }

    if (user.verificationTokenExpiry < Date.now()) {
      return res.status(400).json({ msg: "Token expired" });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiry = null;

    await user.save();

    res.json({ msg: "Email verified successfully. You can now log in." });

  } catch (err) {
    res.status(500).json({ error: "Verification failed." });
  }
};