const User = require("../models/User");
const { getFallbackStatus } = require("../config/db");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// Pre-seeded Demo Credentials Store (used in offline fallback mode)
const demoUsers = [
  {
    _id: "demo_admin_1",
    name: "System Administrator",
    email: "admin@careerverify.com",
    password: "admin123",
    role: "admin",
    createdAt: new Date(),
  },
  {
    _id: "demo_tester_2",
    name: "QA Security Tester",
    email: "tester@careerverify.com",
    password: "tester123",
    role: "tester",
    createdAt: new Date(),
  },
];

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. DB Check if MongoDB is connected
    if (mongoose.connection.readyState === 1 && !getFallbackStatus()) {
      try {
        const user = await User.findOne({ email: cleanEmail });
        if (user) {
          // Compare using bcrypt or direct string match (for legacy/seeded accounts)
          let match = false;
          if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$")) {
            match = await bcrypt.compare(password, user.password);
          } else {
            match = user.password === password;
          }

          if (match) {
            return res.json({
              success: true,
              message: `Welcome back, ${user.name}!`,
              user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
              },
              token: `token_${user._id}_${Date.now()}`,
            });
          }
        }
      } catch (dbErr) {
        console.warn("MongoDB user lookup skipped, trying demo credentials store.");
      }
    }

    // 2. Check demo users fallback
    const demoMatch = demoUsers.find((u) => u.email === cleanEmail && u.password === password);
    if (demoMatch) {
      return res.json({
        success: true,
        message: `Welcome back, ${demoMatch.name}!`,
        user: {
          id: demoMatch._id,
          name: demoMatch.name,
          email: demoMatch.email,
          role: demoMatch.role,
        },
        token: `demo_token_${demoMatch.role}_${Date.now()}`,
      });
    }

    return res.status(401).json({ error: "Invalid email or password. Please verify credentials." });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Authentication failed due to server error." });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = ["admin", "tester", "candidate"].includes(role) ? role : "candidate";

    // 1. Check duplicate in MongoDB if connected
    if (mongoose.connection.readyState === 1 && !getFallbackStatus()) {
      try {
        const existingDBUser = await User.findOne({ email: cleanEmail });
        if (existingDBUser) {
          return res.status(400).json({ error: "An account with this email address already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const dbUser = new User({
          name: name.trim(),
          email: cleanEmail,
          password: hashedPassword,
          role: cleanRole,
        });
        await dbUser.save();

        return res.json({
          success: true,
          message: "Account registered successfully in MongoDB!",
          user: {
            id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
          },
          token: `token_${dbUser._id}_${Date.now()}`,
        });
      } catch (dbErr) {
        console.warn("MongoDB signup failed, using fallback user store:", dbErr.message);
      }
    }

    // 2. Fallback memory signup
    if (demoUsers.some((u) => u.email === cleanEmail)) {
      return res.status(400).json({ error: "An account with this email address already exists." });
    }

    const newUser = {
      _id: "user_" + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: cleanRole,
      createdAt: new Date(),
    };

    demoUsers.push(newUser);

    res.json({
      success: true,
      message: "Account registered successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token: `token_${newUser._id}_${Date.now()}`,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Failed to create account." });
  }
};

const getMe = async (req, res) => {
  res.json({ success: true, message: "Session active." });
};

module.exports = {
  login,
  signup,
  getMe,
};
