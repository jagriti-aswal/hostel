import express from "express";
import Leave from "../models/Leave.js";

const router = express.Router();

// APPLY LEAVE
router.post("/", async (req, res) => {
  try {
    const { email, from, to, reason } = req.body;

    await Leave.create({ email, from, to, reason });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// CHECK LEAVE
router.get("/check", async (req, res) => {
  try {
    const { email } = req.query;

    const today = new Date();
    today.setHours(0,0,0,0);

    const leave = await Leave.findOne({
      email,
      from: { $lte: today },
      to: { $gte: today },
    });

    res.json({ isOnLeave: !!leave });

  } catch (err) {
    console.error(err);
    res.status(500).json({ isOnLeave: false });
  }
});

export default router;