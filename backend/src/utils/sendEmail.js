// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // export const sendEmail = async (to, name) => {
// //   try {
// //     await transporter.sendMail({
// //       from: `"Smart Hostel" <${process.env.EMAIL_USER}>`,
// //       to,
// //       subject: "⚠️ Attendance Reminder",
// //       html: `
// //         <h2>Hello ${name}</h2>
// //         <p>You have not marked your attendance today.</p>
// //         <p>Please mark it before deadline.</p>
// //         <br/>
// //         <p>— Smart Hostel System</p>
// //       `,
// //     });

// //     console.log(`📧 Email sent to ${to}`);
// //   } catch (err) {
// //     console.error("Email error:", err);
// //   }
// // };


// export const sendEmail = async (to, name) => {
//   try {
//     await transporter.sendMail({
//       from: `"Smart Hostel" <${process.env.EMAIL_USER}>`,
//       to,
//       subject: "⚠️ Attendance Reminder",
//       html: `
//         <h2>Hello ${name}</h2>
//         <p>You have not marked your attendance today.</p>
//         <p>Please mark it before deadline.</p>
//       `,
//     });

//     console.log(`📧 Email sent to ${to}`);
//   } catch (err) {
//     console.error("Email error:", err);
//   }
// };


import nodemailer from "nodemailer";

// ✅ transporter (production safe)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // ⚠️ App Password
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
});

// ✅ verify SMTP (debug ke liye)
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ SMTP Error:", error);
  } else {
    console.log("✅ SMTP Ready");
  }
});

export const sendEmail = async (to, name) => {
  try {
    console.log("➡️ Trying to send email to:", to);

    await transporter.sendMail({
      from: `"Smart Hostel" <${process.env.EMAIL_USER}>`,
      to,
      subject: "⚠️ Attendance Reminder",
      html: `
        <h2>Hello ${name}</h2>
        <p>You have not marked your attendance today.</p>
        <p>Please mark it before deadline.</p>
        <br/>
        <p>— Smart Hostel System</p>
      `,
    });

    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email error:", err);
  }
};