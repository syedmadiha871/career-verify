const mongoose = require("mongoose");

const JobHistorySchema = new mongoose.Schema({
  userId: {
    type: String,
    index: true,
  },
  userEmail: {
    type: String,
    index: true,
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  prediction: {
    type: String,
    enum: ["Real Job", "Fake Job"],
    required: true,
  },
  confidence: {
    type: Number,
    required: true,
  },
  fraudScore: {
    type: Number,
    required: true,
  },
  risk: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: true,
  },
  reasons: [
    {
      type: String,
    },
  ],
  jobDescription: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound Text Index for fast search
JobHistorySchema.index({ jobTitle: "text", jobDescription: "text" });

module.exports = mongoose.models.JobHistory || mongoose.model("JobHistory", JobHistorySchema);
