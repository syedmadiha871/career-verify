const express = require("express");
const cors = require("cors");
const path = require("path");
const rateLimit = require("express-rate-limit");
const { connectDB } = require("./config/db");
const apiRoutes = require("./routes/api");

const app = express();

// Trust proxy for Vercel/Netlify serverless deployments
app.set("trust proxy", 1);

// Security Rate Limiter (150 requests per 15 mins per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { error: "Too many requests from this IP, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect DB middleware for Vercel serverless requests
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
  } catch (e) {
    // Non-blocking fallback
  }
  next();
});

// Apply Rate Limiter to API routes safely
app.use("/api", (req, res, next) => {
  try {
    return apiLimiter(req, res, next);
  } catch (err) {
    next();
  }
});

// API Routes
app.use("/api", apiRoutes);

// Serve static frontend in production if built inside client/dist
const clientDistPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
    if (err) {
      res.status(200).send("CareerVerify API Server Running.");
    }
  });
});

module.exports = app;
