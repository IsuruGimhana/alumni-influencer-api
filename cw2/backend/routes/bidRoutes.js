import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";
import { placeBid, getMyBid } from "../controllers/bidController.js";
import { bidValidation } from "../middleware/validator.js";

const router = express.Router();

router.post("/", protect, authorize("alumni"), bidValidation, placeBid);
router.get("/me", protect, authorize("alumni"), getMyBid);

export default router;