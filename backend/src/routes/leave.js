import express from "express";
import Leave from "../models/Leave.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, from, to, reason } = req.body;

    if (!email || !from || !to) {
      return res.status(400).json({ success: false });
    }

    await Leave.create({ email, from, to, reason });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;