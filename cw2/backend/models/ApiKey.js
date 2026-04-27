import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const ApiKey = sequelize.define("ApiKey", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  key: { type: DataTypes.STRING, unique: true, allowNull: false },
  label: { type: DataTypes.STRING, defaultValue: "Default Key" },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  // clientType: { type: DataTypes.STRING, allowNull: false },
  clientType: {
    type: DataTypes.ENUM("dashboard", "ar_app"),
    allowNull: false
  },
// NEW: Store scopes as a JSON array (e.g., ["read:analytics", "read:alumni"])
  scopes: { 
    type: DataTypes.JSON, 
    allowNull: false,
    defaultValue: ["read:alumni_of_day"] 
  },
}, { timestamps: true });

ApiKey.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(ApiKey, { foreignKey: "userId" });

export default ApiKey;