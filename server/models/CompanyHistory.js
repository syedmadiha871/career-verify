const mongoose = require("mongoose");

const CompanyHistorySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  website: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  score: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Verified", "Needs Manual Review", "Suspicious"],
    required: true,
  },
  reasons: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.CompanyHistory || mongoose.model("CompanyHistory", CompanyHistorySchema);
