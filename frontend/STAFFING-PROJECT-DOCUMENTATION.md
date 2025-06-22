# STAFFING-PROJECT Frontend Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Component Architecture](#component-architecture)
5. [Routing Structure](#routing-structure)
6. [Features and Functionality](#features-and-functionality)
7. [UI/UX Design](#uiux-design)
8. [State Management](#state-management)
9. [API Integration](#api-integration)
10. [Deployment](#deployment)

## Project Overview
STAFFING-PROJECT is a comprehensive staffing and recruitment management system that facilitates the hiring process between HR professionals and job seekers. The platform provides features for job posting, application management, interview scheduling, and candidate tracking.

## Technology Stack
- **Frontend Framework**: React.js
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Headless UI (@headlessui/react)
  - Lucide React (Icons)
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Notifications**: React Toastify
- **Build Tool**: Vite

## Project Structure
```
src/
├── assets/              # Static assets and images
├── Hrdashboard/        # HR-specific components and pages
│   ├── hr pages/       # HR dashboard pages
│   ├── contexts/       # HR-specific context providers
│   ├── Layout.jsx      # HR dashboard layout
│   └── Sidebars.jsx    # HR navigation sidebar
├── Landing/            # Landing page components
├── studentsComponents/ # Student/Job seeker components
├── styles/            # Global styles and CSS
├── utilits/           # Utility functions and helpers
├── App.jsx            # Main application component
└── main.jsx           # Application entry point
```

## Component Architecture

### HR Dashboard Components
1. **Layout Components**
   - `Layout.jsx`: Main HR dashboard layout
   - `Sidebars.jsx`: Navigation sidebar
   - `Header.jsx`: Dashboard header

2. **HR Pages**
   - `HrProfile.jsx`: HR profile management
   - `HrSchedule.jsx`: Interview scheduling
   - `PostJob.jsx`: Job posting interface
   - `Alljobbs.jsx`: Job listing and management
   - `Applications.jsx`: Application review
   - `AllApplicationsContent.jsx`: Comprehensive application view
   - `ApprovedStudents.jsx`: Approved candidates management
   - `StudentsOnHold.jsx`: Pending candidates
   - `Rejectedstudent.jsx`: Rejected candidates
   - `QuickHire.jsx`: Quick hiring interface
   - `DataRequest.jsx`: Data request management
   - `GetProfile.jsx`: Profile retrieval
   - `Hiring.jsx`: Hiring process management

### Student Components
1. **Dashboard Components**
   - `StudentDashboard.jsx`: Main student dashboard
   - `StudentProfile.jsx`: Student profile management
   - `SchedulePage.jsx`: Interview scheduling
   - `ApplyForJobs.jsx`: Job application interface
   - `JobApplied.jsx`: Applied jobs tracking
   - `JobDetails.jsx`: Detailed job view
   - `Supportchat.jsx`: Support chat interface

### Landing Page Components
1. **Main Components**
   - `MainPages.jsx`: Landing page layout
   - `Navbar.jsx`: Navigation bar
   - `Register.jsx`: Registration interface
   - `Login.jsx`: Login interface
   - `ForgotPassword.jsx`: Password recovery

## Routing Structure

### Public Routes
- `/`: Landing page
- `/register`: Registration page
- `/login`: Login page
- `/forgot-password`: Password recovery

### HR Dashboard Routes
- `/hire`: HR dashboard layout
  - `/hire/hrprofile`: HR profile
  - `/hire/schedule`: Schedule management
  - `/hire/post-job`: Job posting
  - `/hire/all-jobs`: Job listings
  - `/hire/applications`: Applications
  - `/hire/all-applications`: All applications
  - `/hire/approved-students`: Approved candidates
  - `/hire/students-on-hold`: Pending candidates
  - `/hire/rejected-students`: Rejected candidates
  - `/hire/quick-hire`: Quick hiring
  - `/hire/data-request`: Data requests
  - `/hire/get-profile`: Profile retrieval
  - `/hire/hiring`: Hiring process

### Student Routes
- `/profile`: Student profile
- `/schedule`: Interview schedule
- `/apply-for-jobs`: Job applications
- `/apply-for-jobs/job-details/:id`: Job details
- `/applied-jobs`: Applied jobs
- `/ChangePassword`: Password management

## Features and Functionality

### HR Features
1. **Job Management**
   - Post new job listings
   - Manage existing jobs
   - Track job applications
   - Review candidate profiles

2. **Candidate Management**
   - View and manage applications
   - Schedule interviews
   - Track candidate status
   - Quick hiring process

3. **Profile Management**
   - HR profile management
   - Company information
   - Hiring preferences

### Student Features
1. **Job Search**
   - Browse job listings
   - Apply for positions
   - Track applications
   - View job details

2. **Profile Management**
   - Create and update profile
   - Upload documents
   - Track application status

3. **Interview Management**
   - View interview schedule
   - Receive notifications
   - Track interview status

## UI/UX Design

### Design System
- **Colors**
  - Primary: #0F52BA (Blue)
  - Secondary: #F59E0B (Orange)
  - Background: White
  - Text: Gray-800

- **Typography**
  - Font Family: System UI
  - Headings: Bold
  - Body: Regular

- **Components**
  - Cards
  - Tables
  - Forms
  - Buttons
  - Navigation
  - Modals

### Responsive Design
- Mobile-first approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

## State Management

### Context Providers
1. **Notification Context**
   - Toast notifications
   - Alert messages
   - Status updates

2. **User Job Context**
   - Job application state
   - Application tracking
   - Job preferences

## API Integration

### Endpoints
1. **Authentication**
   - Login
   - Registration
   - Password recovery

2. **Job Management**
   - Job posting
   - Job listing
   - Application processing

3. **User Management**
   - Profile updates
   - Document upload
   - Status tracking

## Deployment

### Development
- Local development server: http://localhost:5174
- Hot module replacement enabled
- Development tools and debugging

### Production
- Build command: `npm run build`
- Output directory: `dist/`
- Static file serving
- Environment configuration

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```

### Environment Variables
- Create `.env` file
- Configure required environment variables
- Set API endpoints
- Configure authentication

## Best Practices
1. **Code Organization**
   - Component-based architecture
   - Modular file structure
   - Clear naming conventions

2. **Performance**
   - Code splitting
   - Lazy loading
   - Optimized assets

3. **Security**
   - Authentication
   - Authorization
   - Data validation

4. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Screen reader support

## Future Enhancements
1. **Planned Features**
   - Advanced search
   - Analytics dashboard
   - Integration with job boards
   - Enhanced reporting

2. **Technical Improvements**
   - Performance optimization
   - Enhanced security
   - Better error handling
   - Improved testing coverage 