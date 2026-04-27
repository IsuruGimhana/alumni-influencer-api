// Alumni
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

// User model
const User = sequelize.define("User", {
  id: {
    // UUID --> Universally Unique Identifier, a string that is unique across all records.
    // eg: "550e8400-e29b-41d4-a716-446655440000"
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  
  verificationToken: {
    type: DataTypes.STRING,
  },

  verificationTokenExpiry: {
    type: DataTypes.DATE,
  },

  resetToken: {
    type: DataTypes.STRING,
  },

  resetTokenExpiry: {
    type: DataTypes.DATE,
  },

  // role: {
  //   type: DataTypes.STRING,
  //   defaultValue: "alumni", // alumni | developer | dashboard
  // }
  role: {
    type: DataTypes.ENUM("alumni", "developer", "dashboard"),
    allowNull: false,
    defaultValue: "alumni"
  }
  
}, {
  timestamps: true,
});

export default User;