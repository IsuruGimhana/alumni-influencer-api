import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Bid = sequelize.define("Bid", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "pending", // pending | winning | lost
  },
  bidDate: {
    type: DataTypes.DATEONLY, // YYYY-MM-DD
    defaultValue: DataTypes.NOW,
  },
  isWinner: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

// Associate Bid with User (1:Many)
// A user can have multiple bids, and a bid belongs to a user.
Bid.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(Bid, { foreignKey: "userId" });

export default Bid;