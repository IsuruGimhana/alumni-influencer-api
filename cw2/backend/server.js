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
import apiKeyRoutes from "./routes/apiKeyRoutes.js";
// import { logApiUsage } from "./middleware/loggerMiddleware.js";
// import adminRoutes from "./routes/adminRoutes.js";

// import utility functions
import { selectDailyWinner } from "./utils/selectWinner.js";

const app = express();

// Swagger API documentation setup
const swaggerDocument = YAML.load(
  path.resolve("./swagger.yaml")
);
// Serve Swagger UI at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// middleware

app.use(express.json({ limit: "50mb" })); // Increase the payload limit to 50MB to handle large JSON bodies (e.g., for profile pictures)
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Also increase the limit for URL-encoded data if needed (e.g., for form submissions with large data)

/**
 * CORS configuration:
 * - Allows frontend access from CLIENT_URL
 * - Enables cookies for authentication
 */
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

/**
 * Security middleware (Helmet)
 * Enables safer HTTP headers and cross-origin resource policy
 */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

// Parse cookies for JWT authentication
app.use(cookieParser());

// Serve the uploads folder so images are accessible via URL
app.use("/uploads", express.static("uploads"));

/**
 * Test route to confirm API is running
 */
app.get("/", (req, res) => {
  res.send("API running...");
});

// API route mounting
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/keys", apiKeyRoutes);

/**
 * Database connection + initialization
 */
const connectDb = async () => {
  try {
    // await db.sequelize.authenticate(); // test the database connection
    await db.sequelize.sync({ force: false }); // sync models with database (force: false to avoid dropping tables)
    console.log("Database connected");

    // --- TEST LOGIC START ---
    // console.log("TEST: Running selectDailyWinner() immediately for testing...");
    // await selectDailyWinner();

    /**
     * CRON JOB:
     * Runs daily at midnight (UTC)
     * Executes winner selection logic for bidding system
     */
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