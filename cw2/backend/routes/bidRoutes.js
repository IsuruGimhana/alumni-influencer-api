import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";
import { placeBid, getMyBid } from "../controllers/bidController.js";
import { bidValidation } from "../middleware/validator.js";
import { verifyCSRF } from "../middleware/csrfMiddleware.js";

const router = express.Router();

router.post("/", verifyCSRF, protect, authorize("alumni"), bidValidation, placeBid);
router.get("/me", protect, authorize("alumni"), getMyBid);

export default router;