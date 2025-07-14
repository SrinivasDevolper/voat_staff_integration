const { pool } = require("../config/db");
const validator = require("validator");
const {
  findUserByEmail,
  updateUser,
  findJobseekerProfileByUserId,
  findHrProfileByUserId,
  createHrProfile,
  updateHrProfile,
} = require("../utils/dbHelpers");

// HR Profile Management Controllers
const getProfile = async (req, res) => {
  try {
    let userProfile = await findHrProfileByUserId(req.user.id);

    // If no HR profile exists, create a new one
    if (!userProfile) {
      await createHrProfile(req.user.id, {}); // Create with empty data
      userProfile = await findHrProfileByUserId(req.user.id); // Fetch the newly created profile
    }

    if (!userProfile) {
      // This should ideally not happen after attempting to create
      return res.status(404).json({ error: "HR profile not found after creation attempt" });
    }

    res.json(userProfile);
  } catch (error) {
    console.error("Error fetching HR profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    console.log("Debug: updateProfile - Incoming req.body:", req.body);
    const {
      username, voat_id, company, experience, basicDetails, contactPerson, contactEmail
    } = req.body;
    const errors = [];
    const userId = req.user.id;

    if (username !== undefined && (typeof username !== 'string' || username.trim().length === 0 || username.length > 255)) {
      errors.push("Username must be a non-empty string and less than 255 characters.");
    }
    if (voat_id !== undefined && (typeof voat_id !== 'string' || voat_id.trim().length === 0 || voat_id.length > 50)) {
      errors.push("VOAT ID must be a non-empty string and less than 50 characters.");
    }
    
    // Validation for optional HR profile fields (can be null or string)
    if (company !== undefined) {
      if (company !== null && (typeof company !== 'string' || company.length > 255)) {
        errors.push("Company must be a string and less than 255 characters, or null.");
      }
    }
    if (experience !== undefined) {
      if (experience !== null && (typeof experience !== 'string' || experience.length > 255)) {
        errors.push("Experience must be a string and less than 255 characters, or null.");
      }
    }
    if (basicDetails !== undefined) {
      if (basicDetails !== null && (typeof basicDetails !== 'string' || basicDetails.length > 1000)) {
        errors.push("Basic Details must be a string and less than 1000 characters, or null.");
      }
    }
    if (contactPerson !== undefined) {
      if (contactPerson !== null && (typeof contactPerson !== 'string' || contactPerson.length > 255)) {
        errors.push("Contact Person must be a string and less than 255 characters, or null.");
      }
    }
    if (contactEmail !== undefined) {
      if (contactEmail !== null && (typeof contactEmail !== 'string' || !validator.isEmail(contactEmail))) {
        errors.push("Contact Email must be a valid email address or null.");
      }
    }

    if (errors.length > 0) {
      console.log("Debug: updateProfile - Validation errors:", errors);
      return res.status(400).json({ errors });
    }

    const userUpdates = {};
    const hrProfileUpdates = {};

    if (username !== undefined) userUpdates.username = username;
    if (voat_id !== undefined) userUpdates.voat_id = voat_id;

    if (company !== undefined) hrProfileUpdates.company = company;
    if (experience !== undefined) hrProfileUpdates.experience = experience;
    if (basicDetails !== undefined) hrProfileUpdates.basic_details = basicDetails;
    if (contactPerson !== undefined) hrProfileUpdates.contact_person = contactPerson;
    if (contactEmail !== undefined) hrProfileUpdates.contact_email = contactEmail;

    console.log("Debug: updateProfile - userUpdates:", userUpdates);
    console.log("Debug: updateProfile - hrProfileUpdates:", hrProfileUpdates);

    if (Object.keys(userUpdates).length > 0) {
      await updateUser(userId, userUpdates);
    }

    const existingHrProfile = await findHrProfileByUserId(userId);

    if (Object.keys(hrProfileUpdates).length > 0) {
      if (existingHrProfile) {
        await updateHrProfile(userId, hrProfileUpdates);
      } else {
        await createHrProfile(userId, hrProfileUpdates);
      }
    }

    const updatedProfile = await findHrProfileByUserId(userId);

    res.json({ message: "HR profile updated successfully", profile: updatedProfile });
  } catch (error) {
    console.error("Error updating HR profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// HR Schedule Controllers
const getSchedule = async (req, res) => {
  try {
    const [schedules] = await pool.execute(
      "SELECT * FROM interviews WHERE interviewer_id = ?",
      [req.user.id]
    );
    res.json(schedules);
  } catch (error) {
    console.error("Error fetching HR schedule:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// HR Notification Controllers
const getNotifications = async (req, res) => {
  try {
    const { date } = req.query;
    let query = "SELECT * FROM notifications WHERE user_id = ?";
    const params = [req.user.id];

  if (date) {
      query += " AND DATE(created_at) = ?";
      params.push(date);
    }

    const [notifications] = await pool.execute(query, params);
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching HR notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute(
      "UPDATE notifications SET is_read = TRUE WHERE notification_id = ? AND user_id = ?",
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Notification not found or does not belong to this HR" });
    }

  res.json({ message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const markAllNotificationsRead = async (req, res) => {
  try {
    await pool.execute("UPDATE notifications SET is_read = TRUE WHERE user_id = ?", [req.user.id]);
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// HR Application Management & Interview Scheduling Controllers
const scheduleInterview = async (req, res) => {
  const { applicationId } = req.params;
  const { interviewDate, interviewTime, interviewLocation, notes } = req.body;

  if (!applicationId || !interviewDate || !interviewTime || !interviewLocation) {
    return res.status(400).json({ error: "Missing required interview details (applicationId, date, time, location)" });
  }

  try {
    // 1. Find the application and its associated job and jobseeker
    const [applications] = await pool.execute(
      `SELECT ja.application_id, ja.job_id, ja.jobseeker_id, j.title AS job_title
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       WHERE ja.application_id = ?`, 
      [applicationId]
    );

    const application = applications[0];

    if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }

    // Check if HR user is authorized to schedule for this job (e.g., if job belongs to this HR)
    // This requires a `hr_id` in the `jobs` table or a job-hr association table.
    // For now, assuming HR can schedule for any job applications.
    const [hrUser] = await pool.execute("SELECT id, username, email, role FROM users WHERE id = ?", [req.user.id]);
    const [jobseekerUser] = await pool.execute("SELECT id, username, email, role FROM users WHERE id = ?", [application.jobseeker_id]);

    if (!hrUser[0] || !jobseekerUser[0]) {
      console.error("User data not found for scheduling interview.", { hrId: req.user.id, jobseekerId: application.jobseeker_id });
      return res.status(500).json({ error: "Internal server error: User data missing." });
  }

    // 2. Insert into interviews table
    const [interviewResult] = await pool.execute(
      `INSERT INTO interviews (application_id, interviewer_id, jobseeker_id, interview_date, interview_time, interview_location, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`, 
      [application.application_id, req.user.id, application.jobseeker_id, interviewDate, interviewTime, interviewLocation, notes || ""]
    );
    const interviewId = interviewResult.insertId;

    // 3. Create notifications for HR and Jobseeker
    const now = new Date();

    // Notification for HR
    await pool.execute(
      `INSERT INTO notifications (user_id, role, type, title, message, is_read, created_at, related_job_id, related_application_id, related_user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [
        req.user.id,
        'hr',
        'interview',
        `Interview Scheduled for ${jobseekerUser[0].username}`,
        `An interview has been scheduled for application ${application.application_id} for the job ${application.job_title}.`,
        false,
        now,
        application.job_id,
        application.application_id,
        application.jobseeker_id
      ]
    );

    // Notification for Jobseeker
    await pool.execute(
      `INSERT INTO notifications (user_id, role, type, title, message, is_read, created_at, related_job_id, related_application_id, related_user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
      [
        application.jobseeker_id,
        'jobseeker',
        'interview',
        `Interview Scheduled for Your Application`,
        `Your interview for the job ${application.job_title} (Application ID: ${application.application_id}) has been scheduled. Check your schedule for details.`,
        false,
        now,
        application.job_id,
        application.application_id,
        req.user.id
      ]
    );

    // 4. Update application status (if `job_applications` table has a status field)
    await pool.execute(
      `UPDATE job_applications SET status = ?, interview_details = ? WHERE application_id = ?`, 
      ['Interview Scheduled', JSON.stringify({ interviewDate, interviewTime, interviewLocation, notes }), application.application_id]
    );

    res.status(200).json({ message: "Interview scheduled successfully", interviewId, application });
  } catch (error) {
    console.error("Error scheduling interview:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// // HR Job Management Controllers
// const createJob = async (req, res) => {
//   try {
//     const {
//       title, description, location, type, experience,
//       salaryMin, salaryMax, salaryPeriod, skills, workMode,
//       isUrgent, openings, eligibility, applicationsNeeded, company // Added company and other fields
//     } = req.body;
//     const hr_id = req.user.id; // From authenticated user

//     console.log("Debug: createJob - applicationsNeeded from req.body:", applicationsNeeded);

//     let parsedSkills;
//     try {
//       parsedSkills = JSON.parse(skills);
//     } catch (e) {
//       return res.status(400).json({ error: "Skills must be a valid JSON array string." });
//     }

//     // Handle file upload for attachment
//     const hasAttachment = !!req.file;
//     const attachmentName = hasAttachment ? req.file.filename : null;
//     const attachmentSize = hasAttachment ? req.file.size : null;
//     const attachmentType = hasAttachment ? req.file.mimetype : null;
//     console.log("Debug: createJob - attachmentName:", attachmentName);
//     console.log("Debug: createJob - attachmentSize:", attachmentSize);
//     console.log("Debug: createJob - attachmentType:", attachmentType);

//     const [result] = await pool.execute(
//       `INSERT INTO jobs (
//         hr_id, title, company, description, location, type, experience,
//         min_salary, max_salary, currency, pay_period, skills, work_mode,
//         is_urgent, openings, eligibility, applications_needed, posted_date,
//         attachment_name, attachment_size, attachment_type, has_attachment
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         hr_id, title, company, description, location, type, experience,
//         parseFloat(salaryMin.replace(/[^\d.]/g, '')),
//         parseFloat(salaryMax.replace(/[^\d.]/g, '')),
//         '₹',
//         salaryPeriod, parsedSkills.join(', '), workMode,
//         isUrgent ? 1 : 0,
//         applicationsNeeded || null,
//         eligibility || null,
//         applicationsNeeded || 0,
//         new Date(),
//         attachmentName, attachmentSize, attachmentType, hasAttachment
//       ]
//     );
    

//     const jobId = result.insertId;

//     res.status(201).json({ message: "Job posted successfully", jobId });
//   } catch (error) {
//     console.error("Error posting job:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
//tan
const createJob = async (req, res) => {
  try {
    const {
      title, description, location, type, experience,
      salaryMin, salaryMax, salaryPeriod, skills, workMode,
      isUrgent, openings, eligibility, applicationsNeeded, company
    } = req.body;
    const hr_id = req.user.id;

    let parsedSkills;
    try {
      parsedSkills = JSON.parse(skills);
    } catch {
      return res.status(400).json({ error: "Skills must be a valid JSON array string." });
    }

    const hasAttachment = !!req.file;
    const attachmentName = hasAttachment ? req.file.filename : null;
    const attachmentSize = hasAttachment ? req.file.size : null;
    const attachmentType = hasAttachment ? req.file.mimetype : null;

    const [result] = await pool.execute(
      `INSERT INTO jobs (
        hr_id, title, company, description, location, type, experience,
        min_salary, max_salary, currency, pay_period, skills, work_mode,
        is_urgent, openings, eligibility, applications_needed, posted_date,
        attachment_name, attachment_size, attachment_type, has_attachment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        hr_id, title, company, description, location, type, experience,
        parseFloat(salaryMin.replace(/[^\d.]/g, '')),
        parseFloat(salaryMax.replace(/[^\d.]/g, '')),
        '₹', salaryPeriod, parsedSkills.join(', '), workMode,
        isUrgent ? 1 : 0,
        applicationsNeeded || null,
        eligibility || null,
        applicationsNeeded || 0,
        new Date(),
        attachmentName, attachmentSize, attachmentType, hasAttachment
      ]
    );

    res.status(201).json({ message: "Job posted successfully", jobId: result.insertId });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getAllJobs = async (req, res) => {
  try {
    const [jobs] = await pool.execute("SELECT * FROM jobs WHERE hr_id = ?", [req.user.id]);
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;
    const [jobs] = await pool.execute("SELECT * FROM jobs WHERE id = ? AND hr_id = ?", [jobId, req.user.id]);

    const job = jobs[0];
    if (!job) {
      return res.status(404).json({ error: "Job not found or you don't have permission to view it" });
    }
    res.json(job);
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const updateJob = async (req, res) => {
//   try {
//     const { jobId } = req.params;
//     console.log("Debug: updateJob - req.body:", req.body);
//     console.log("Debug: updateJob - req.file:", req.file);
//     const {
//       title, company, description, location, type, experience,
//       salaryMin, salaryMax, salaryPeriod, skills, workMode,
//       isUrgent, openings, eligibility, applicationsNeeded, requirements, responsibilities // Added other fields from frontend
//     } = req.body;
//     const hr_id = req.user.id;

//     let parsedSkills;
//     try {
//       parsedSkills = JSON.parse(skills);
//     } catch (e) {
//       return res.status(400).json({ error: "Skills must be a valid JSON array string." });
//     }

//     const hasAttachment = !!req.file;
//     const attachmentName = hasAttachment ? req.file.filename : null;
//     const attachmentSize = hasAttachment ? req.file.size : null;
//     const attachmentType = hasAttachment ? req.file.mimetype : null;
//     console.log("Debug: updateJob - attachmentName:", attachmentName);
//     console.log("Debug: updateJob - attachmentSize:", attachmentSize);
//     console.log("Debug: updateJob - attachmentType:", attachmentType);

//     const [existingJob] = await pool.execute("SELECT * FROM jobs WHERE id = ? AND hr_id = ?", [jobId, hr_id]);
//     if (existingJob.length === 0) {
//       return res.status(404).json({ error: "Job not found or you don't have permission to update it" });
//     }

//     const updates = {};
//     if (title !== undefined) updates.title = title;
//     if (company !== undefined) updates.company = company;
//     if (description !== undefined) updates.description = description;
//     if (location !== undefined) updates.location = location;
//     if (type !== undefined) updates.type = type;
//     if (experience !== undefined) updates.experience = experience;
    
//     // Handle numeric fields: if an empty string is sent, store as NULL
//     if (salaryMin !== undefined) updates.min_salary = salaryMin === '' ? null : parseFloat(salaryMin.replace(/[^\\d.]/g, ''));
//     if (salaryMax !== undefined) updates.max_salary = salaryMax === '' ? null : parseFloat(salaryMax.replace(/[^\\d.]/g, ''));
//     if (salaryPeriod !== undefined) updates.pay_period = salaryPeriod;
//     if (skills !== undefined) updates.skills = parsedSkills.join(', ');
//     if (workMode !== undefined) updates.work_mode = workMode;
//     if (isUrgent !== undefined) updates.is_urgent = isUrgent ? 1 : 0;
//     if (openings !== undefined) updates.openings = openings === '' ? null : openings;
//     if (eligibility !== undefined) updates.eligibility = eligibility;
//     if (applicationsNeeded !== undefined) updates.applications_needed = applicationsNeeded === '' ? null : applicationsNeeded;
//     if (requirements !== undefined) updates.requirements = requirements;
//     if (responsibilities !== undefined) updates.responsibilities = responsibilities;

//     // Update attachment details only if a new file is provided
//     if (attachmentName) {
//       updates.attachment_name = attachmentName;
//       updates.attachment_size = attachmentSize;
//       updates.attachment_type = attachmentType;
//     }

//     if (Object.keys(updates).length === 0) {
//       return res.status(400).json({ message: "No updates provided" });
//     }

//     const setClause = Object.keys(updates).map(key => `\`${key}\` = ?`).join(', ');
//     const values = [...Object.values(updates), jobId, hr_id];

//     await pool.execute(
//       `UPDATE jobs SET ${setClause}, updated_at = NOW() WHERE id = ? AND hr_id = ?`,
//       values
//     );

//     res.json({ message: "Job updated successfully" });
//   } catch (error) {
//     console.error("Error updating job:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      title, company, description, location, type, experience,
      salaryMin, salaryMax, salaryPeriod, skills, workMode,
      isUrgent, openings, eligibility, applicationsNeeded, requirements, responsibilities,
      removeAttachment
    } = req.body;
    const hr_id = req.user.id;

    let parsedSkills;
    try {
      parsedSkills = JSON.parse(skills);
    } catch {
      return res.status(400).json({ error: "Skills must be a valid JSON array string." });
    }

    const [existingJob] = await pool.execute("SELECT * FROM jobs WHERE id = ? AND hr_id = ?", [jobId, hr_id]);
    if (existingJob.length === 0) {
      return res.status(404).json({ error: "Job not found or unauthorized" });
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (company !== undefined) updates.company = company;
    if (description !== undefined) updates.description = description;
    if (location !== undefined) updates.location = location;
    if (type !== undefined) updates.type = type;
    if (experience !== undefined) updates.experience = experience;
    if (salaryMin !== undefined) updates.min_salary = salaryMin === '' ? null : parseFloat(salaryMin.replace(/[^\d.]/g, ''));
    if (salaryMax !== undefined) updates.max_salary = salaryMax === '' ? null : parseFloat(salaryMax.replace(/[^\d.]/g, ''));
    if (salaryPeriod !== undefined) updates.pay_period = salaryPeriod;
    if (skills !== undefined) updates.skills = parsedSkills.join(', ');
    if (workMode !== undefined) updates.work_mode = workMode;
    if (isUrgent !== undefined) updates.is_urgent = isUrgent ? 1 : 0;
    if (openings !== undefined) updates.openings = openings === '' ? null : openings;
    if (eligibility !== undefined) updates.eligibility = eligibility;
    if (applicationsNeeded !== undefined) updates.applications_needed = applicationsNeeded === '' ? null : applicationsNeeded;
    if (requirements !== undefined) updates.requirements = requirements;
    if (responsibilities !== undefined) updates.responsibilities = responsibilities;

    // Attachment handling
    if (req.file) {
      updates.attachment_name = req.file.filename;
      updates.attachment_size = req.file.size;
      updates.attachment_type = req.file.mimetype;
      updates.has_attachment = true;
    } else if (removeAttachment === 'true') {
      updates.attachment_name = null;
      updates.attachment_size = null;
      updates.attachment_type = null;
      updates.has_attachment = false;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No updates provided" });
    }

    const setClause = Object.keys(updates).map(key => `\`${key}\` = ?`).join(', ');
    const values = [...Object.values(updates), jobId, hr_id];

    await pool.execute(`UPDATE jobs SET ${setClause}, updated_at = NOW() WHERE id = ? AND hr_id = ?`, values);

    res.json({ message: "Job updated successfully" });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const hr_id = req.user.id;

    const [result] = await pool.execute("DELETE FROM jobs WHERE id = ? AND hr_id = ?", [jobId, hr_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Job not found or you don't have permission to delete it" });
    }

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// HR Job Application Management
const getAllApplications = async (req, res) => {
  try {
    const [applications] = await pool.execute(
      `SELECT ja.*, j.title as job_title, u.username as jobseeker_username, u.email as jobseeker_email
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       JOIN users u ON ja.jobseeker_id = u.id
       WHERE j.hr_id = ?`,
      [req.user.id]
    );
    res.json(applications);
  } catch (error) {
    console.error("Error fetching all applications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const [applications] = await pool.execute(
      `SELECT ja.*, j.title as job_title, u.username as jobseeker_username, u.email as jobseeker_email
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       JOIN users u ON ja.jobseeker_id = u.id
       WHERE ja.application_id = ? AND j.hr_id = ?`,
      [applicationId, req.user.id]
    );

    const application = applications[0];
    if (!application) {
      return res.status(404).json({ error: "Application not found or you don't have permission to view it" });
    }
    res.json(application);
  } catch (error) {
    console.error("Error fetching application by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, feedback } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Missing required status" });
    }

    const [existingApplication] = await pool.execute(
      `SELECT ja.application_id, j.hr_id 
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       WHERE ja.application_id = ? AND j.hr_id = ?`,
      [applicationId, req.user.id]
    );

    if (existingApplication.length === 0) {
      return res.status(404).json({ error: "Application not found or you don't have permission to update it" });
    }

    const updates = { status };
    if (feedback !== undefined) {
      updates.feedback = feedback;
    }

    const setClause = Object.keys(updates).map(key => `\`${key}\` = ?`).join(', ');
    const values = [...Object.values(updates), applicationId];

    await pool.execute(
      `UPDATE job_applications SET ${setClause} WHERE application_id = ?`,
      values
    );

    // Potentially send a notification to the jobseeker about the status change
    // This can be implemented here or as a separate utility/event.

    res.json({ message: "Application status updated successfully" });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// HR Jobseeker Profile Viewing
const getJobseekerProfile = async (req, res) => {
  try {
    const { jobseekerId } = req.params;
    const profile = await findJobseekerProfileByUserId(jobseekerId);

    if (!profile) {
      return res.status(404).json({ error: "Jobseeker profile not found." });
    }
    // Ensure HR can only view profiles related to jobs they manage or for applications they are processing
    // For now, assuming HR can view any jobseeker profile for simplicity, but this can be refined later.
    res.json(profile);
  } catch (error) {
    console.error("Error fetching jobseeker profile for HR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const processJobPoster = async (req, res) => {
  try {
    // In a real application, this is where you would integrate with an AI/OCR service
    // to extract job details from the uploaded poster (req.file).
    // For this simulation, we'll return mock data.
    
    const mockJobDetails = {
      title: "AI Extracted Job Title (Example)",
      company: "AI Corp (Example)",
      description: "This job description was extracted from the uploaded poster by a simulated AI. Please review and edit as necessary.",
      location: "Remote",
      type: "Full-time",
      experience: "Mid-level",
      salaryMin: "₹50,000",
      salaryMax: "₹80,000",
      salaryPeriod: "monthly",
      skills: ["Communication", "Problem Solving", "Teamwork"], // Example skills
      workMode: "Remote", // Assuming this can be extracted or defaulted
      isUrgent: false, // Default or extracted
      openings: 5, // Default or extracted
      eligibility: "Bachelor's Degree in related field", // Default or extracted
      applicationsNeeded: 20, // Default or extracted
      requirements: "Extracted requirements example: strong analytical skills, experience with modern tech stack.", // New field
      responsibilities: "Extracted responsibilities example: develop and maintain web applications, collaborate with cross-functional teams.", // New field
    };

    if (req.file) {
      // If a file was uploaded, attach its details to the mock data
      mockJobDetails.attachment_name = req.file.filename;
      mockJobDetails.attachment_size = req.file.size;
      mockJobDetails.attachment_type = req.file.mimetype;
    }

    res.status(200).json({ message: "Poster processed successfully (simulated).", jobDetails: mockJobDetails });
  } catch (error) {
    console.error("Error processing job poster:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getSchedule,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  scheduleInterview,
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  getJobseekerProfile,
  processJobPoster,
}; 