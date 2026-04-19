import db from "../models/index.js";
const { Bid, User, Profile } = db;
import { Op } from "sequelize";
import { sendEmail } from "./sendEmail.js";

export const selectDailyWinner = async () => {
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Get all bids for today, highest amount first
  const bids = await Bid.findAll({
    where: { bidDate: today },
    order: [['amount', 'DESC']],
    include: [{ 
      model: User,
      include: [{ model: Profile }] // to check attendedEvent and sponsorshipBalance for limit enforcement
     }]
  });

  if (bids.length === 0) return console.log("No bids placed today.");

  let winnerFound = false;

  for (let bid of bids) {
    // Check wins one last time (in case they won earlier this month)
    const winCount = await Bid.count({
      where: { userId: bid.userId, isWinner: true, bidDate: { [Op.gte]: startOfMonth } }
    });

    const userProfile = bid.User.Profile;
    const limit = userProfile.attendedEvent ? 4 : 3;

    if (!winnerFound && winCount < limit) {
      // Mark as Alumni of the Day
      bid.isWinner = true;
      bid.status = "winning";
      winnerFound = true;

      // Deduct the bid amount from the user's sponsorship balance
      userProfile.sponsorshipBalance -= bid.amount;
      await userProfile.save();

      // Send email notification to the winner
      await sendEmail(
        bid.User.email,
        "Congratulations! You are Alumnus of the Day",
        `<h1>You Won!</h1>
         <p>Your bid of £${bid.amount} was the highest today. 
         Check the AR platform to see your featured profile!</p>`
      );

      console.log(`Winner Selected: ${bid.User.email} at £${bid.amount}`);
    } else {
      bid.status = "lost";
      bid.isWinner = false;
      
      // Send email notification to the losers
      await sendEmail(
        bid.User.email,
        "Daily Alumni Selection Update",
        `<p>Unfortunately, your bid was not the winner today. 
         Try again tomorrow!</p>`
      );
    }
    await bid.save();
  }
};