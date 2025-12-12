// src/helpers/enviarEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true", // true para 465, false para otros
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const EMAIL_FROM = process.env.EMAIL_FROM || "no-reply@elsiguiente.com";

async function enviarEmail({ to, subject, text, html }) {
  const mailOptions = {
    from: EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { enviarEmail };
