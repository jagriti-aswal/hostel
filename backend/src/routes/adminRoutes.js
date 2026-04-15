

import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminOnly.js";
import supabase from "../config/supabase.js";
import fs from "fs";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";
const router = express.Router();


router.post(
  "/students",
  protect,
  adminOnly,
  upload.single("photo"),
  async (req, res) => {
    try {

      const { name, email, password, rollNumber, roomNumber } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      let photoUrl = "";

      if (req.file) {

        const fileBuffer = fs.readFileSync(req.file.path);

        const fileName = `${Date.now()}-${req.file.originalname}`;

        const { data, error } = await supabase.storage
          .from("students")
          .upload(fileName, fileBuffer, {
            contentType: req.file.mimetype,
          });

        if (error) throw error;

        photoUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/students/${fileName}`;
      }

      const student = await User.create({
        name,
        email,
        password: hashedPassword,
        rollNumber,
        roomNumber,
        role: "student",
        photo: photoUrl,
      });

      res.status(201).json(student);

    } catch (err) {
      console.error("UPLOAD ERROR 👉", err);
      res.status(500).json({ message: err.message });
    }
  }
);
/* ================= GET ALL STUDENTS ================= */

// router.get("/students", protect, adminOnly, async (req, res) => {
//   try {
//     const students = await User.find({ role: "student" }).select(
//       "_id name rollNumber roomNumber photo"
//     );

//     res.json(students);
//   } catch (error) {
//     console.error("GET STUDENTS ERROR 👉", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
router.get("/students", protect, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select(
      "_id name rollNumber roomNumber photo email"
    );

    const today = new Date();

    const updatedStudents = await Promise.all(
      students.map(async (student) => {

        const leave = await Leave.findOne({
          email: student.email,
          from: { $lte: today },
          to: { $gte: today },
        });

        return {
          ...student._doc,
          isOnLeave: !!leave, // 🔥 THIS IS WHAT FRONTEND NEEDS
        };
      })
    );

    res.json(updatedStudents);

  } catch (error) {
    console.error("GET STUDENTS ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/attendance", protect, adminOnly, async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const records = await Attendance.find({ date: today });

    res.json(records);
  } catch (error) {
    console.error("GET ATTENDANCE ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});
/* ================= DELETE STUDENT (OPTIONAL BUT USEFUL) ================= */

router.delete("/students/:id", protect, adminOnly, async (req, res) => {
  try {
    const student = await User.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("DELETE STUDENT ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;