const CompanyHistory = require("../models/CompanyHistory");
const { verifyCompany } = require("../services/companyVerifier");
const { getFallbackStatus } = require("../config/db");

const memoryCompanyHistory = [];

const verifyCompanyDomain = async (req, res) => {
  try {
    const { companyName, website, email, company_name } = req.body;

    const targetCompany = companyName || company_name;

    if (!targetCompany || !website || !email) {
      return res.status(400).json({ error: "Company name, website, and email are required." });
    }

    const verification = verifyCompany(targetCompany, website, email);

    const recordData = {
      companyName: verification.companyName,
      website: verification.website,
      email: verification.email,
      score: verification.score,
      status: verification.status,
      reasons: verification.reasons,
      createdAt: new Date(),
    };

    let savedRecord = recordData;

    if (!getFallbackStatus()) {
      try {
        const dbRecord = new CompanyHistory(recordData);
        savedRecord = await dbRecord.save();
      } catch (err) {
        memoryCompanyHistory.unshift({ ...recordData, _id: "mem_c_" + Date.now() });
      }
    } else {
      memoryCompanyHistory.unshift({ ...recordData, _id: "mem_c_" + Date.now() });
    }

    return res.json({
      success: true,
      company_name: verification.companyName,
      companyName: verification.companyName,
      website: verification.website,
      email: verification.email,
      score: verification.score,
      status: verification.status,
      reasons: verification.reasons,
      record: savedRecord,
    });
  } catch (error) {
    console.error("Company verification error:", error);
    return res.status(500).json({ error: "Failed to verify company credentials." });
  }
};

const getCompanyHistory = async (req, res) => {
  try {
    let records = [];
    if (!getFallbackStatus()) {
      try {
        records = await CompanyHistory.find({}).sort({ createdAt: -1 }).limit(50);
      } catch (err) {
        records = memoryCompanyHistory;
      }
    } else {
      records = memoryCompanyHistory;
    }

    return res.json({ success: true, count: records.length, history: records });
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve company history." });
  }
};

module.exports = {
  verifyCompanyDomain,
  verifyCompanyRoute: verifyCompanyDomain,
  getCompanyHistory,
};
