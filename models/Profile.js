import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Profile = sequelize.define("Profile", {

  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  fullName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },

  bio: { 
    type: DataTypes.TEXT 
  },

  linkedIn: { 
    type: DataTypes.STRING 
  },
  profileImage: { 
    type: DataTypes.STRING 
  },

}, {
  timestamps: true,
});

// Associate Profile with User (1:1)
// A profile belongs to a user, and if the user is deleted, the profile should also be deleted (CASCADE)
Profile.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" }); // This creates a foreign key 'userId' in the Profile model
User.hasOne(Profile, { foreignKey: "userId" });

export default Profile;