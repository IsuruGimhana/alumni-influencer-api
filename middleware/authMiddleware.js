import jwt from "jsonwebtoken";
import db from "../models/index.js";

const User = db.User;

const protect = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ msg: "No token, access denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

export default protect;