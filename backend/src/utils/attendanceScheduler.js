import cron from "node-cron";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import { sendEmail } from "./sendEmail.js";

export const startAttendanceReminder = () => {

  // ⏰ 9:30 PM daily
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Running attendance reminder...");

    const today = new Date().toISOString().split("T")[0];

    const allStudents = await User.find({ role: "student" });
    const present = await Attendance.find({ date: today });

    const presentIds = present.map(a => a.student.toString());

    const absentStudents = allStudents.filter(
      s => !presentIds.includes(s._id.toString())
    );

    console.log("🚨 Absent:", absentStudents.length);

    for (const student of absentStudents) {
      await sendEmail(student.email, student.name);
    }

  });

};