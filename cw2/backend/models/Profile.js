import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js"; 

const Profile = sequelize.define("Profile", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  fullName: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  bio: { type: DataTypes.TEXT },
  linkedInUrl: { type: DataTypes.STRING, validate: { isUrl: true } },
  profileImage: { type: DataTypes.STRING }, // Store the file path/URL
  // TODO: reseting attendedEvent at the start of month, and allowing admin to manually reset it if needed
  attendedEvent: { type: DataTypes.BOOLEAN, defaultValue: false }, // By default, they start with 0 events
  sponsorshipBalance: { type: DataTypes.FLOAT, defaultValue: 0.0 } // New alumni start with no sponsors
}, {
  timestamps: true,
});

// Associate Profile with User (1:1)
// A profile belongs to a user, and if the user is deleted, the profile should also be deleted (CASCADE)
Profile.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" }); // This creates a foreign key 'userId' in the Profile model
User.hasOne(Profile, { foreignKey: "userId" });

export default Profile;