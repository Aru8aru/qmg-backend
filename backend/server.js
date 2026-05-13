import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "SCADA Security Code",
      html: `<h1>Код: ${code}</h1>`,
    });

    res.json({
      success: true,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Email failed",
    });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server started");
});