// // import cron from "node-cron";
// // import User from "../models/User.js";
// // import Attendance from "../models/Attendance.js";
// // import { sendEmail } from "../utils/sendEmail.js";

// // // // cron.schedule("* * * * *", async () => {
// // // //   console.log("⏰ Running attendance reminder job...");

// // // //   const today = new Date().toISOString().split("T")[0];

// // // //   // all students
// // // //   const students = await User.find({ role: "student" });

// // // //   for (const student of students) {
// // // //     const marked = await Attendance.findOne({
// // // //       student: student._id,
// // // //       date: today,
// // // //     });

// // // //     // ❌ if NOT marked → send mail
// // // //     if (!marked) {
// // // //       console.log("Sending mail to:", student.email);

// // // //       await sendEmail(
// // // //         student.email,
// // // //         "Attendance Reminder",
// // // //         `Hello ${student.name}, please mark your attendance before 9:30 PM.`
// // // //       );
// // // //     }
// // // //   }
// // // // });

// // // cron.schedule("* * * * *", async () => {
// // //   try {
// // //     console.log("⏰ Running attendance reminder job...");

// // //     const today = new Date().toISOString().split("T")[0];
// // //     const students = await User.find({ role: "student" });

// // //     console.log("Total students:", students.length);

// // //     for (const student of students) {
// // //       const marked = await Attendance.findOne({
// // //         student: student._id,
// // //         date: today,
// // //       });

// // //       if (!marked) {
// // //         console.log("Sending mail to:", student.email);

// // //         await sendEmail(
// // //           student.email,
// // //           "Attendance Reminder",
// // //           `Hello ${student.name}, please mark your attendance before 9:30 PM.`
// // //         );
// // //       }
// // //     }
// // //   } catch (err) {
// // //     console.error("❌ Cron Error:", err);
// // //   }
// // // });


// // cron.schedule("* * * * *", async () => {
// //   try {
// //     console.log("⏰ Running attendance reminder job...");

// //     const today = new Date().toISOString().split("T")[0];
// //     const students = await User.find({ role: "student" });

// //     for (const student of students) {
// //       const marked = await Attendance.findOne({
// //         student: student._id,
// //         date: today,
// //       });

// //       if (!marked) {
// //         console.log("Sending mail to:", student.email);
// //         await sendEmail(student.email, student.name);
// //       }
// //     }
// //   } catch (err) {
// //     console.error("❌ Cron 
// // Error:", err);
// //   }
// // });

// import cron from "node-cron";
// import User from "../models/User.js";
// import Attendance from "../models/Attendance.js";
// import { sendEmail } from "../utils/sendEmail.js";

// // ⏰ Every 1 minute (testing ke liye)
// cron.schedule("* * * * *", async () => {
//   try {
//     console.log("⏰ Running attendance reminder job...");

//     const today = new Date().toISOString().split("T")[0];

//     const students = await User.find({ role: "student" });
//     console.log("Total students:", students.length);

//     for (const student of students) {
//       const marked = await Attendance.findOne({
//         student: student._id,
//         date: today,
//       });

//       if (!marked) {
//         console.log("Sending mail to:", student.email);

//         await sendEmail(student.email, student.name);
//       }
//     }
//   } catch (err) {
//     console.error("❌ Cron Error:", err);
//   }
// });


import cron from "node-cron";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import { sendEmail } from "../utils/sendEmail.js";

cron.schedule("* * * * *", async () => {
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