const { pool } = require("../config/db");
const validator = require("validator");
const path = require("path");
const fs = require("fs");
const {
  findJobseekerProfileByUserId,
  updateJobseekerResumePath,
  updateJobseekerProfile,
  getJobseekerResumePathByUserId,
  findJobs,
  findJobById,
  findAppliedJobs,
  findAppliedJobsByStatus,
  checkJobExists,
  findExistingApplication,
  createJobApplication,
  findScheduleByUserId,
  findNotificationsByUserId,
  countUnreadNotifications,
  updateNotificationReadStatus,
  markAllNotificationsRead: markAllNotificationsReadHelper,
  deleteNotificationById,
  findUpcomingNotifications,
} = require("../utils/dbHelpers");
const { upload } = require("../utils/multerConfig");

// Multer error handler middleware
function multerErrorHandler(err, req, res, next) {
  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      error: { code: 400, message: "File size exceeds limit (5MB)." },
    });
  }
  if (err && err.message && err.message.startsWith("Invalid file type")) {
    return res.status(400).json({ error: { code: 400, message: err.message } });
  }
  next(err);
}

// GET /jobseeker/api/profile
const getProfile = async (req, res) => {
  try {
    // console.log('Debug: getProfile - req.user.id at start of function:', req.user.id);
    const profile = await findJobseekerProfileByUserId(req.user.id);

    console.log(profile, "proflie");

    if (!profile) {
      return res.status(404).json({ error: "Jobseeker profile not found." });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching job seeker profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST /jobseeker/api/profile/resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: { code: 400, message: "No resume file provided." } });
    }

    const userId = req.user.id;
    const newFilename = req.file.filename;
    const newRelativePath = `/resumes/${newFilename}`;

    const oldPath = await getJobseekerResumePathByUserId(userId);
    await updateJobseekerResumePath(userId, newRelativePath);

    if (oldPath) {
      const absoluteOldPath = path.join(
        __dirname,
        "..",
        "uploads",
        "resumes",
        path.basename(oldPath)
      );
      if (fs.existsSync(absoluteOldPath)) {
        try {
          await fs.promises.unlink(absoluteOldPath);
          console.log("Old resume deleted.");
        } catch (err) {
          console.error("Failed to delete old resume:", err);
        }
      }
    }

    res.json({
      message: "Resume uploaded successfully.",
      resumeUrl: newRelativePath,
    });
  } catch (error) {
    console.error("Error uploading resume:", error);
    res
      .status(500)
      .json({ error: { code: 500, message: "Failed to upload resume." } });
  }
};

// GET /jobseeker/api/profile/resume
const getResume = async (req, res) => {
  try {
    const resumeRelativePath = await getJobseekerResumePathByUserId(
      req.user.id
    );
    console.log(
      "Debug: getResume - Retrieved resumeRelativePath from DB:",
      resumeRelativePath
    );

    if (!resumeRelativePath) {
      console.log(
        "Debug: getResume - No resumeRelativePath found for user_id:",
        req.user.id
      );
      return res.status(404).json({
        error: { code: 404, message: "Resume not found for this jobseeker." },
      });
    }
    const newResume_filepath = `/resumes/${path.basename(resumeRelativePath)}`;
    // Instead of serving the file, return the URL path
    res.json({ resumeUrl: newResume_filepath });
  } catch (error) {
    console.error("Error retrieving resume URL:", error);
    res
      .status(500)
      .json({ error: { code: 500, message: "Internal server error" } });
  }
};

// Patch /jobseeker/api/profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      phone,
      gender,
      address,
      skills,
      whatsapp,
      bio,
      parentDetails = {},
    } = req.body;

    console.log(req.body, "reqBody");

    const errors = [];

    // --- Conditional validations ---
    if (name && (typeof name !== "string" || name.length > 255)) {
      errors.push("Name must be a string under 255 characters.");
    }

    if (typeof phone === "string" && phone.trim() !== "") {
      if (!validator.isMobilePhone(phone, "any")) {
        errors.push("Invalid phone number.");
      }
    }

    if (
      gender &&
      !["Male", "Female", "Other", "Prefer not to say"].includes(gender)
    ) {
      errors.push("Invalid gender value.");
    }

    if (address && address.length > 1000) {
      errors.push("Address must be under 1000 characters.");
    }

    if (typeof whatsapp === "string" && whatsapp.trim() !== "") {
      if (!validator.isMobilePhone(whatsapp, "any")) {
        errors.push("Invalid WhatsApp number.");
      }
    }

    if (bio && bio.length > 1000) {
      errors.push("About must be under 1000 characters.");
    }

    if (skills && (typeof skills !== "string" || skills.length > 500)) {
      errors.push(
        "Skills must be a comma-separated string under 500 characters."
      );
    }

    // --- Parent Details validation ---
    const {
      name: parentName,
      phone: parentPhone,
      relation,
      email: parentEmail,
    } = parentDetails;

    if (parentName && parentName.length > 255) {
      errors.push("Parent name too long.");
    }
    if (typeof parentPhone === "string" && parentPhone.trim() !== "") {
      if (!validator.isMobilePhone(parentPhone, "any")) {
        errors.push("Invalid parent phone.");
      }
    }
    if (relation && relation.length > 50) {
      errors.push("Parent relation too long.");
    }
    if (typeof parentEmail === "string" && parentEmail.trim() !== "") {
      if (!validator.isEmail(parentEmail)) {
        errors.push("Invalid parent email.");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // --- Cleaned update payload ---
    const profileUpdates = {
      ...(name && { name }),
      ...(phone && phone.trim() !== "" && { phone }),
      ...(gender && { gender }),
      ...(address && { address }),
      ...(skills && { skills }),
      ...(whatsapp && whatsapp.trim() !== "" && { whatsapp }),
      ...(bio && { bio }),
      ...(parentDetails && {
        parentDetails: {
          ...(parentName && { name: parentName }),
          ...(parentPhone &&
            parentPhone.trim() !== "" && { phone: parentPhone }),
          ...(relation && { relation }),
          ...(parentEmail &&
            parentEmail.trim() !== "" && { email: parentEmail }),
        },
      }),
    };

    await updateJobseekerProfile(userId, profileUpdates);

    const updatedProfile = await findJobseekerProfileByUserId(userId);

    return res.json({
      message: "Profile updated successfully.",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// GET /jobseeker/api/jobs
const getJobs = async (req, res) => {
  try {
    let {
      q,
      experienceLevel,
      location,
      datePosted,
      isUrgent,
      page = 1,
      limit = 10,
      minSalary,
      maxSalary,
      employmentType,
    } = req.query;

    console.log(req.query, "req.query");

    // Pass all query parameters to the centralized helper function
    const { jobs, totalJobs, totalPages, currentPage } = await findJobs({
      q,
      experienceLevel,
      location,
      datePosted,
      isUrgent,
      page,
      limit,
      minSalary,
      maxSalary,
      employmentType,
    });

    res.json({
      jobs: jobs,
      pagination: {
        currentPage: currentPage,
        totalPages: totalPages,
        totalJobs: totalJobs,
        limit: limit, // Use the resolved limit from the helper
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /jobseeker/api/jobs/:id
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ error: { code: 400, message: "Job ID is required." } });
    }

    const jobId = parseInt(id, 10); // Parse to integer
    if (isNaN(jobId)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Invalid Job ID format. Must be a number.",
        },
      });
    }

    // Use the helper function to fetch the job
    const job = await findJobById(jobId); // Use findJobById
    console.log(job, "job");
    if (!job) {
      return res
        .status(404)
        .json({ error: { code: 404, message: "Job posting not found." } });
    }

    res.json(job);
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    res.status(500).json({
      error: {
        code: 500,
        message: "Failed to retrieve job details. Please try again.",
      },
    });
  }
};

// GET /jobseeker/api/jobs/applied
const getStatusAppliedJobs = async (req, res) => {
  try {
    const { status } = req.query;
    const jobseekerId = req.user.id;
    console.log(status, "status");
    const allowedStatuses = [
      "Applied",
      "Reviewed",
      "Interviewed",
      "Rejected",
      "Hired",
    ];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}.`,
        },
      });
    }

    const appliedJobs = await findAppliedJobsByStatus(jobseekerId, status);
    res.json({ appliedJobs });
  } catch (error) {
    console.error("Error fetching applied jobs by status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAppliedJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobseekerId = req.user.id;
    console.log(id, jobseekerId, "IJ");
    if (!id) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Job ID is required in URL",
        },
      });
    }

    const job = await findAppliedJobs(jobseekerId, id); // Custom helper
    console.log(job, "Job");
    if (!job) {
      return res.status(404).json({
        error: {
          code: 404,
          message: "No job application found for this ID",
        },
      });
    }

    res.status(200).json({ job });
  } catch (error) {
    console.error("Error fetching applied job:", error);
    res.status(500).json({
      error: {
        code: 500,
        message: "Failed to fetch applied job",
      },
    });
  }
};

// POST /jobseeker/api/jobs/apply
const applyJob = async (req, res) => {
  const { job_id } = req.body;
  if (!job_id) {
    return res.status(400).json({ error: "Job ID required" });
  }

  try {
    // Check if the job exists using the helper function
    const jobExists = await checkJobExists(job_id);
    if (!jobExists) {
      return res
        .status(404)
        .json({ error: { code: 404, message: "Job not found." } });
    }

    // Get the jobseeker's current resume filepath
    const jobseekerResumePath = await getJobseekerResumePathByUserId(
      req.user.id
    );

    // Optional: Enforce resume requirement for applying
    if (!jobseekerResumePath) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Please upload your resume before applying for a job.",
        },
      });
    }

    // Check if already applied using the helper function
    const alreadyApplied = await findExistingApplication(job_id, req.user.id);
    if (alreadyApplied) {
      return res.status(409).json({
        error: {
          code: 409,
          message: "You have already applied for this job.",
        },
      });
    }

    // Insert new application using the helper function
    const applicationId = await createJobApplication(
      job_id,
      req.user.id,
      jobseekerResumePath,
      "Applied"
    );

    res.status(201).json({
      message: "Job application submitted successfully",
      applicationId: applicationId,
      jobId: job_id,
      jobseekerId: req.user.id,
      status: "Applied",
      appliedDate: new Date().toISOString(), // Use current timestamp for response
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /jobseeker/api/schedule
const getSchedule = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;

    // Validate date parameters if provided
    if (startDate && !validator.isISO8601(startDate)) {
      return res.status(400).json({
        error: {
          code: 400,
          message:
            "Invalid startDate format. Expected YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ.",
        },
      });
    }
    if (endDate && !validator.isISO8601(endDate)) {
      return res.status(400).json({
        error: {
          code: 400,
          message:
            "Invalid endDate format. Expected YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ.",
        },
      });
    }

    const schedules = await findScheduleByUserId(userId, startDate, endDate);

    // Format the date/time for the frontend if needed, though MySQL datetime should be fine
    const formattedSchedules = schedules.map((schedule) => {
      // If the date is a MySQL DATETIME string, it's usually already in a compatible format
      // If it's a Date object from the driver, .toISOString() is good.
      // Let's assume it's a string from MySQL and just return it, or convert if necessary.
      return {
        ...schedule,
        date: schedule.date ? new Date(schedule.date).toISOString() : null,
      };
    });

    res.json({ schedule: formattedSchedules });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    res
      .status(500)
      .json({ error: { code: 500, message: "Internal server error" } });
  }
};

// GET /jobseeker/api/notifications
const getNotifications = async (req, res) => {
  try {
    const { date, readStatus, type } = req.query;
    const userId = req.user.id;

    // Validate date parameter if provided
    if (date && !validator.isISO8601(date)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: "Invalid date format. Expected YYYY-MM-DD.",
        },
      });
    }

    // Validate type parameter if provided
    const allowedNotificationTypes = [
      "interview",
      "application_status",
      "announcement",
      "system",
    ]; // Define your allowed types
    if (type && !allowedNotificationTypes.includes(type)) {
      return res.status(400).json({
        error: {
          code: 400,
          message: `Invalid notification type. Allowed values are: ${allowedNotificationTypes.join(
            ", "
          )}.`,
        },
      });
    }

    const notifications = await findNotificationsByUserId(
      userId,
      date,
      readStatus,
      type
    );

    // Get unread count separately using the helper function
    const unreadCount = await countUnreadNotifications(userId);

    res.json({ notifications: notifications, unreadCount: unreadCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PATCH /jobseeker/api/notifications/:id
const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body; // Expecting { "read": true/false }

    if (read === undefined || typeof read !== "boolean") {
      return res.status(400).json({
        error: {
          code: 400,
          message: "'read' status is required and must be a boolean.",
        },
      });
    }

    const affectedRows = await updateNotificationReadStatus(
      id,
      req.user.id,
      read
    ); // Use helper function

    if (affectedRows === 0) {
      return res.status(404).json({
        error: {
          code: 404,
          message: "Notification not found or does not belong to user",
        },
      });
    }

    res.json({
      message: "Notification status updated successfully.",
      notificationId: id,
      readStatus: read,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res
      .status(500)
      .json({ error: { code: 500, message: "Internal server error" } });
  }
};

// PUT /jobseeker/api/notifications/mark-all-read (Changed from PATCH to PUT)
const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const affectedRows = await markAllNotificationsReadHelper(userId); // Call the renamed helper
    res.json({
      message: `All notifications marked as read for jobseeker '${userId}'.`,
      affectedRows,
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res
      .status(500)
      .json({ error: { code: 500, message: "Internal server error" } });
  }
};

// DELETE /jobseeker/api/notifications/:id
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const affectedRows = await deleteNotificationById(id, req.user.id); // Use helper function

    if (affectedRows === 0) {
      return res.status(404).json({
        error: {
          code: 404,
          message: "Notification not found or does not belong to user",
        },
      });
    }

    res.json({
      message: "Notification deleted successfully.",
      notificationId: id,
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res
      .status(500)
      .json({ error: { code: 500, message: "Internal server error" } });
  }
};

// GET /jobseeker/api/notifications/upcoming
const getUpcomingNotifications = async (req, res) => {
  try {
    // Get notifications for the next 7 days that are unread
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const upcomingNotifications = await findUpcomingNotifications(
      req.user.id,
      sevenDaysFromNow
    ); // Use helper function

    res.json({ upcomingNotifications: upcomingNotifications });
  } catch (error) {
    console.error("Error fetching upcoming notifications:", error);
    res
      .status(500)
      .json({ error: { code: 500, message: "Internal server error" } });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getJobs,
  getStatusAppliedJobs,
  getAppliedJobById,
  applyJob,
  getSchedule,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  uploadResume,
  getResume,
  getJobById,
  deleteNotification,
  getUpcomingNotifications,
  upload,
  multerErrorHandler,
};
