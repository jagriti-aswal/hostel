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
dotenv.config();
//import { startAttendanceReminder } from "./src/utils/attendanceScheduler.js";
//import "./cron/attendanceReminder.js"; // ✅ must import
//import "./src/cron/attendanceReminder.js";
import "./src/cron/attendanceReminder.js";



const app = express();

// ✅ Deploy safe
app.set("trust proxy", true);

// ==========================
// CORS
// ==========================
app.use(
  cors({
    origin: true,
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
// ✅ LOGIN SHOULD BE PUBLIC (NO NETWORK LOCK)
// ==========================

// Debug (optional)
app.use("/api/auth/login", (req, res, next) => {
  console.log("✅ login route hit");
  next();
});

// ❌ REMOVED networkLock from login
// app.use("/api/auth/login", networkLock);

// ==========================
// ROUTES
// ==========================

// Upload routes
app.use("/api", uploadRoutes);

// Auth routes (LOGIN HERE ✅)
app.use("/api/auth", authRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// ✅ Apply network lock ONLY to attendance
app.use("/api/face-attendance", networkLock);

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
//startAttendanceReminder();

// ==========================
// SERVER START
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// import express from "express";
// import dotenv from "dotenv";

// dotenv.config();

// import cors from "cors";
// import path from "path";

// import connectDB from "./src/config/db.js";
// import authRoutes from "./src/routes/authRoutes.js";
// import adminRoutes from "./src/routes/adminRoutes.js";
// import faceAuthRoutes from "./src/routes/faceAuth.routes.js";
// import uploadRoutes from "./src/routes/uploadRoutes.js";
// import { startAttendanceReminder } from "./src/utils/attendanceScheduler.js";
// import "./src/cron/attendanceReminder.js";

// const app = express();
// app.use(
//   cors({
//     origin: "http://localhost:8080",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );
// app.use("/api", uploadRoutes);
// app.use("/api/admin", adminRoutes);
// // ==========================
// // CORS
// // ==========================


// // ==========================
// // BODY PARSERS
// // ==========================
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true }));

// // ==========================
// // DATABASE
// // ==========================
// connectDB();
// console.log("🔥 SERVER FILE LOADED");

// // ==========================
// // ROUTES
// // ==========================

// // Auth routes
// app.use("/api/auth", authRoutes);

// // Admin routes
// app.use("/api/admin", adminRoutes);

// // ✅ Face attendance route (IMPORTANT CHANGE)
// app.use("/api", faceAuthRoutes);

// // ==========================
// // STATIC FILES
// // ==========================
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// // ==========================
// // TEST ROUTE (Optional Debug)
// // ==========================
// app.get("/api/test", (req, res) => {
//   res.json({ message: "Server working" });
// });

// startAttendanceReminder();
// // ==========================
// // SERVER START
// // ==========================
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });