import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

// import model squelize instance
import db from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

// connect to database
const connectDb = async () => {
  try {
    // await db.sequelize.authenticate(); // test the database connection
    await db.sequelize.sync({ force: false }); // sync models with database (force: false to avoid dropping tables)
    console.log("Database connected");
  } catch (err) {
    console.log(err);
  }
};

connectDb();

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieParser());

// test route
app.get("/", (req, res) => {
  res.send("API running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});