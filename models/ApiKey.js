import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const ApiKey = sequelize.define("ApiKey", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  key: { type: DataTypes.STRING, unique: true, allowNull: false },
  label: { type: DataTypes.STRING, defaultValue: "Default Key" },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { timestamps: true });

ApiKey.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
User.hasMany(ApiKey, { foreignKey: "userId" });

export default ApiKey;