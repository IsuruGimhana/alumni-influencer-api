import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Profile from "./Profile.js";

const Work = sequelize.define("Work", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  jobTitle: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING, allowNull: false },
  startDate: { type: DataTypes.DATEONLY, allowNull: false },
  endDate: { type: DataTypes.DATEONLY }, // Can be null if "Present"
  description: { type: DataTypes.STRING },
}, {
  timestamps: true
});

// Associate Work with Profile (1:Many)
// A profile can have multiple work experiences, and a work experience belongs to a profile.
Work.belongsTo(Profile, { foreignKey: "profileId", onDelete: "CASCADE" }); // This creates a foreign key 'profileId' in the Work model
Profile.hasMany(Work, { foreignKey: "profileId" });

export default Work;