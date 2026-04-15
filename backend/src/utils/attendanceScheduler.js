import cron from "node-cron";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import { sendEmail } from "./sendEmail.js";

export const startAttendanceReminder = () => {

//   // ⏰ 9:30 PM daily
//   cron.schedule("25 21 * * *", async () => {
//     console.log("⏰ Running attendance reminder...");

//     const today = new Date().toISOString().split("T")[0];

//     const allStudents = await User.find({ role: "student" });
//     const present = await Attendance.find({ date: today });

//     const presentIds = present.map(a => a.student.toString());

//     const absentStudents = allStudents.filter(
//       s => !presentIds.includes(s._id.toString())
//     );

//     console.log("🚨 Absent:", absentStudents.length);

//     for (const student of absentStudents) {
//       await sendReminderEmail(student.email, student.name);
//     }

//   });

// };


cron.schedule("28 22 * * *", async () => {
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
    await sendReminderEmail(student.email, student.name);
  }

}, {
  timezone: "Asia/Kolkata"
});
}