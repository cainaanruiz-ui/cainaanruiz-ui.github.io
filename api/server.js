import express from "express";
import nodemailer from "nodemailer";

const app = express();

// ---- Config
const {
  TO_EMAIL,
  FROM_EMAIL,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_SECURE,
  API_KEY,
  ALLOWED_ORIGIN
} = process.env;

// ---- Body parser
app.use(express.json({ limit: "250kb" }));

// ---- CORS (critical)
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // Only allow your site (or allow all if ALLOWED_ORIGIN not set)
  if (ALLOWED_ORIGIN && origin === ALLOWED_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!ALLOWED_ORIGIN) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");
  res.setHeader("Access-Control-Max-Age", "86400");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

// ---- Health check
app.get("/", (req, res) => {
  res.status(200).send("ok");
});

// ---- Send endpoint
app.post("/send", async (req, res) => {
  try {
    // API key protection
    const key = req.headers["x-api-key"];
    if (API_KEY && key !== API_KEY) {
      return res.status(401).send("Unauthorized");
    }

    const { name, email, times, message } = req.body || {};

    if (!name || !email) {
      return res.status(400).send("Missing required fields");
    }

    // Transport
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST || "smtp.gmail.com",
      port: Number(SMTP_PORT || 465),
      secure: String(SMTP_SECURE || "true") === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });

    const safeTimes = times ? String(times) : "(not provided)";
    const safeMsg = message ? String(message) : "(not provided)";

    const subject = `New Booking Request: ${name}`;
    const text =
`New booking request received.

Name: ${name}
Email: ${email}
Preferred times: ${safeTimes}

Message:
${safeMsg}
`;

    await transporter.sendMail({
      from: FROM_EMAIL || SMTP_USER,
      to: TO_EMAIL || SMTP_USER,
      replyTo: email,
      subject,
      text
    });

    return res.status(200).send("sent");
  } catch (err) {
    console.error("SEND ERROR:", err);
    return res.status(500).send("Server error");
  }
});

// ---- Cloud Run port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Listening on", port);
});

