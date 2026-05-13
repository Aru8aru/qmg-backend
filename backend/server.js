import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
app.get('/', (req, res) => {
  res.send('Backend works!')
})

app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-code", async (req, res) => {
  try {
    const { email, code } = req.body;

    const data = await resend.emails.send({
      from: "SCADA Security <onboarding@resend.dev>",
      to: email,
      subject: "🔐 SCADA KZ-01 Security Code",
      html: `
        <div style="
          background:#020817;
          color:white;
          padding:40px;
          font-family:Arial;
        ">
          <h1 style="color:#00ffd5;">
            SCADA KZ-01
          </h1>

          <p>Ваш код входа:</p>

          <div style="
            font-size:42px;
            color:#00ffd5;
            letter-spacing:8px;
            font-weight:bold;
          ">
            ${code}
          </div>

          <p>Код действует 5 минут.</p>

          <p style="color:#ffcc00">
            Никому не сообщайте этот код.
          </p>
        </div>
      `,
    });

    res.json({
      success: true,
      data,
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