import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import faceAuthRoutes from "./src/routes/faceAuth.routes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import networkLock from "./networkLock.js";

import { startAttendanceReminder } from "./src/utils/attendanceScheduler.js";
import "./src/cron/attendanceReminder.js";

dotenv.config();

const app = express();

// ✅ Deploy / proxy safe (VERY IMPORTANT for IP detection)
app.set("trust proxy", true);

// ==========================
// CORS
// ==========================
app.use(
  cors({
    origin: true, // allow all (production friendly)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ==========================
// BODY PARSERS
// ==========================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ==========================
// DATABASE
// ==========================
connectDB();
console.log("🔥 SERVER FILE LOADED");

// ==========================
// 🔐 NETWORK LOCK (LOGIN ONLY)
// ==========================

// Debug log (optional but useful)
app.use("/api/auth/login", (req, res, next) => {
  console.log("✅ login middleware reached");
  next();
});

// Actual network restriction
app.use("/api/auth/login", networkLock);

// ==========================
// ROUTES
// ==========================

// Upload routes
app.use("/api", uploadRoutes);

// Auth routes
app.use("/api/auth", authRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// Face attendance routes
app.use("/api", faceAuthRoutes);

// ==========================
// STATIC FILES
// ==========================
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ==========================
// TEST ROUTE
// ==========================
app.get("/api/test", (req, res) => {
  res.json({ message: "Server working" });
});

// ==========================
// CRON / SCHEDULER
// ==========================
startAttendanceReminder();

// ==========================
// SERVER START
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});