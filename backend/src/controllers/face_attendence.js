import axios from "axios";
import fs from "fs";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";

export const markFaceAttendance = async (req, res) => {
  try {
    const { email, image } = req.body;

    if (!email || !image) {
      return res.status(400).json({
        success: false,
        message: "Email and image required",
      });
    }

    // 1️⃣ Get user from DB
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.photo) {
      return res.status(400).json({
        success: false,
        message: "No stored photo",
      });
    }

    // 2️⃣ Read stored image
    // const storedImagePath = "." + user.photo;
    // const imageBuffer = fs.readFileSync(storedImagePath);

    // const storedBase64 =
    //   "data:image/jpeg;base64," +
    //   imageBuffer.toString("base64");
        
    // 3️⃣ Send both images to Python
    // 2️⃣ Read stored image

    
// const storedImagePath = "." + user.photo;
// const imageBuffer = fs.readFileSync(storedImagePath);

// const storedBase64 =
//   "data:image/jpeg;base64," +
//   imageBuffer.toString("base64");
//     const response = await axios.post(
//       "http://127.0.0.1:5001/verify-face",
//       {
//         stored_image: storedBase64,
//         live_image: image,
//       }
//     );
    //  console.log("FACE VERIFY RESPONSE:", response.data);

//     if (!response.data.success) {
//       return res.status(401).json({
//         success: false,
//         message: "Face not matched",
//       });
//     }
 const response = await axios.post(
      "http://127.0.0.1:5001/verify-face",
      {
        stored_image: user.photo, // Supabase URL
        live_image: image,        // webcam base64
      }
    );

    console.log("FACE VERIFY RESPONSE:", response.data);

    if (!response.data.success) {
      return res.status(401).json({
        success: false,
        message: "Face not matched",
      });
    }
    // 4️⃣ Mark attendance
   await Attendance.create({
  student: user._id,   // ✅ THIS IS REQUIRED
  date: new Date(),
});

    return res.json({
      success: true,
      message: "Attendance marked successfully",
    });

  } catch (error) {
    console.error("Face attendance error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};