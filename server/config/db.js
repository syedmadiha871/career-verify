const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

let isFallbackMode = false;

const MONGODB_ATLAS_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb+srv://admin:admin1234@cluster0.2pau2w8.mongodb.net/careerverify?retryWrites=true&w=majority&appName=Cluster0";

// Auto-seed default Master Admin into MongoDB
const autoSeedAdmin = async () => {
  try {
    const adminEmail = "admin@careerverify.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "System Administrator",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("-> Auto-seeded Master Admin (admin@careerverify.com) into MongoDB.");
    }
  } catch (err) {
    console.warn("Auto-seed Admin Notice:", err.message);
  }
};

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB Atlas Cluster0...");
    await mongoose.connect(MONGODB_ATLAS_URI, {
      serverSelectionTimeoutMS: 4000,
    });
    isFallbackMode = false;
    console.log("MongoDB Atlas Connected Successfully to Database 'careerverify'.");
    await autoSeedAdmin();
  } catch (error) {
    isFallbackMode = true;
    console.warn("MongoDB Atlas Notice: " + error.message);
    if (error.message.includes("authentication failed")) {
      console.warn("-> Check if MongoDB Atlas Database User password or IP Whitelist (0.0.0.0/0) is configured.");
    }
    console.warn("Operating smoothly with high-speed memory fallback store.");
  }
};

const getFallbackStatus = () => isFallbackMode;

module.exports = { connectDB, getFallbackStatus, autoSeedAdmin };
