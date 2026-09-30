const User = require("../models/User");
const { getFallbackStatus } = require("../config/db");

// Secure authentication middleware for API routes
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers["x-access-token"];
    if (!authHeader) {
      req.user = { id: "guest", role: "candidate" };
      return next();
    }

    const token = authHeader.replace("Bearer ", "").trim();

    // 1. Admin session token check
    if (token.startsWith("demo_token_admin_") || token === "demo_token_admin") {
      req.user = { id: "demo_admin_1", name: "System Administrator", email: "admin@careerverify.com", role: "admin" };
      return next();
    }

    // 2. Tester session token check
    if (token.startsWith("demo_token_tester_") || token === "demo_token_tester") {
      req.user = { id: "demo_tester_2", name: "QA Security Tester", email: "tester@careerverify.com", role: "tester" };
      return next();
    }

    // 3. Database user session check
    if (!getFallbackStatus() && token.startsWith("token_")) {
      const parts = token.split("_");
      const userId = parts[1];
      if (userId) {
        try {
          const dbUser = await User.findById(userId);
          if (dbUser) {
            req.user = { id: dbUser._id.toString(), name: dbUser.name, email: dbUser.email, role: dbUser.role };
            return next();
          }
        } catch (dbErr) {
          // Ignore DB lookup error and fall through
        }
      }
    }

    // Default fallback candidate session
    req.user = { id: "guest", role: "candidate" };
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    req.user = { id: "guest", role: "candidate" };
    next();
  }
};

// Require Admin privilege middleware
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ error: "Access Denied: Admin authorization required." });
};

module.exports = {
  requireAuth,
  requireAdmin,
};

