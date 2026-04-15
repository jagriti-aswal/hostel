const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  email: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  reason: String,
}, { timestamps: true });

module.exports = mongoose.model("Leave", leaveSchema);