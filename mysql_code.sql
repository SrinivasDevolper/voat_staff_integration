CREATE TABLE staffing_project_backend.pending_signups (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tempToken VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  hashedPassword VARCHAR(255) NOT NULL,
  resume_filepath VARCHAR(255),
  role ENUM('jobseeker','hr','admin','superadmin') NOT NULL,
  otpCode VARCHAR(6) NOT NULL,
  otpExpires BIGINT NOT NULL,
  otpAttempts INT DEFAULT 0,
  lastOtpSent BIGINT,
  blockExpires BIGINT
);

CREATE TABLE staffing_project_backend.users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('jobseeker','hr','admin','superadmin') NOT NULL DEFAULT 'jobseeker',
  voat_id VARCHAR(255) UNIQUE,
  verified TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  loginAttempts INT DEFAULT 0,
  otp VARCHAR(6),
  otpExpires BIGINT,
  resetToken VARCHAR(255),
  resetExpires BIGINT,
  verificationToken VARCHAR(255),
  verificationExpires BIGINT,
  newEmail VARCHAR(255),
  lastFailedLoginAttempt BIGINT,
  lockoutExpires BIGINT,
  otpAttempts INT DEFAULT 0,
  lastOtpSent BIGINT,
  name VARCHAR(255),
  phone VARCHAR(20),
  gender VARCHAR(10),
  address TEXT,
  whatsapp VARCHAR(20)
);

CREATE TABLE staffing_project_backend.jobseeker (
  user_id INT NOT NULL PRIMARY KEY,
  resume_filepath VARCHAR(255),
  bio TEXT,
  portfolio VARCHAR(255),
  education TEXT,
  experience_years DECIMAL(4,1),
  skills TEXT,
  projects JSON,
  certifications JSON,
  parent_name VARCHAR(255),
  parent_phone VARCHAR(20),
  parent_relation VARCHAR(50),
  parent_email VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE jobs (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  hr_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  min_salary DECIMAL(10,2),
  max_salary DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT '₹',
  pay_period ENUM('hourly','daily','weekly','bi-weekly','monthly','annually'),
  type ENUM('Full Time','Part Time','Contract','Temporary','Internship','Freelance') NOT NULL,
  experience ENUM(
    'Any experience','Entry-level','1-2 years','2-3 years',
    '3+ years','Mid-level','Senior','Lead','Executive'
  ) NOT NULL,
  skills TEXT,
  work_mode ENUM('Work from Office','Remote','Hybrid') NOT NULL,
  is_urgent TINYINT(1) DEFAULT 0,
  is_new TINYINT(1) DEFAULT 0,
  posted_date DATETIME NOT NULL,
  openings INT,
  eligibility TEXT,
  applications_received INT DEFAULT 0,
  applications_needed INT,
  job_status ENUM('active','inactive','closed','hiring done') DEFAULT 'active',
  attachment_name VARCHAR(255),
  attachment_size VARCHAR(50),
  attachment_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hr_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE job_applications (
  application_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  job_id INT NOT NULL,
  jobseeker_id INT NOT NULL,
  application_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Pending',
  resume_filepath VARCHAR(255),
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
  FOREIGN KEY (jobseeker_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
  notification_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE scheduled_events (
  event_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  event_type VARCHAR(50) NOT NULL,  -- e.g., 'interview', 'deadline', 'webinar', 'reminder'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_datetime DATETIME NOT NULL,
  location VARCHAR(255),
  related_entity_id INT,            -- Can point to job_id, application_id, interview_id, etc.
  related_entity_type VARCHAR(50),  -- e.g., 'job', 'application', 'interview'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE interviews (
  interview_id INT AUTO_INCREMENT PRIMARY KEY,
  application_id INT NOT NULL,
  interviewer_id INT NOT NULL,
  interview_date DATE NOT NULL,
  interview_time TIME NOT NULL,
  interview_type VARCHAR(50) DEFAULT NULL,
  status VARCHAR(50) DEFAULT 'Scheduled',
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_application (application_id),
  INDEX idx_interviewer (interviewer_id)
) ENGINE=InnoDB;

CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) DEFAULT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) DEFAULT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_author (author_id)
) ENGINE=InnoDB;

INSERT INTO staffing_project_backend.users (
  id,
  username,
  email,
  password,
  role,
  verified
) VALUES (
  1,
  'johndoe',
  'john@example.com',
  'hashed_dummy_password',  -- use bcrypt hash if required by your backend
  'jobseeker',
  1
);

INSERT INTO staffing_project_backend.jobseeker (
  user_id,
  resume_filepath,
  bio,
  portfolio,
  education,
  experience_years,
  skills,
  projects,
  certifications,
  parent_name,
  parent_phone,
  parent_relation,
  parent_email
) VALUES (
  1,
  'resumes/john_doe_resume.pdf',
  'Passionate full-stack developer with a strong foundation in MERN stack and cloud deployment.',
  'https://johnportfolio.dev',
  'B.Tech in Computer Science, XYZ University, 2020',
  2.5,
  'JavaScript, React, Node.js, MySQL, AWS, Docker',
  JSON_ARRAY(
    JSON_OBJECT('title', 'E-commerce App', 'link', 'https://github.com/johndoe/shop-app'),
    JSON_OBJECT('title', 'Task Manager', 'link', 'https://github.com/johndoe/task-manager')
  ),
  JSON_ARRAY(
    JSON_OBJECT('name', 'AWS Certified Developer', 'issuer', 'Amazon'),
    JSON_OBJECT('name', 'Full-Stack Bootcamp', 'issuer', 'Udemy')
  ),
  'Jane Doe',
  '+919876543210',
  'Mother',
  'jane.doe@example.com'
);

DROP TABLE staffing_project_backend.pending_signups;
DROP TABLE staffing_project_backend.jobseeker_profiles;
DROP TABLE staffing_project_backend.users;

select * from staffing_project_backend.jobseeker;
SELECT resume_filepath FROM jobseeker WHERE user_id = 1;

ALTER TABLE staffing_project_backend.pending_signups
  MODIFY lastOtpSent BIGINT NOT NULL;

ALTER TABLE staffing_project_backend.pending_signups
  MODIFY blockExpires BIGINT DEFAULT NULL;

ALTER TABLE staffing_project_backend.pending_signups
  ADD COLUMN createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
  
ALTER TABLE staffing_project_backend.users ADD COLUMN otpVerifyAttempts INT DEFAULT 0;
ALTER TABLE staffing_project_backend.pending_signups ADD COLUMN otpVerifyAttempts INT DEFAULT 0;

ALTER TABLE staffing_project_backend.users
ADD COLUMN passwordAttempts INT DEFAULT 0;

SELECT * FROM staffing_project_backend.users;
SELECT * FROM staffing_project_backend.pending_signups;
select * from staffing_project_backend.pending_signups;

SELECT * FROM staffing_project_backend.users where email = 'ravi@gmail.com';

DELETE FROM staffing_project_backend.users
WHERE email = 'ravi@gmail.com';

DELETE FROM staffing_project_backend.pending_signups
WHERE email = 'ravi@gmail.com';

UPDATE staffing_project_backend.pending_signups
SET otpAttempts = 0
WHERE email = 'srinivas@gmail.com';


