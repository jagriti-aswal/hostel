// // import express from "express";
// // import {
// //   createStudent,
// //   deleteStudent,
// // } from "../controllers/adminController.js";
// // import { protect, adminOnly } from "../middleware/authMiddleware.js";

// // const router = express.Router();

// // router.post("/create-student", protect, adminOnly, createStudent);
// // router.delete("/delete-student/:id", protect, adminOnly, deleteStudent);

// // export default router;
// // import express from "express";
// // import { addStudent } from "../controllers/adminController.js";
// // import { protect, adminOnly } from "../middleware/authMiddleware.js";
// // import { uploadStudentPhoto } from "../middleware/upload.js";

// // const router = express.Router();

// // router.post(
// //   "/students",
// //   protect,
// //   adminOnly,
// //   uploadStudentPhoto.single("photo"),
// //   addStudent
// // );

// // export default router;


// import express from "express";
// import bcrypt from "bcryptjs";
// import User from "../models/User.js";
// import upload from "../middleware/upload.js";
// import {protect} from "../middleware/authMiddleware.js";
// import { adminOnly } from "../middleware/adminOnly.js";

// const router = express.Router();

// router.post(
//   "/students",
//   protect,
//   adminOnly,
//   upload.single("photo"),
//   async (req, res) => {
//     try {
//       const { name, email, password, rollNumber, roomNumber } = req.body;

//       if (!name || !email || !password) {
//         return res.status(400).json({ message: "Missing fields" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const student = await User.create({
//         name,
//         email,
//         password: hashedPassword,
//         rollNumber,
//         roomNumber,
//         role: "student",
//         photo: req.file ? `/uploads/students/${req.file.filename}` : "",
//       });

//       res.status(201).json(student);
//     } catch (err) {
//       console.error("ADD STUDENT ERROR 👉", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );

// router.get("/students", async (req, res) => {
//   try {
//     const students = await User.find({ role: "student" })
//       .select("name rollNumber roomNumber");

//     res.json(students);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// export default router;


import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import upload from "../middleware/upload.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminOnly.js";
import supabase from "../config/supabase.js";
import fs from "fs";
const router = express.Router();

/* ================= ADD STUDENT ================= */

// router.post(
//   "/students",
//   protect,
//   adminOnly,
//   upload.single("photo"),
//   async (req, res) => {
//     try {
//       const { name, email, password, rollNumber, roomNumber } = req.body;

//       if (!name || !email || !password || !rollNumber || !roomNumber) {
//         return res.status(400).json({ message: "Missing required fields" });
//       }

//       // Check if email already exists
//       const existing = await User.findOne({ email });
//       if (existing) {
//         return res.status(400).json({ message: "Email already exists" });
//       }

//       const hashedPassword = await bcrypt.hash(password, 10);

//       const student = await User.create({
//         name,
//         email,
//         password: hashedPassword,
//         rollNumber,
//         roomNumber,
//         role: "student",
//         photo: req.file ? `/uploads/students/${req.file.filename}` : "",
//       });

//       res.status(201).json({
//         message: "Student added successfully",
//         student,
//       });
//     } catch (err) {
//       console.error("ADD STUDENT ERROR 👉", err);
//       res.status(500).json({ message: "Server error" });
//     }
//   }
// );


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

router.get("/students", protect, adminOnly, async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select(
      "_id name rollNumber roomNumber photo"
    );

    res.json(students);
  } catch (error) {
    console.error("GET STUDENTS ERROR 👉", error);
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