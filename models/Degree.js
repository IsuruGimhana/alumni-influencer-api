import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Profile from "./Profile.js";

const Degree = sequelize.define("Degree", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  institution: { type: DataTypes.STRING },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE },
  link: { type: DataTypes.STRING },
});

// Associate Degree with Profile (1:Many)
// A profile can have multiple degrees, and a degree belongs to a profile.
Degree.belongsTo(Profile, { foreignKey: "profileId", onDelete: "CASCADE" }); // This creates a foreign key 'profileId' in the Degree model
Profile.hasMany(Degree, { foreignKey: "profileId" });

export default Degree;