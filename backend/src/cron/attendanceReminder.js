import cron from "node-cron";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import { sendEmail } from "../utils/sendEmail.js";

cron.schedule("30 21 * * *", async () => {
  console.log("⏰ Running attendance reminder job...");

  const today = new Date().toISOString().split("T")[0];

  // all students
  const students = await User.find({ role: "student" });

  for (const student of students) {
    const marked = await Attendance.findOne({
      student: student._id,
      date: today,
    });

    // ❌ if NOT marked → send mail
    if (!marked) {
      console.log("Sending mail to:", student.email);

      await sendEmail(
        student.email,
        "Attendance Reminder",
        `Hello ${student.name}, please mark your attendance before 9:30 PM.`
      );
    }
  }
});