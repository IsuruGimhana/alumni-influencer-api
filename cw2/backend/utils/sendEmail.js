import transporter from "../config/nodemailer.js";

export const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Email send failed:", error);
    throw new Error("Email could not be sent.");
  }
};