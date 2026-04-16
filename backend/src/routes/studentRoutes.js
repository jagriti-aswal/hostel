import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET /api/student/me
 * returns logged-in student full profile
 */
router.get("/me", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // comes from JWT middleware

    const student = await User.findById(userId).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.json({
      success: true,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        rollNo: student.rollNumber, // IMPORTANT (your DB field)
        roomNumber: student.roomNumber,
        photo: student.photo,
        role: student.role,
      },
    });
  } catch (err) {
    console.error("GET STUDENT PROFILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;