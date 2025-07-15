# STAFFING-PROJECT Frontend Documentation

## Table of Contents

1. Project Overview
2. Technology Stack
3. Project Structure
4. Component Architecture
5. Routing Structure
6. Features and Functionality
7. UI/UX Design
8. State Management
9. API Integration
10. Deployment
11. Getting Started
12. Best Practices
13. Future Enhancements

## Project Overview

STAFFING-PROJECT is a robust, scalable staffing and recruitment management system tailored to streamline and optimize the hiring lifecycle. It bridges HR professionals and job seekers by offering an intuitive platform for job postings, application tracking, candidate evaluation, and interview coordination.

## Technology Stack

* Frontend Framework: React.js (Functional Components + Hooks)
* Routing: React Router v6
* Styling: Tailwind CSS
* UI Components:

  * Headless UI (@headlessui/react) for accessibility-focused UI components
  * Lucide React for clean, customizable icons
* State Management: React Context API
* Form Handling: React Hook Form with validation
* Notifications: React Toastify
* Build Tool: Vite for blazing-fast builds and hot reloading

## Project Structure

src/
├── assets/              # Static assets and images
├── Hrdashboard/        # HR-specific components and pages
│   ├── hr pages/       # HR dashboard pages
│   ├── contexts/       # HR-specific context providers
│   ├── Layout.jsx      # HR dashboard layout
│   └── Sidebars.jsx    # HR navigation sidebar
├── Landing/            # Landing page components
├── studentsComponents/ # Student/Job seeker components
├── styles/             # Global styles and CSS
├── utilits/            # Utility functions and helpers
├── App.jsx             # Main application component
└── main.jsx            # Application entry point

## Component Architecture

### HR Dashboard Components

* Layout Components: Centralized structure for layout and navigation.
* Page Components: Modular HR functionalities (e.g., scheduling, job posting, application review).

### Student Components

* Dashboard, profile management, and application workflows encapsulated into reusable, context-aware components.

### Landing Components

* Public-facing components designed for authentication and marketing.

## Routing Structure

### Public Routes

* / : Landing page
* /register, /login, /forgot-password

### HR Dashboard Routes (/hire prefix)

Includes routes for managing jobs, candidates, scheduling, and company profile.

### Student Routes

Routes for profile, job applications, interview tracking, and support.

## Features and Functionality

### HR Side

* Post and manage job listings
* Review and filter applications
* Manage interview schedules
* Perform quick hires and handle candidate status

### Student Side

* Search and apply for jobs
* Manage profiles and upload resumes
* View interview schedules and notifications

## UI/UX Design

### Design System

* Colors: Blue (#0F52BA), Orange (#F59E0B), White, Gray-800
* Typography: System UI, bold headings, clean readability
* Components: Fully responsive cards, buttons, modals, tables, and navigation

### Recent Enhancements

* Responsive sidebars (adaptive based on device)
* Footer with branding and X logo for social
* Collapsible FAQs and job listings
* Optimized mobile layout for forms and profiles

## State Management

### Context Providers

* NotificationContext: Centralized toast handling
* UserJobContext: Job application state and preference management

## API Integration

REST API integration using async/await pattern:

* Auth: Login, register, password recovery
* Jobs: Post, list, filter, apply
* User: Profile update, resume upload, tracking

## Deployment

### Development

* Local: [http://localhost:5174](http://localhost:5174)
* Tools: HMR, Vite DevTools

### Production

* npm run build
* Deployment-ready dist/
* Environment-specific API configuration using .env

## Getting Started

### Prerequisites

* Node.js >= 14
* npm >= 6

### Installation Steps

```
git clone <repo-url>
cd staffing-project
npm install
npm run dev
```

### Environment Setup

```
.env
VITE_API_BASE_URL=https://api.example.com
```

## Best Practices

* Code: Modular, reusable, and scalable components
* Performance: Lazy loading, code splitting
* Security: Sanitized inputs, role-based routes
* Accessibility: ARIA tags, keyboard navigable components

## Future Enhancements

### New Features

* Job board integrations (e.g., LinkedIn)
* Advanced search filters
* Real-time chat module
* Analytics and reporting for HRs

### Technical Improvements

* SSR or SSG options (Next.js-like approach)
* Unit and integration testing (Jest + Testing Library)
* Web accessibility audit
* Enhanced error boundaries and fallback UIs
