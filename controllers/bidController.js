import { Op } from "sequelize"; // for advanced queries like date comparisons
import db from "../models/index.js";
const { Bid } = db;

export const placeBid = async (req, res) => {
  try {
    const { amount } = req.body;

    // --- CHANGE: Access profile directly from req.user ---
    // This is available because your middleware used 'include: [Profile]'
    const profile = req.user.Profile;

    if (amount > profile.sponsorshipBalance) {
      return res.status(400).json({ 
        msg: `Insufficient sponsorship funds. Your balance is £${profile.sponsorshipBalance}` 
      });
    }

    // check existing bid for today
    const today = new Date().toISOString().split("T")[0]; // get YYYY-MM-DD format

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
      return res.status(400).json({ msg: `Bid limit reached for this month (${allowedWins} wins)` });
    }

    // 3. Handle bid placement or update
    let bid = await Bid.findOne({
      where: {
        userId: req.user.id,
        bidDate: today,
      },
    });

    if (bid) {
      // only allow increasing bid
      if (amount <= bid.amount) {
        return res.status(400).json({ msg: "Bid must be higher than previous" });
      }

      bid.amount = amount;
      await bid.save();
    } else {
      bid = await Bid.create({
        amount,
        userId: req.user.id,
      });
    }

    //4. Blind bidding feedback (Compare against global highscore)
    const highestBiddingValue = await Bid.max("amount", { where: { bidDate: today } });
    
    const isHighest = bid.amount >= highestBiddingValue;

    res.json({ 
      msg: "Bid placed", 
      status: isHighest ? "Winning" : "Outbid",
      currentBid: bid.amount,
      monthlyWins: `${winsThisMonth}/${allowedWins}`
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyBid = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const bid = await Bid.findOne({ where: { userId: req.user.id, bidDate: today } });

    if (!bid) return res.json({ msg: "No bid placed today." });

    // Check if they are winning right now
    const highest = await Bid.max('amount', { where: { bidDate: today } });

    res.json({
      amount: bid.amount,
      status: bid.status, // "pending", "winning", or "lost"
      liveStatus: bid.amount >= highest ? "Currently Leading" : "Outbid"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};