import nodemailer from "nodemailer";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

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

// ─── MongoDB ──────────────────────────────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log("✅ MongoDB подключена");
  } catch (err) {
    console.error("❌ MongoDB ошибка:", err.message);
  }
};
connectDB();

// ─── Chat Message Schema ──────────────────────────────────────────────────────
const msgSchema = new mongoose.Schema({
  id:        { type: String, required: true, unique: true },
  from:      { type: String, required: true },
  cipher:    { type: String, required: true },
  ticket:    { type: mongoose.Schema.Types.Mixed, required: true },
  timestamp: { type: Number, required: true },
  time:      { type: String, required: true },
});

const Message = mongoose.models.Message || mongoose.model("Message", msgSchema);

// ─── Resend ───────────────────────────────────────────────────────────────────

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("QMG Backend works!");
});

// Send email code
app.post("/send-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "SCADA KZ-01 код",
      html: `
        <h1>Ваш код:</h1>
        <h2>${code}</h2>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email sending failed" });
  }
});

// POST /chat/send — сохранить сообщение
app.post("/chat/send", async (req, res) => {
  try {
    const { id, from, cipher, ticket, timestamp, time } = req.body;
    if (!id || !from || !cipher || !ticket || !timestamp) {
      return res.status(400).json({ error: "Missing fields" });
    }
    // Upsert — если такое id уже есть, не дублируем
    await Message.findOneAndUpdate(
      { id },
      { id, from, cipher, ticket, timestamp, time },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Chat send error:", err.message);
    res.status(500).json({ error: "Failed to save message" });
  }
});

// GET /chat/get?since=TIMESTAMP — получить новые сообщения
app.get("/chat/get", async (req, res) => {
  try {
    const since = parseInt(req.query.since) || 0;
    const messages = await Message.find({ timestamp: { $gt: since } })
      .sort({ timestamp: 1 })
      .limit(100)
      .lean();
    res.json({ messages });
  } catch (err) {
    console.error("Chat get error:", err.message);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});