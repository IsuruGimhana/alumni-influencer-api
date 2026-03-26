import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Profile from "./Profile.js";

const Course = sequelize.define("Course", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  institution: { type: DataTypes.STRING },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE },
  link: { type: DataTypes.STRING },
});

// Associate Course with Profile (1:Many)
// A profile can have multiple courses, and a course belongs to a profile.
Course.belongsTo(Profile, { foreignKey: "profileId", onDelete: "CASCADE" }); // This creates a foreign key 'profileId' in the Course model
Profile.hasMany(Course, { foreignKey: "profileId" });

export default Course;