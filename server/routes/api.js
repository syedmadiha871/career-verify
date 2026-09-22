const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const companyController = require("../controllers/companyController");
const scamReportController = require("../controllers/scamReportController");
const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");
const { requireAuth, requireAdmin } = require("../middleware/authMiddleware");

// Authentication routes
router.post("/auth/login", authController.login);
router.post("/auth/signup", authController.signup);
router.get("/auth/me", authController.getMe);

// Job verification routes
router.post("/predict", jobController.predictJobPosting);
router.post("/scrape-job", jobController.scrapeJobPostingUrl);
router.post("/analyze-salary", jobController.analyzeSalaryAnomaly);
router.post("/analyze-phishing", jobController.analyzePhishingMessage);

// History routes
router.get("/history", jobController.getJobHistoryLogs);
router.get("/history/:id", jobController.getJobHistoryById);
router.delete("/history/:id", jobController.deleteJobHistoryRecord);

// Company verification routes
router.post("/verify-company", companyController.verifyCompanyDomain);

// Blacklist & scam report routes
router.get("/blacklist", scamReportController.getScamBlacklist);
router.post("/report-scam", scamReportController.submitScamReport);
router.post("/blacklist/:id/upvote", scamReportController.upvoteScamReport);

// Dashboard telemetry stats
router.get("/stats", jobController.getDashboardAnalytics);

// ==========================================
// ADMIN CONTROL CENTER ROUTES (ALL POWERS)
// ==========================================
router.get("/admin/users", requireAuth, requireAdmin, adminController.getAllUsers);
router.post("/admin/users", requireAuth, requireAdmin, adminController.createUser);
router.patch("/admin/users/:id/role", requireAuth, requireAdmin, adminController.updateUserRole);
router.delete("/admin/users/:id", requireAuth, requireAdmin, adminController.deleteUser);

router.get("/admin/analytics", requireAuth, requireAdmin, adminController.getAdminAnalytics);
router.delete("/admin/scam-reports/:id", requireAuth, requireAdmin, adminController.deleteScamReport);
router.post("/admin/system/purge-history", requireAuth, requireAdmin, adminController.purgeHistory);
router.get("/admin/audit-logs", requireAuth, requireAdmin, adminController.getAuditLogs);

module.exports = router;

