import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Profile from "./Profile.js";

// work history
const Work = sequelize.define("Work", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  institution: { type: DataTypes.STRING },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE },
  link: { type: DataTypes.STRING },
});

// Associate Work with Profile (1:Many)
// A profile can have multiple work experiences, and a work experience belongs to a profile.
Work.belongsTo(Profile, { foreignKey: "profileId", onDelete: "CASCADE" }); // This creates a foreign key 'profileId' in the Work model
Profile.hasMany(Work, { foreignKey: "profileId" });

export default Work;