const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
require("dotenv").config();

let isFallbackMode = false;
let connPromise = null;

const MONGODB_ATLAS_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb+srv://admin:admin1234@cluster0.2pau2w8.mongodb.net/careerverify?retryWrites=true&w=majority&appName=Cluster0";

// Auto-seed default Master Admin into MongoDB
const autoSeedAdmin = async () => {
  try {
    const adminEmail = "admin@careerverify.com";
    const newHashedPassword = await bcrypt.hash("Admin#Career2026!Secure", 10);
    const existingAdmin = await User.findOne({ email: adminEmail }).exec();
    if (!existingAdmin) {
      await User.create({
        name: "System Administrator",
        email: adminEmail,
        password: newHashedPassword,
        role: "admin",
      });
      console.log("-> Auto-seeded Master Admin (admin@careerverify.com) into MongoDB.");
    } else {
      existingAdmin.password = newHashedPassword;
      await existingAdmin.save();
      console.log("-> Master Admin password updated in MongoDB.");
    }
  } catch (err) {
    console.warn("Auto-seed Admin Notice:", err.message);
  }
};

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    isFallbackMode = false;
    return mongoose.connection;
  }

  if (connPromise) {
    try {
      await connPromise;
      return mongoose.connection;
    } catch (e) {
      connPromise = null;
    }
  }

  try {
    console.log("Connecting to MongoDB Atlas Cluster0...");
    connPromise = mongoose.connect(MONGODB_ATLAS_URI, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
      bufferCommands: false,
    });
    await connPromise;
    isFallbackMode = false;
    console.log("MongoDB Atlas Connected Successfully to Database 'careerverify'.");
    await autoSeedAdmin();
    return mongoose.connection;
  } catch (error) {
    connPromise = null;
    isFallbackMode = true;
    console.warn("MongoDB Atlas Notice: " + error.message);
    return null;
  }
};

const getFallbackStatus = () => isFallbackMode;

module.exports = { connectDB, getFallbackStatus, autoSeedAdmin };

