import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  rollNumber: String,
  roomNumber: String,
  
  photo: { type: String },

  faceEmbedding: {          // 👈 ADD THIS EXACTLY HERE
    type: [Number],
    default: []
  },

  role: { type: String, default: "student" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);