const multer = require("multer");
const path = require("path");

// Multer storage configuration for resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `resume-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Multer storage configuration for job attachments
const jobAttachmentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/job_attachments/"); // New directory for job attachments
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `job-${Date.now()}${path.extname(file.originalname)}` // Prefix for job attachments
    );
  },
});

// Multer storage configuration for announcement images
const imageStorage = multer.diskStorage({
  destination: "uploads/announcements/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Centralized file filter for resumes (PDF, DOC, DOCX)
const resumeFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  const allowedExtensions = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOC, and DOCX files are allowed."), false);
  }
};

// Centralized file filter for job attachments (PDF, DOCX, JPG, PNG - Max 5MB)
const jobAttachmentFileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/jpg",
    "image/png"
  ];
  const allowedExtensions = [".pdf", ".doc", ".docx", ".jpeg", ".jpg", ".png"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed."), false);
  }
};

// Multer upload middleware for resumes (PDF, DOC, DOCX, 5MB limit)
const upload = multer({
  storage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Multer upload middleware for job attachments
const uploadJobAttachment = multer({
  storage: jobAttachmentStorage,
  fileFilter: jobAttachmentFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Multer upload middleware for images (JPEG, JPG, PNG only)
const imageUpload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    const isImage = /jpeg|jpg|png/.test(file.mimetype);
    cb(null, isImage);
  },
});

module.exports = {
  upload,
  imageUpload,
  uploadJobAttachment // Export the new middleware
}; 