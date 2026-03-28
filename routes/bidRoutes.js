import express from "express";
import protect from "../middleware/authMiddleware.js";
import { placeBid, getMyBid } from "../controllers/bidController.js";

const router = express.Router();

router.post("/", protect, placeBid);
router.get("/me", protect, getMyBid);

export default router;