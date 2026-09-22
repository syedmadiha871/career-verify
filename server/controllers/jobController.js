const mongoose = require("mongoose");
const { analyzeJobDescription } = require("../services/nlpEngine");
const { scrapeJobUrl } = require("../services/scraperService");
const { analyzeSalary } = require("../services/salaryAnalyzer");
const JobHistory = require("../models/JobHistory");

// Extract user identity helper from request
const getUserIdentity = (req) => {
  const userEmail = req.headers["x-user-email"] || (req.user ? req.user.email : null) || (req.body ? req.body.userEmail : null);
  const userId = req.headers["x-user-id"] || (req.user ? req.user.id : null) || (req.body ? req.body.userId : null);
  const userRole = req.headers["x-user-role"] || (req.user ? req.user.role : "candidate");
  return { userId, userEmail, userRole };
};

const predictJobPosting = async (req, res) => {
  try {
    const { job_text, jobTitle } = req.body;
    const { userId, userEmail } = getUserIdentity(req);

    if (!job_text || typeof job_text !== "string" || job_text.trim().length === 0) {
      return res.status(400).json({ error: "Job description text is required." });
    }

    // Run NLP Engine
    const analysis = analyzeJobDescription(job_text);

    const titleToSave = jobTitle || job_text.split("\n")[0].slice(0, 60) || "Job Description Analysis";

    // Save record to DB or fallback memory
    let savedRecord = null;
    try {
      if (mongoose.connection.readyState === 1) {
        savedRecord = await JobHistory.create({
          userId: userId || "guest",
          userEmail: userEmail || "guest@careerverify.com",
          jobTitle: titleToSave,
          prediction: analysis.prediction,
          confidence: analysis.confidence,
          fraudScore: analysis.fraud_score,
          risk: analysis.risk,
          reasons: analysis.reasons,
          jobDescription: job_text,
        });
      } else {
        throw new Error("MongoDB disconnected");
      }
    } catch (dbErr) {
      console.warn("MongoDB write skipped, using memory fallback record.");
      savedRecord = {
        _id: "mem_" + Date.now(),
        userId: userId || "guest",
        userEmail: userEmail || "guest@careerverify.com",
        jobTitle: titleToSave,
        prediction: analysis.prediction,
        confidence: analysis.confidence,
        fraudScore: analysis.fraud_score,
        fraud_score: analysis.fraud_score,
        risk: analysis.risk,
        reasons: analysis.reasons,
        jobDescription: job_text,
        createdAt: new Date(),
      };
    }

    res.json({
      ...analysis,
      id: savedRecord._id,
      job_text,
    });
  } catch (error) {
    console.error("Predict Job Error:", error);
    res.status(500).json({ error: "Failed to process job posting analysis." });
  }
};

const scrapeJobPostingUrl = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "Target URL is required." });
    }
    const data = await scrapeJobUrl(url);
    res.json(data);
  } catch (error) {
    console.error("Scrape Job Error:", error);
    res.status(500).json({ error: error.message || "Failed to scrape job URL." });
  }
};

const analyzeSalaryAnomaly = async (req, res) => {
  try {
    const { payRate, payPeriod, jobCategory } = req.body;
    const result = analyzeSalary(payRate, payPeriod, jobCategory);
    res.json(result);
  } catch (error) {
    console.error("Salary Analysis Error:", error);
    res.status(500).json({ error: "Failed to calculate salary anomaly score." });
  }
};

const analyzePhishingMessage = async (req, res) => {
  try {
    const { messageText } = req.body;
    if (!messageText) {
      return res.status(400).json({ error: "Message content is required." });
    }

    const clean = messageText.toLowerCase();
    const tactics = [];
    let phishingScore = 10;

    if (clean.includes("urgent") || clean.includes("immediately") || clean.includes("24 hours") || clean.includes("today only")) {
      tactics.push("Artificial Urgency & Time Pressure");
      phishingScore += 25;
    }
    if (clean.includes("telegram") || clean.includes("whatsapp") || clean.includes("signal")) {
      tactics.push("Anonymous Messaging App Channel Demand");
      phishingScore += 30;
    }
    if (clean.includes("fee") || clean.includes("payment") || clean.includes("registration") || clean.includes("deposit")) {
      tactics.push("Upfront Financial Demand Pattern");
      phishingScore += 35;
    }
    if (clean.includes("aadhaar") || clean.includes("pan card") || clean.includes("ssn") || clean.includes("passport")) {
      tactics.push("Premature Sensitive Identity Document Request");
      phishingScore += 30;
    }
    if (clean.includes("no interview") || clean.includes("selected without interview")) {
      tactics.push("No-Interview Instant Selection Scheme");
      phishingScore += 30;
    }

    const isPhishing = phishingScore >= 45;
    res.json({
      isPhishing,
      phishingScore: Math.min(100, phishingScore),
      risk: phishingScore >= 70 ? "High" : phishingScore >= 40 ? "Medium" : "Low",
      tacticsFound: tactics.length > 0 ? tactics : ["Standard outreach message structure."],
      advice: isPhishing
        ? "Do NOT click suspicious links or reply with personal financial details."
        : "Message appears standard, but always verify sender domain before sharing sensitive documents."
    });
  } catch (error) {
    console.error("Phishing Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze phishing message." });
  }
};

const getJobHistoryLogs = async (req, res) => {
  try {
    const { search, risk, prediction } = req.query;
    const { userId, userEmail, userRole } = getUserIdentity(req);
    let history = [];

    if (mongoose.connection.readyState === 1) {
      try {
        let query = {};
        if (search) query.$text = { $search: search };
        if (risk) query.risk = risk;
        if (prediction) query.prediction = prediction;

        // If user is not admin, scope history to that specific user's email/ID
        if (userRole !== "admin" && (userEmail || userId)) {
          const userFilters = [];
          if (userEmail) userFilters.push({ userEmail });
          if (userId) userFilters.push({ userId });
          query.$or = userFilters;
        }

        history = await JobHistory.find(query).sort({ createdAt: -1 }).limit(50).maxTimeMS(2000).exec();
      } catch (dbErr) {
        history = [];
      }
    }

    res.json({ history });
  } catch (error) {
    console.error("Get History Error:", error);
    res.status(500).json({ error: "Failed to retrieve job history logs." });
  }
};

const getJobHistoryById = async (req, res) => {
  try {
    const { id } = req.params;
    let record = null;
    if (mongoose.connection.readyState === 1) {
      try {
        record = await JobHistory.findById(id).maxTimeMS(2000).exec();
      } catch (dbErr) {
        record = null;
      }
    }

    if (!record) {
      return res.status(404).json({ error: "Record not found." });
    }
    res.json(record);
  } catch (error) {
    console.error("Get History By ID Error:", error);
    res.status(500).json({ error: "Failed to retrieve history item." });
  }
};

const deleteJobHistoryRecord = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      try {
        await JobHistory.findByIdAndDelete(id).maxTimeMS(2000).exec();
      } catch (dbErr) {
        // Skip
      }
    }
    res.json({ message: "Record deleted successfully." });
  } catch (error) {
    console.error("Delete History Error:", error);
    res.status(500).json({ error: "Failed to delete history record." });
  }
};

const getDashboardAnalytics = async (req, res) => {
  try {
    const { userId, userEmail, userRole } = getUserIdentity(req);
    let history = [];

    if (mongoose.connection.readyState === 1) {
      try {
        let query = {};
        // If not admin, scope analytics to user's saved records in MongoDB
        if (userRole !== "admin" && (userEmail || userId)) {
          const userFilters = [];
          if (userEmail) userFilters.push({ userEmail });
          if (userId) userFilters.push({ userId });
          query.$or = userFilters;
        }

        history = await JobHistory.find(query).sort({ createdAt: -1 }).limit(100).maxTimeMS(2000).exec();
      } catch (dbErr) {
        history = [];
      }
    }

    const totalJobs = history.length;
    const realJobs = history.filter((h) => h.prediction === "Real Job").length;
    const fakeJobs = history.filter((h) => h.prediction === "Fake Job").length;

    const highRisk = history.filter((h) => h.risk === "High").length;
    const mediumRisk = history.filter((h) => h.risk === "Medium").length;
    const lowRisk = history.filter((h) => h.risk === "Low").length;

    // For brand new users with 0 jobs performed, default avgConfidence and avgFraudScore to 0!
    const avgConfidence = totalJobs > 0 ? Math.round(history.reduce((acc, curr) => acc + (curr.confidence || 0), 0) / totalJobs) : 0;
    const avgFraudScore = totalJobs > 0 ? Math.round(history.reduce((acc, curr) => acc + (curr.fraudScore || 0), 0) / totalJobs) : 0;

    res.json({
      totalJobs,
      realJobs,
      fakeJobs,
      highRisk,
      mediumRisk,
      lowRisk,
      avgConfidence,
      avgFraudScore,
      recentActivity: history.slice(0, 10),
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard telemetry." });
  }
};

module.exports = {
  predictJobPosting,
  scrapeJobPostingUrl,
  analyzeSalaryAnomaly,
  analyzePhishingMessage,
  getJobHistoryLogs,
  getJobHistoryById,
  deleteJobHistoryRecord,
  getDashboardAnalytics,
};
