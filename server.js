import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cron from "node-cron";
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// Load environment variables from .env file
dotenv.config();

// import model squelize instance
import db from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";

// import utility functions
import { selectDailyWinner } from "./utils/selectWinner.js";

const app = express();

// swagger setup
const swaggerDocument = YAML.load(
  path.resolve("./swagger.yaml")
);
// Serve Swagger UI at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());

// Serve the uploads folder so images are accessible via URL
app.use("/uploads", express.static("uploads"));

// test route
app.get("/", (req, res) => {
  res.send("API running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/bids", bidRoutes);

// connect to database
const connectDb = async () => {
  try {
    // await db.sequelize.authenticate(); // test the database connection
    await db.sequelize.sync({ force: false }); // sync models with database (force: false to avoid dropping tables)
    console.log("Database connected");

    // --- TEST LOGIC START ---
    // console.log("TEST: Running selectDailyWinner() immediately for testing...");
    // await selectDailyWinner();

    // Run after db connection is established at midnight every day
    cron.schedule("0 0 * * *", async () => {
      try {
        console.log("System: Starting Daily Alumni Selection...");
        await selectDailyWinner();
      } catch (error) {
        console.error("Cron job failed:", error);
      }
    }, { timezone: "UTC" }); // Set timezone to UTC or your desired timezone
  } catch (err) {
    console.log(err);
  }
};

connectDb();

const PORT = process.env.PORT || 5050;

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});