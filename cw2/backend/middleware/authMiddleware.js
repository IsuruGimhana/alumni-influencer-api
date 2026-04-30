import jwt from "jsonwebtoken";
import db from "../models/index.js";
const { User, Profile } = db;

/**
 * Authentication Middleware (Protect)
 *
 * Secures private routes by validating JWT stored in cookies.
 *
 * Logic:
 * - Extract JWT token from HTTP-only cookie.
 * - Verify token using JWT secret.
 * - Fetch user from database using decoded ID.
 * - Attach user to request object for downstream access.
 * - Conditionally load Profile data only for alumni users.
 */
const protect = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ msg: "No token, access denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // fetch basic user to check the role, then fetch the profile if it's an alumni
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Only fetch Profile if the user is an Alumni
    if (user.role === 'alumni') {
      const userWithProfile = await User.findByPk(user.id, {
        attributes: { exclude: ["password"] },
        include: [{ model: Profile }] 
      });
      req.user = userWithProfile;
    } else {
      req.user = user;
    }

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

export default protect;