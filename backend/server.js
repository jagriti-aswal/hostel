import express from "express";
import dotenv from "dotenv";

dotenv.config();

import cors from "cors";
import path from "path";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import faceAuthRoutes from "./src/routes/faceAuth.routes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";


const app = express();
app.use("/api", uploadRoutes);
// ==========================
// CORS
// ==========================
app.use(
  cors({
    origin: "http://localhost:8080",
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
// ROUTES
// ==========================

// Auth routes
app.use("/api/auth", authRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

// ✅ Face attendance route (IMPORTANT CHANGE)
app.use("/api", faceAuthRoutes);

// ==========================
// STATIC FILES
// ==========================
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ==========================
// TEST ROUTE (Optional Debug)
// ==========================
app.get("/api/test", (req, res) => {
  res.json({ message: "Server working" });
});

// ==========================
// SERVER START
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});