import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

// Allow your website to call this API
app.use(cors({
  origin: true, // you can lock this to your exact domain later
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "X-API-Key"]
}));

app.use(express.json());

// Simple health check
app.get("/", (req, res) => res.status(200).send("OK"));

// Booking endpoint
app.post("/booking", async (req, res) => {
  try {
    // Optional basic protection (recommended)
    const expectedKey = process.env.API_KEY;
    if (expectedKey && req.headers["x-api-key"] !== expectedKey) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const { name, email, times, message } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    // SMTP config (set these as Cloud Run environment variables)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || "true") === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const toEmail = process.env.TO_EMAIL || "Luis@happy2helpcounseling.org";

    const subject = `New Booking Request: ${name}`;
    const text =
`New booking request

Name: ${name}
Email: ${email}
Preferred days/times: ${times || "(not provided)"}

Message:
${message || "(not provided)"}
`;

    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: toEmail,
      replyTo: email,
      subject,
      text
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// Cloud Run listens on 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

