import axios from "axios";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import * as geolib from "geolib";

// 📍 Cauvery Bhawan boundary (rectangle)
const hostelBoundary = [
  { latitude: 29.94520, longitude: 76.81420 },
  { latitude: 29.94520, longitude: 76.81510 },
  { latitude: 29.94460, longitude: 76.81510 },
  { latitude: 29.94460, longitude: 76.81420 }
];

export const markFaceAttendance = async (req, res) => {
  console.log("========== ATTENDANCE DEBUG ==========");

  try {
    const { email, image, latitude, longitude } = req.body;

    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);

    if (!email || !image) {
      return res.status(400).json({
        success: false,
        message: "Email and image required",
      });
    }

    // 🌐 IP DEBUG
    const clientIP =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress ||
      "unknown";

    console.log("🌐 Client IP:", clientIP);

    // ==========================
    // 📍 LOCATION (RECTANGLE CHECK)
    // ==========================
    if (latitude && longitude) {
      const insideHostel = geolib.isPointInPolygon(
        { latitude: Number(latitude), longitude: Number(longitude) },
        hostelBoundary
      );

      console.log("📍 Inside Cauvery Bhawan:", insideHostel);

      if (!insideHostel) {
        return res.status(403).json({
          success: false,
          message: "You must be inside Cauvery Bhawan",
        });
      }
    } else {
      console.log("⚠️ Location not provided");
    }

    // ==========================
    // 👤 GET USER
    // ==========================
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.photo || !user.photo.startsWith("http")) {
      return res.status(400).json({
        success: false,
        message: "Invalid stored photo",
      });
    }

    // ==========================
    // 🧹 CLEAN BASE64
    // ==========================
    let cleanBase64 = image;

    if (typeof image === "string" && image.startsWith("data:image")) {
      cleanBase64 = image.split(",")[1];
    }

    if (!cleanBase64 || cleanBase64.length < 100) {
      return res.status(400).json({
        success: false,
        message: "Invalid image data",
      });
    }

    console.log("📸 Stored Image:", user.photo);
    console.log("📸 Live Image Length:", cleanBase64.length);

    // ==========================
    // 🤖 FACE VERIFY API
    // ==========================
    let response;

    try {
      response = await axios.post(
        "https://jagriti-aswal-face-auth-api.hf.space/face/login",
        {
          stored_image: user.photo,
          live_image: cleanBase64,
        }
      );
    } catch (err) {
      console.error("🔥 ML API ERROR:", err.response?.data || err.message);

      return res.status(500).json({
        success: false,
        message: "Face verification service failed",
      });
    }

    console.log("🤖 FACE RESPONSE:", response.data);

    if (!response.data.success) {
      return res.status(401).json({
        success: false,
        message: "Face not matched",
      });
    }

    console.log("✅ FACE MATCHED");

    // ==========================
    // 📅 ATTENDANCE LOGIC
    // ==========================
    const today = new Date().toISOString().split("T")[0];

    const already = await Attendance.findOne({
      student: user._id,
      date: today,
    });

    if (already) {
      return res.json({
        success: true,
        message: "Attendance already marked",
      });
    }

    await Attendance.create({
      student: user._id,
      date: today,
    });

    return res.json({
      success: true,
      message: "Attendance marked successfully",
    });

  } catch (error) {
    console.error("🔥 FULL ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};