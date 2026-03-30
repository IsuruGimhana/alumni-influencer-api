import express from "express";
import protect from "../middleware/authMiddleware.js";
import { placeBid, getMyBid } from "../controllers/bidController.js";
import { bidValidation } from "../middleware/validator.js";

const router = express.Router();

router.post("/", protect, bidValidation, placeBid);
router.get("/me", protect, getMyBid);

export default router;