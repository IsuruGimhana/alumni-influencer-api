import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Profile from "./Profile.js";

const License = sequelize.define("License", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  institution: { type: DataTypes.STRING },
  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE },
  link: { type: DataTypes.STRING },
});

// Associate License with Profile (1:Many)
// A profile can have multiple licenses, and a license belongs to a profile.
License.belongsTo(Profile, { foreignKey: "profileId", onDelete: "CASCADE" }); // This creates a foreign key 'profileId' in the License model
Profile.hasMany(License, { foreignKey: "profileId" });

export default License;