import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import ApiKey from "./ApiKey.js";

const ApiUsage = sequelize.define("ApiUsage", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  endpoint: {
    type: DataTypes.STRING,
    allowNull: false,
  },

}, {
  // Only keep track of createdAt, not updatedAt
  timestamps: true, 
  updatedAt: false
});

ApiUsage.belongsTo(ApiKey, { foreignKey: "apiKeyId", onDelete: "CASCADE" });
ApiKey.hasMany(ApiUsage, { foreignKey: "apiKeyId" });

export default ApiUsage;