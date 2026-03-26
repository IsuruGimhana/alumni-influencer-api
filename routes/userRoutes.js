import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// protected route
router.get("/me", protect, (req, res) => {
  res.json({
    msg: "Protected route accessed",
    user: req.user,
  });
});

export default router;