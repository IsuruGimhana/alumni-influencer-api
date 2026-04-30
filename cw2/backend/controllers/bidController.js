import { Op } from "sequelize"; // for advanced queries like date comparisons
import db from "../models/index.js";
const { Bid } = db;

/**
 * Place / Update Bid
 *
 * Handles bid creation and updates with sponsorship balance checks,
 * monthly win limits, and live bidding status feedback.
 *
 * Logic:
 * - Validate user profile and sponsorship balance.
 * - Enforce monthly win limit (based on event attendance bonus).
 * - Allow only one bid per day per user.
 * - Permit only increasing bid values for updates.
 * - Track monthly wins using start-of-month date filter.
 * - Compare against highest bid for live ranking status.
 */
export const placeBid = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!req.user.Profile) return res.status(404).json({ msg: "Create profile first" });

    const profile = req.user.Profile;

    if (amount > profile.sponsorshipBalance) {
      return res.status(400).json({ 
        msg: `Insufficient sponsorship funds. Your balance is £${profile.sponsorshipBalance}` 
      });
    }

    // check existing bid for today
    const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format

    // 1. Calculate start of the month for limit enforcement
    const startOfMonth = new Date(); // today's date
    startOfMonth.setDate(1); // set to first day of month
    startOfMonth.setHours(0, 0, 0, 0); // format as YYYY-MM-DD 00:00:00 , which is midnight of the first day of the month

    // 2. Count wins for the user in the current month
    const winsThisMonth = await Bid.count({
      where: {
        userId: req.user.id,
        isWinner: true,
        bidDate: {
          [Op.gte]: startOfMonth, // count wins from the start of the month
        }
      }
    });

    const allowedWins = profile.attendedEvent ? 4 : 3; // 4 wins if attended event, otherwise 3

    if (winsThisMonth >= allowedWins) {
      return res.status(403).json({ msg: `Bid limit reached for this month (${allowedWins} wins)` });
    }

    // 3. Handle bid placement or update
    let bid = await Bid.findOne({
      where: {
        userId: req.user.id,
        bidDate: today,
      },
    });

    let statusCode = 201;
    if (bid) {
      // only allow increasing bid
      if (amount <= bid.amount) {
        return res.status(400).json({ msg: "Bid must be higher than previous" });
      }

      bid.amount = amount;
      await bid.save();
      statusCode = 200;
    } else {
      bid = await Bid.create({
        amount,
        userId: req.user.id,
      });
    }

    //4. Blind bidding feedback (Compare against global highscore)
    const highestBiddingValue = await Bid.max("amount", { where: { bidDate: today } });
    
    const isHighest = bid.amount >= highestBiddingValue;

    res.status(statusCode).json({ 
      msg: "Bid placed", 
      status: isHighest ? "Currently Leading" : "Outbid",
      currentBid: bid.amount,
      monthlyWins: `${winsThisMonth}/${allowedWins}`
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/**
 * Get My Bid (Today)
 *
 * Retrieves the current user's bid for the current day
 * and returns its live competitive status.
 *
 * Logic:
 * - Fetch today's bid for the logged-in user.
 * - Compare against highest bid for the day.
 * - Return bid amount, DB status, and live ranking status.
 */
export const getMyBid = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-CA");
    const bid = await Bid.findOne({ where: { userId: req.user.id, bidDate: today } });

    if (!bid) return res.status(404).json({ msg: "No bid placed today." });

    // Check if they are winning right now
    const highest = await Bid.max('amount', { where: { bidDate: today } });

    res.status(200).json({
      amount: bid.amount,
      status: bid.status, // "pending", "won", or "lost"
      liveStatus: bid.amount >= highest ? "Currently Leading" : "Outbid"
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};