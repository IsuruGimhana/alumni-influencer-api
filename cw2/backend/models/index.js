/**
 * Database Index (Model Registry)
 *
 * Central registry that connects Sequelize instance with all application models.
 * Provides a single access point for database operations across the project.
 *
 * Logic:
 * - Imports Sequelize connection instance.
 * - Registers all models (tables) in a single db object.
 * - Exposes models and sequelize instance for use in controllers.
 * - Enables association setup between models in a centralized location.
 */

import sequelize from "../config/db.js";
import User from "./User.js";
import Profile from "./Profile.js";
import Degree from "./Degree.js";
import Course from "./Course.js";
import License from "./License.js";
import Work from "./Work.js";
import Certification from "./Certification.js";
import Bid from "./Bid.js";
import ApiKey from "./ApiKey.js";
import ApiUsage from "./ApiUsage.js";

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Profile = Profile;
db.Degree = Degree;
db.Course = Course;
db.License = License;
db.Work = Work;
db.Certification = Certification;
db.Bid = Bid;
db.ApiKey = ApiKey;
db.ApiUsage = ApiUsage;


export default db;