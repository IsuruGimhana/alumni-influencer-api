// This file groups the database connection and models together.
// It allows us to access everything from one place (db object).
// Each model (like User) represents a table in the database.
// The sequelize instance is used to run queries and sync models.

import sequelize from "../config/db.js";
import User from "./User.js";

const db = {};

db.sequelize = sequelize;
db.User = User;

export default db;