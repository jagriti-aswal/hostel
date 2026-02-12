import express from "express";
import axios from "axios";

const router = express.Router();

/* =========================
   FACE LOGIN
========================= */
router.post("/login", async (req, res) => {
  const { username, image } = req.body;

  console.log("HEADERS:", req.headers["content-type"]);
  console.log("BODY RECEIVED:", {
    username,
    imageLength: image ? image.length : 0
  });

  if (!username || !image) {
    return res.status(400).json({
      success: false,
      message: "Username and image are required",
    });
  }

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/face/login",
      {
        username,
        image,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 120000, // large image
      }
    );

    return res.status(200).json(response.data);

  } catch (error) {
    console.error("Face service error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Face authentication service unavailable",
      error: error.response?.data || error.message,
    });
  }
});


/* =========================
   FACE SIGNUP
========================= */
router.post("/signup", async (req, res) => {
  const { username, image } = req.body;

  if (!username || !image) {
    return res.status(400).json({
      success: false,
      message: "Username and image are required",
    });
  }

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/face/signup",
      {
        username,
        image,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 120000,
      }
    );

    return res.status(200).json(response.data);

  } catch (error) {
    console.error("Face service error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Face signup service unavailable",
      error: error.response?.data || error.message,
    });
  }
});

export default router;
