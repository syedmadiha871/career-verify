const mongoose = require("mongoose");

const ScamReportSchema = new mongoose.Schema({
  scamType: {
    type: String,
    enum: ["Fake Recruiter", "Registration Fee Scam", "Telegram/WhatsApp Scam", "Fake Check Scam", "Identity Theft Hazard", "Other"],
    required: true,
  },
  companyOrRecruiterName: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  scammerEmail: {
    type: String,
    trim: true,
    lowercase: true,
    index: true,
  },
  scammerPhoneOrTelegram: {
    type: String,
    trim: true,
    index: true,
  },
  jobTitle: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  evidenceUrl: {
    type: String,
    trim: true,
  },
  upfrontAmountDemanded: {
    type: Number,
    default: 0,
  },
  reportedBy: {
    type: String,
    default: "Anonymous Candidate",
  },
  upvotes: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

ScamReportSchema.index({ companyOrRecruiterName: "text", scammerEmail: "text", description: "text" });

module.exports = mongoose.models.ScamReport || mongoose.model("ScamReport", ScamReportSchema);
