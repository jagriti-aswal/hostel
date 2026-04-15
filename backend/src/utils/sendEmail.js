import nodemailer from "nodemailer";
console.log(process.env.EMAIL_USER ? "User OK" : "User Missing");
console.log(process.env.EMAIL_PASS ? "Pass OK" : "Pass Missing");
const transporter = nodemailer.createTransport({
  
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  
});

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
//         <br/>
//         <p>— Smart Hostel System</p>
//       `,
//     });

//     console.log(`📧 Email sent to ${to}`);
//   } catch (err) {
//     console.error("Email error:", err);
//   }
// };


export const sendEmail = async (to, name) => {
  try {
    await transporter.sendMail({
      from: `"Smart Hostel" <${process.env.EMAIL_USER}>`,
      to,
      subject: "⚠️ Attendance Reminder",
      html: `
        <h2>Hello ${name}</h2>
        <p>You have not marked your attendance today.</p>
        <p>Please mark it before deadline.</p>
      `,
    });
     console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error("Email error:", err);
  }
};

