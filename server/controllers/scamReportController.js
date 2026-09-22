const ScamReport = require("../models/ScamReport");
const { getFallbackStatus } = require("../config/db");

const memoryScamReports = [
  {
    _id: "scam_demo_1",
    scamType: "Registration Fee Scam",
    companyOrRecruiterName: "Global Apex Remote Careers",
    scammerEmail: "hr.globalapex@gmail.com",
    scammerPhoneOrTelegram: "@global_jobs_fast",
    jobTitle: "Work From Home Data Analyst",
    description: "Demanded $150 registration fee before releasing assignment details. Stopped responding after payment.",
    evidenceUrl: "https://example.com/scam-proof",
    upfrontAmountDemanded: 150,
    reportedBy: "Candidate #884",
    upvotes: 24,
    createdAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    _id: "scam_demo_2",
    scamType: "Fake Check Scam",
    companyOrRecruiterName: "Vertex Logistics LLC (Impersonated)",
    scammerEmail: "recruiter@vertex-logistics.xyz",
    scammerPhoneOrTelegram: "+1 555-019-8833",
    jobTitle: "Remote Operations Coordinator",
    description: "Sent fake cashier check for $2,400 to purchase home office equipment from their preferred vendor.",
    evidenceUrl: "",
    upfrontAmountDemanded: 2400,
    reportedBy: "Candidate #102",
    upvotes: 18,
    createdAt: new Date(Date.now() - 86400000 * 5),
  },
];

const mongoose = require("mongoose");

const submitScamReport = async (req, res) => {
  try {
    const {
      scamType,
      companyOrRecruiterName,
      scammerEmail,
      scammerPhoneOrTelegram,
      jobTitle,
      description,
      evidenceUrl,
      upfrontAmountDemanded,
      reportedBy,
    } = req.body;

    if (!scamType || !companyOrRecruiterName || !description) {
      return res.status(400).json({ error: "Scam type, recruiter/company name, and description are required." });
    }

    const reportData = {
      scamType,
      companyOrRecruiterName: companyOrRecruiterName.trim(),
      scammerEmail: (scammerEmail || "").trim().toLowerCase(),
      scammerPhoneOrTelegram: (scammerPhoneOrTelegram || "").trim(),
      jobTitle: (jobTitle || "Reported Job Scam").trim(),
      description: description.trim(),
      evidenceUrl: (evidenceUrl || "").trim(),
      upfrontAmountDemanded: Number(upfrontAmountDemanded) || 0,
      reportedBy: (reportedBy || "Anonymous Candidate").trim(),
      upvotes: 1,
      createdAt: new Date(),
    };

    let saved = reportData;

    if (mongoose.connection.readyState === 1) {
      try {
        const dbRecord = new ScamReport(reportData);
        saved = await dbRecord.save();
      } catch (err) {
        saved = { ...reportData, _id: "scam_mem_" + Date.now() };
        memoryScamReports.unshift(saved);
      }
    } else {
      saved = { ...reportData, _id: "scam_mem_" + Date.now() };
      memoryScamReports.unshift(saved);
    }

    return res.json({ success: true, message: "Scam report logged to public threat intelligence database.", report: saved });
  } catch (error) {
    console.error("Report scam error:", error);
    return res.status(500).json({ error: "Failed to log scam report." });
  }
};

const getScamBlacklist = async (req, res) => {
  try {
    let reports = [];

    if (mongoose.connection.readyState === 1) {
      try {
        reports = await ScamReport.find({}).sort({ createdAt: -1 }).limit(100).maxTimeMS(1000).exec();
      } catch (err) {
        reports = memoryScamReports;
      }
    } else {
      reports = memoryScamReports;
    }
    
    if (!reports || reports.length === 0) {
      reports = memoryScamReports;
    }

    return res.json({ success: true, count: reports.length, reports });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch scam blacklist database." });
  }
};

const upvoteScamReport = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && !id.startsWith("scam_mem_") && !id.startsWith("scam_demo_")) {
      try {
        await ScamReport.findByIdAndUpdate(id, { $inc: { upvotes: 1 } }).maxTimeMS(1000).exec();
      } catch (err) {
        const item = memoryScamReports.find((r) => r._id === id || r.id === id);
        if (item) item.upvotes = (item.upvotes || 0) + 1;
      }
    } else {
      const item = memoryScamReports.find((r) => r._id === id || r.id === id);
      if (item) item.upvotes = (item.upvotes || 0) + 1;
    }

    return res.json({ success: true, message: "Upvoted threat alert." });
  } catch (error) {
    return res.status(500).json({ error: "Failed to upvote report." });
  }
};

module.exports = {
  submitScamReport,
  reportScam: submitScamReport,
  getScamBlacklist,
  getBlacklist: getScamBlacklist,
  upvoteScamReport,
};
