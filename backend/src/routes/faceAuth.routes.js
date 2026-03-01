import express from "express";
import { markFaceAttendance } from "../controllers/face_attendence.js";

const router = express.Router();

router.post("/face-attendance", markFaceAttendance);

export default router;