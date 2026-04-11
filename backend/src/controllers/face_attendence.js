export const markFaceAttendance = async (req, res) => {
  try {
    const { email, image, latitude, longitude } = req.body;

    console.log("Student Latitude:", latitude);
    console.log("Student Longitude:", longitude);

    // ==========================
    // ❗ VALIDATION
    // ==========================
    if (!email || !image) {
      return res.status(400).json({
        success: false,
        message: "Email and image required",
      });
    }

    // ==========================
    // 📍 LOCATION CHECK
    // ==========================
    if (latitude && longitude) {
      try {
        const distance = geolib.getDistance(
          { latitude: Number(latitude), longitude: Number(longitude) },
          { latitude: COLLEGE_LAT, longitude: COLLEGE_LON }
        );

        console.log("Distance from hostel:", distance);

        if (distance > MAX_DISTANCE) {
          return res.status(403).json({
            success: false,
            message: "Outside hostel area",
          });
        }
      } catch (err) {
        console.error("Location error:", err.message);
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

    console.log("Stored Image:", user.photo);
    console.log("Live Image Length:", cleanBase64.length);

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
      console.error("ML API ERROR:", err.response?.data || err.message);

      return res.status(500).json({
        success: false,
        message: "Face verification service failed",
      });
    }

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
    console.error("Face attendance error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};