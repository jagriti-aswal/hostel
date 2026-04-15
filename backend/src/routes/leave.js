const express = require("express");
const router = express.Router();
const Leave = require("../models/Leave");

router.post("/", async (req, res) => {
  try {
    const { email, from, to, reason } = req.body;

    if (!email || !from || !to) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    await Leave.create({
      email,
      from,
      to,
      reason,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;