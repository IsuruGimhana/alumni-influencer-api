// This file groups the database connection and models together.
// It allows us to access everything from one place (db object).
// Each model (like User) represents a table in the database.
// The sequelize instance is used to run queries and sync models.

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