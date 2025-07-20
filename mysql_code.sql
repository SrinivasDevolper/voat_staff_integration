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

CREATE TABLE staffing_project_backend.jobs (
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

select * from staffing_project_backend.jobs;
describe staffing_project_backend.jobs;
UPDATE staffing_project_backend.jobs SET closing_date = CURDATE() - INTERVAL 1 DAY WHERE id = 60;
INSERT INTO staffing_project_backend.jobs (
  hr_id,
  title,
  company,
  description,
  location,
  min_salary,
  max_salary,
  currency,
  pay_period,
  type,
  experience,
  skills,
  work_mode,
  is_urgent,
  is_new,
  posted_date,
  closing_date,
  openings,
  eligibility,
  applications_received,
  applications_needed,
  job_status,
  attachment_name,
  attachment_size,
  attachment_type
)
VALUES (
  60,
  'AI Product Designer',
  'NeuroVerse Labs',
  'Design cutting-edge AI-powered user interfaces and collaborate with engineers on next-gen digital products.',
  'Pune',
  40000,
  60000,
  '₹',
  'monthly',
  'Full Time',
  '2-3 years',
  '["Figma", "UX", "AI APIs", "Prototyping", "User Research"]',
  'Hybrid',
  0,
  1,
  NOW(),
  '2025-08-03 12:00:00',
  2,
  'MBA preferred.',
  0,
  3,
  'active',
  NULL,
  NULL,
  NULL
);


INSERT INTO staffing_project_backend.jobs (
  hr_id, title, company, description, location,
  min_salary, max_salary, currency, pay_period,
  type, experience, skills, work_mode,
  is_urgent, is_new, posted_date, openings,
  eligibility, applications_received, applications_needed,
  job_status, attachment_name, attachment_size, attachment_type
)
VALUES
(60, 'AI Product Designer', 'NeuroVerse Labs', 'Design cutting-edge AI-powered user interfaces and collaborate with engineers on next-gen digital products.', 'Pune', 40000, 60000, '₹', 'monthly', 'Full Time', '2-3 years', '["Figma", "UX", "AI APIs", "Prototyping", "User Research"]', 'Hybrid', 0, 1, NOW(), "2025-08-03 12:00:00", 2, 'MBA preferred.', 0, 3, 'active', NULL, NULL, NULL);

-- 1. AI Research Assistant
-- (1, 'AI Research Assistant', 'NeuroNet Labs', 'Assist in training ML models and analyzing datasets.', 'Bangalore',
--  50000.00, 80000.00, '₹', 'monthly', 'Full Time',
--  'Entry-level', 'Python,TensorFlow,Data Analysis', 'Hybrid', 1, 1,
--  NOW(), 2, 'M.Tech in AI/ML or related field', 5),

-- -- 2. Cybersecurity Analyst
-- (1, 'Cybersecurity Analyst', 'SecureSphere', 'Monitor and respond to security threats.', 'Hyderabad',
--  60000.00, 90000.00, '₹', 'monthly', 'Full Time',
--  '2-3 years', 'SIEM,Network Security,Python', 'Remote', 1, 0,
--  NOW(), 1, 'B.Tech in Cybersecurity or equivalent', 3),

-- -- 3. Blockchain Developer
-- (1, 'Blockchain Developer', 'ChainVerse', 'Build and deploy smart contracts and blockchain solutions.', 'Pune',
--  70000.00, 110000.00, '₹', 'monthly', 'Contract',
--  'Mid-level', 'Solidity,Web3.js,Ethereum', 'Remote', 0, 1,
--  NOW(), 1, 'Experience in Ethereum or similar platforms', 2),

-- -- 4. Robotics Software Engineer
-- (1, 'Robotics Software Engineer', 'RoboCore Systems', 'Develop ROS-based robotic applications.', 'Chennai',
--  55000.00, 85000.00, '₹', 'monthly', 'Full Time',
--  '3+ years', 'ROS,C++,Python', 'Work from Office', 0, 1,
--  NOW(), 1, 'B.E./B.Tech in Robotics or Mechatronics', 1),

-- -- 5. Cloud Cost Optimization Specialist
-- (1, 'Cloud Cost Optimization Specialist', 'FinCloud', 'Analyze and reduce cloud infrastructure spending.', 'Delhi',
--  60000.00, 100000.00, '₹', 'monthly', 'Full Time',
--  'Senior', 'AWS,Budgeting,Cost Explorer', 'Hybrid', 0, 0,
--  NOW(), 1, '5+ years in cloud platforms, cost management tools', 1);

--  
INSERT INTO staffing_project_backend.jobs (
  hr_id, title, company, description, location,
  min_salary, max_salary, currency, pay_period,
  type, experience, skills, work_mode,
  is_urgent, is_new, posted_date, closing_date,  openings,
  eligibility, applications_received, applications_needed,
  job_status, attachment_name, attachment_size, attachment_type
) VALUES
(1, 'Frontend Developer', 'TechNova', 'Build UI with React.', 'Hyderabad', 30000, 50000, '₹', 'monthly', 'Full Time', '1-2 years', '["React", "JavaScript", "HTML"]', 'Remote', 1, 1, NOW(), '2025-08-03 12:00:00', 3, 'B.Tech in CSE', 0, 10, 'active', NULL, NULL, NULL);
-- (1, 'Backend Engineer', 'DataForge', 'Develop backend services using Node.js.', 'Bangalore', 40000, 70000, '₹', 'monthly', 'Full Time', '3+ years', '["Node.js", "Express", "MongoDB"]', 'Hybrid', 0, 1, NOW(), 2, '3 years backend dev exp.', 0, 5, 'active', NULL, NULL, NULL),
-- (2, 'Data Analyst', 'InsightWorks', 'Analyze business data using SQL & Excel.', 'Chennai', 25000, 40000, '₹', 'monthly', 'Contract', 'Entry-level', '["SQL", "Excel", "PowerBI"]', 'Work from Office', 0, 0, NOW(), 5, 'BSc Statistics preferred.', 0, 8, 'active', NULL, NULL, NULL),
-- (3, 'Product Manager', 'SkyReach', 'Manage product lifecycle.', 'Mumbai', 60000, 100000, '₹', 'monthly', 'Full Time', 'Mid-level', '["Agile", "Scrum", "Roadmaps"]', 'Hybrid', 1, 1, NOW(), 1, 'MBA or equivalent.', 0, 1, 'active', NULL, NULL, NULL),
-- (1, 'Graphic Designer', 'VisualEdge', 'Design marketing assets.', 'Delhi', 20000, 35000, '₹', 'monthly', 'Part Time', '1-2 years', '["Photoshop", "Illustrator"]', 'Remote', 0, 1, NOW(), 2, 'Creative arts degree.', 0, 2, 'active', NULL, NULL, NULL),
-- (2, 'Mobile Developer', 'AppFuel', 'Create Android/iOS apps.', 'Hyderabad', 45000, 75000, '₹', 'monthly', 'Full Time', '2-3 years', '["Flutter", "React Native"]', 'Remote', 1, 1, NOW(), 2, 'Hands-on mobile exp.', 0, 3, 'active', NULL, NULL, NULL),
-- (3, 'QA Engineer', 'Testify', 'Automated & manual testing.', 'Bangalore', 30000, 50000, '₹', 'monthly', 'Full Time', 'Entry-level', '["Selenium", "JIRA"]', 'Work from Office', 0, 1, NOW(), 1, 'QA certification preferred.', 0, 3, 'active', NULL, NULL, NULL),
-- (1, 'DevOps Engineer', 'CloudBridge', 'Manage CI/CD pipelines.', 'Pune', 50000, 80000, '₹', 'monthly', 'Full Time', 'Mid-level', '["Docker", "Kubernetes", "AWS"]', 'Hybrid', 0, 1, NOW(), 2, 'B.E. in IT', 0, 4, 'active', NULL, NULL, NULL),
-- (2, 'UI/UX Designer', 'DesignLogic', 'Improve product usability.', 'Kolkata', 35000, 60000, '₹', 'monthly', 'Freelance', '1-2 years', '["Figma", "UX Research"]', 'Remote', 0, 1, NOW(), 1, 'Portfolio required.', 0, 1, 'active', NULL, NULL, NULL),
-- (3, 'HR Executive', 'PeopleFirst', 'Manage recruitment.', 'Delhi', 25000, 40000, '₹', 'monthly', 'Full Time', 'Any experience', '["Recruitment", "HRMS"]', 'Work from Office', 0, 1, NOW(), 1, 'MBA HR preferred.', 0, 2, 'active', NULL, NULL, NULL),
-- (1, 'Full Stack Developer', 'DevLoop', 'React + Node.js web apps.', 'Chennai', 60000, 90000, '₹', 'monthly', 'Full Time', '3+ years', '["React", "Node.js", "MongoDB"]', 'Hybrid', 1, 1, NOW(), 2, 'Full-stack exp. required.', 0, 2, 'active', NULL, NULL, NULL),
-- (2, 'Technical Writer', 'DocuWave', 'Write technical docs.', 'Hyderabad', 20000, 30000, '₹', 'monthly', 'Internship', 'Entry-level', '["Markdown", "API Docs"]', 'Remote', 0, 0, NOW(), 1, 'English fluency required.', 0, 1, 'active', NULL, NULL, NULL),
-- (3, 'Digital Marketer', 'AdSprint', 'Run digital campaigns.', 'Mumbai', 30000, 45000, '₹', 'monthly', 'Full Time', '1-2 years', '["SEO", "Google Ads"]', 'Work from Office', 0, 1, NOW(), 2, 'Certifications preferred.', 0, 3, 'active', NULL, NULL, NULL),
-- (2, 'Cloud Engineer', 'NimbusTech', 'Deploy on cloud platforms.', 'Bangalore', 70000, 120000, '₹', 'monthly', 'Full Time', 'Senior', '["AWS", "Terraform"]', 'Remote', 1, 1, NOW(), 1, '5+ years cloud experience.', 0, 1, 'active', NULL, NULL, NULL),
-- (1, 'Business Analyst', 'InsightIQ', 'Translate data to strategy.', 'Pune', 40000, 60000, '₹', 'monthly', 'Full Time', '2-3 years', '["Excel", "Business Analysis"]', 'Hybrid', 0, 1, NOW(), 2, 'MBA preferred.', 0, 3, 'active', NULL, NULL, NULL);

-- (1, 'Frontend Developer', 'TechNova', 'Develop UI components using React.', 'Bangalore',
--  30000.00, 50000.00, '₹', 'monthly', 'Full Time',
--  '1-2 years', 'HTML,CSS,JavaScript,React', 'Hybrid', 1, 1,
--  NOW(), 3, 'B.Tech in CS or equivalent', 10),
-- (1, 'Backend Engineer', 'DataStack', 'Build RESTful APIs and microservices.', 'Hyderabad',
--  45000.00, 70000.00, '₹', 'monthly', 'Full Time',
--  '2-3 years', 'Node.js,Express,MySQL,Redis', 'Remote', 0, 1,
--  NOW(), 2, 'Computer Science Graduate', 5),

-- (1, 'UI/UX Designer', 'DesignX', 'Work with product & engineering teams.', 'Mumbai',
--  25000.00, 40000.00, '₹', 'monthly', 'Internship',
--  'Entry-level', 'Figma,AdobeXD,Design Thinking', 'Remote', 0, 1,
--  NOW(), 1, 'Design background preferred', 2),

-- (1, 'Data Analyst', 'InsightOps', 'Analyze large data sets and build dashboards.', 'Pune',
--  40000.00, 60000.00, '₹', 'monthly', 'Full Time',
--  'Mid-level', 'SQL,Excel,PowerBI,Python', 'Work from Office', 1, 1,
--  NOW(), 2, 'Graduation + Analytical mindset', 4),

-- (1, 'HR Executive', 'PeoplePro', 'Coordinate interviews and handle onboarding.', 'Delhi',
--  20000.00, 30000.00, '₹', 'monthly', 'Full Time',
--  'Any experience', 'HRMS,Excel,Communication', 'Hybrid', 0, 1,
--  NOW(), 1, 'MBA or equivalent', 3);
 
SELECT is_new FROM staffing_project_backend.jobs ORDER BY posted_date DESC;

SELECT * from staffing_project_backend.jobs;

CREATE TABLE staffing_project_backend.job_applications (
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

INSERT INTO staffing_project_backend.jobs (
  id,
  title,
  company,
  description,
  location,
  min_salary,
  max_salary,
  currency,
  pay_period,
  type,
  experience,
  skills,
  work_mode,
  is_urgent,
  is_new,
  posted_date,
  openings,
  eligibility,
  application_limit,
  status,
  closed_date,
  created_at,
  updated_at
)
VALUES (
  1002,
  'AI Product Designer',
  'NeuroVerse Labs',
  'Design cutting-edge AI-powered user interfaces and collaborate with engineers on next-gen digital products.',
  'Bangalore',
  60000,
  90000,
  '₹',
  'monthly',
  'Contract',
  '3-5 years',
  '["Figma", "UX", "AI APIs", "Prototyping", "User Research"]',
  'Hybrid',
  1,
  1,
  '2025-07-20 12:00:00',
  2,
  'Any Bachelor\'s Degree + Design Certification preferred',
  5,
  'active',
  '2025-08-03 12:00:00',
  '2025-07-20 12:00:00',
  '2025-07-20 12:00:00'
);



DROP TABLE staffing_project_backend.pending_signups;
DROP TABLE staffing_project_backend.jobseeker_profiles;
DROP TABLE staffing_project_backend.users;

select * from staffing_project_backend.users;
select * from staffing_project_backend.job_applications;
select * from staffing_project_backend.jobs;
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

ALTER TABLE staffing_project_backend.jobs ADD COLUMN closing_date DATE AFTER posted_date;

SELECT * FROM staffing_project_backend.users;
SELECT * FROM staffing_project_backend.jobs where id = 1;
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


