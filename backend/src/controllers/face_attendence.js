import axios from "axios";
import fs from "fs";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import geolib from "geolib";
const hostelBoundary = [
  { latitude: 29.94520, longitude: 76.81420 },
  { latitude: 29.94520, longitude: 76.81510 },
  { latitude: 29.94460, longitude: 76.81510 },
  { latitude: 29.94460, longitude: 76.81420 }
];
const COLLEGE_LAT = 29.94510901968636;
const COLLEGE_LON = 76.81464359926188;
const MAX_DISTANCE = 300; // meters

export const markFaceAttendance = async (req, res) => {
  try {
    const { email, image, latitude, longitude } = req.body;
    console.log("Student Latitude:", latitude);
console.log("Student Longitude:", longitude);

    if (!email || !image) {
      return res.status(400).json({
        success: false,
        message: "Email and image required",
      });
    }


const insideHostel = geolib.isPointInPolygon(
  { latitude, longitude },
  hostelBoundary
);

console.log("Student location:", latitude, longitude);
console.log("Inside hostel:", insideHostel);

// if (!insideHostel) {
//   return res.status(403).json({
//     success: false,
//     message: "You must be inside Cauvery Bhawan to mark attendance"
//   });
// }

    // ===== LOCATION CHECK END =====
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
function getDistance(lat1, lon1, lat2, lon2) {

  const R = 6371e3;

  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;

  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
 const response = await axios.post(
      "https://jagriti-aswal-face-auth-api.hf.space/face/login",
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
//    await Attendance.create({
//   student: user._id,   // ✅ THIS IS REQUIRED
//   date: new Date(),
// });
// 4️⃣ Mark attendance

const today = new Date().toISOString().split("T")[0];

// check already marked
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

// save attendance
await Attendance.create({
  student: user._id,
  date: today,
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