// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import connectDB from "./src/config/db.js";
// import authRoutes from "./src/routes/authRoutes.js";
// import adminRoutes from "./src/routes/adminRoutes.js";

// dotenv.config();

// const app = express(); // ✅ FIRST create app
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// import faceAuthRoutes from "./src/routes/faceAuth.routes.js";


// // middlewares
// app.use(cors());
// app.use(express.json());
// app.use("/api/face", faceAuthRoutes);

// // database
// connectDB();
// console.log("🔥 SERVER FILE LOADED");

// // routes
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// // server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () =>
//   console.log(`🚀 Server running on port ${PORT}`)
// );



import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import faceAuthRoutes from "./src/routes/faceAuth.routes.js";

dotenv.config();

const app = express();

// ==========================
// CORS (VERY IMPORTANT)
// ==========================
app.use(
  cors({
    origin: "http://localhost:8080", // frontend port
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
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
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/face", faceAuthRoutes);

// ==========================
// STATIC FILES
// ==========================
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ==========================
// SERVER START
// ==========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
