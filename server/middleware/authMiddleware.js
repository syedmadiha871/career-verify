const User = require("../models/User");
const { getFallbackStatus } = require("../config/db");

// Simple authentication middleware for API routes
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers["x-access-token"];
    const userRoleHeader = req.headers["x-user-role"];
    const userEmailHeader = req.headers["x-user-email"];

    if (!authHeader && !userRoleHeader && !userEmailHeader) {
      // In development / demo mode, allow fallback session passing via headers or default pass
      req.user = { id: "demo_admin_1", name: "System Administrator", email: "admin@careerverify.com", role: userRoleHeader || "admin" };
      return next();
    }

    const token = authHeader ? authHeader.replace("Bearer ", "") : "";

    // Demo admin check
    if (token.includes("admin") || userRoleHeader === "admin" || userEmailHeader === "admin@careerverify.com") {
      req.user = { id: "demo_admin_1", name: "System Administrator", email: "admin@careerverify.com", role: "admin" };
      return next();
    }

    // Demo tester check
    if (token.includes("tester") || userRoleHeader === "tester") {
      req.user = { id: "demo_tester_2", name: "QA Security Tester", email: "tester@careerverify.com", role: "tester" };
      return next();
    }

    // DB check if MongoDB is active
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
          // fallback
        }
      }
    }

    req.user = { id: "guest", role: userRoleHeader || "candidate" };
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    next();
  }
};

// Require Admin privilege middleware
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  // Also check if request header explicitly has admin role header or query
  const headerRole = req.headers["x-user-role"];
  if (headerRole === "admin") {
    return next();
  }

  return res.status(403).json({ error: "Access Denied: Admin authorization required." });
};

module.exports = {
  requireAuth,
  requireAdmin,
};
