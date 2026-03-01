import bcrypt from "bcryptjs";
import User from "../models/User.js";
import axios from "axios";
import fs from "fs";

// =============================================
// ADD STUDENT
// =============================================

export const addStudent = async (req, res) => {
  try {
    console.log("🔥 ADD STUDENT CONTROLLER RUNNING");

    const { name, email, password, rollNumber, roomNumber } = req.body;

    // -----------------------------------------
    // Validate required fields
    // -----------------------------------------
    if (!name || !email || !password || !rollNumber || !roomNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // -----------------------------------------
    // Check if student already exists
    // -----------------------------------------
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    // -----------------------------------------
    // Validate photo upload
    // -----------------------------------------
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Photo is required",
      });
    }

    // -----------------------------------------
    // Hash password
    // -----------------------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // -----------------------------------------
    // Convert image to base64
    // -----------------------------------------
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image =
      "data:image/jpeg;base64," +
      imageBuffer.toString("base64");

    // -----------------------------------------
    // Call Face Service
    // -----------------------------------------
    console.log("📤 Sending image to face service...");

    let response;

    try {
      response = await axios.post(
        "http://127.0.0.1:5001/generate-embedding",
        { image: base64Image }
      );
    } catch (error) {
      console.error("❌ Face service connection error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Face service not reachable",
      });
    }

    console.log("====================================");
    console.log("📥 FACE SERVICE RESPONSE:");
    console.log(response.data);
    console.log("====================================");

    if (!response.data.success) {
      return res.status(400).json({
        success: false,
        message: response.data.message || "Face embedding failed",
      });
    }

    const embedding = response.data.embedding;

    if (!embedding || embedding.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Embedding generation failed",
      });
    }

    // -----------------------------------------
    // Save student in DB
    // -----------------------------------------
    const student = await User.create({
      name,
      email,
      password: hashedPassword,
      rollNumber,
      roomNumber,
      photo: `/uploads/students/${req.file.filename}`,
      faceEmbedding: embedding,
      role: "student",
    });

    console.log("✅ Student saved with embedding length:", embedding.length);

    return res.status(201).json({
      success: true,
      message: "Student added successfully",
      student,
    });

  } catch (error) {
    console.error("❌ Add student error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};