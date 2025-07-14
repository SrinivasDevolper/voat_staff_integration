const express = require("express");
const router = express.Router();
const hrController = require("../controllers/hr.controller");
const protect = require("../middleware/auth.middleware");
const { upload, uploadJobAttachment } = require("../utils/multerConfig");

// HR Profile Management Routes
router.get("/profile", protect, hrController.getProfile);
router.put("/profile", protect, hrController.updateProfile);

// HR Schedule Routes
router.get("/hr/schedule", protect, hrController.getSchedule);

// HR Notification Routes
router.get("/hr/notifications", protect, hrController.getNotifications);
router.patch("/hr/notifications/:id", protect, hrController.markNotificationRead);
router.patch("/hr/notifications/mark-all-read", protect, hrController.markAllNotificationsRead);

// HR Application Management & Interview Scheduling Routes
router.post("/applications/:applicationId/schedule-interview", protect, hrController.scheduleInterview);

// HR Job Management Routes
router.post("/hr/jobs", protect, uploadJobAttachment.single('attachment'), hrController.createJob);
router.get("/hr/jobs", protect, hrController.getAllJobs);
router.get("/hr/jobs/:jobId", protect, hrController.getJobById);
router.put("/hr/jobs/:jobId", protect, uploadJobAttachment.single('attachment'), hrController.updateJob);
router.delete("/hr/jobs/:jobId", protect, hrController.deleteJob);

// HR Job Application Management Routes
router.get("/applications", protect, hrController.getAllApplications);
router.get("/applications/:applicationId", protect, hrController.getApplicationById);
router.put("/applications/:applicationId/status", protect, hrController.updateApplicationStatus);

// HR Jobseeker Management Routes
router.get("/jobseekers/:jobseekerId/profile", protect, hrController.getJobseekerProfile);

// Quick Hire Routes
router.post("/hr/quick-hire/process-poster", protect, uploadJobAttachment.single('poster'), hrController.processJobPoster);

module.exports = router; 