import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  email: String,
  from: Date,
  to: Date,
  reason: String,
});

export default mongoose.model("Leave", leaveSchema);