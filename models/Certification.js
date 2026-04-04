import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Profile from "./Profile.js";

const Certification = sequelize.define("Certification", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  issuer: { type: DataTypes.STRING, allowNull: false },
  completionDate: { type: DataTypes.DATEONLY },
  certificationUrl: { type: DataTypes.STRING, validate: { isUrl: true } }
}, {
  timestamps: true,
});

// Associate Certification with Profile (1:Many)
// A profile can have multiple certifications, and a certification belongs to a profile.
Certification.belongsTo(Profile, { foreignKey: "profileId", onDelete: "CASCADE" }); // This creates a foreign key 'profileId' in the Certification model
Profile.hasMany(Certification, { foreignKey: "profileId" });

export default Certification;