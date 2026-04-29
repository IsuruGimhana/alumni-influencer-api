import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Create and export a Sequelize instance (ORM) to connect to PostgreSQL.
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;