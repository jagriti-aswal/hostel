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

    // ==========================
    // 📍 LOCATION CHECK (OPTIONAL ENABLE)
    // ==========================
    if (latitude && longitude) {
      const distance = geolib.getDistance(
        { latitude, longitude },
        { latitude: COLLEGE_LAT, longitude: COLLEGE_LON }
      );

      console.log("Distance from hostel:", distance);

      if (distance > MAX_DISTANCE) {
        return res.status(403).json({
          success: false,
          message: "Outside hostel area",
        });
      }
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

    if (!user.photo) {
      return res.status(400).json({
        success: false,
        message: "No stored photo",
      });
    }

    // ==========================
    // 🧹 CLEAN BASE64 (IMPORTANT FIX)
    // ==========================
    let cleanBase64 = image;

    if (image.startsWith("data:image")) {
      cleanBase64 = image.split(",")[1];
    }

    console.log("Stored Image URL:", user.photo);
    console.log("Live Image Length:", cleanBase64.length);

    // ==========================
    // 🤖 FACE VERIFY API
    // ==========================
    const response = await axios.post(
      "https://jagriti-aswal-face-auth-api.hf.space/face/login",
      {
        stored_image: user.photo,
        live_image: cleanBase64, // ✅ FIXED
      }
    );

    console.log("FACE VERIFY RESPONSE:", response.data);

    if (!response.data.success) {
      return res.status(401).json({
        success: false,
        message: "Face not matched",
      });
    }

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
    console.error("Face attendance error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};