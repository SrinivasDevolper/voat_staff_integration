import { Routes, Route, useLocation } from "react-router-dom";
import Register from "./Landing/components/Register";
import Login from "./Landing/components/Login";
import MainPages from "./Landing/components/MainPages";
import StudentDashboard from "./studentsComponents/components/StudentDashboard";
import StudentProfile from "./studentsComponents/components/StudentProfile";
import SchedulePage from "./studentsComponents/components/SchedulePage";
import ApplyForJobs from "./studentsComponents/components/ApplyForJobs";
import JobDetails from "./studentsComponents/components/jobView/JobDetails";
import JobApplied from "./studentsComponents/components/JobApplied";
import SupportChat from "./studentsComponents/components/Supportchat";
import Layout from "./Hrdashboard/Layout";
import HRSchedulePage from "./Hrdashboard/hr pages/HrSchedule";
import HRProfile from "./Hrdashboard/hr pages/HrProfile";
import PostJob from "./Hrdashboard/hr pages/PostJob";
import AllJobs from "./Hrdashboard/hr pages/Alljobbs";
import Applications from "./Hrdashboard/hr pages/Applications";
import AllApplicationsContent from "./Hrdashboard/hr pages/AllApplicationsContent";
import ApprovedStudents from "./Hrdashboard/hr pages/ApprovedStudents";
import StudentsOnHold from "./Hrdashboard/hr pages/StudentsOnHold";
import RejectedStudents from "./Hrdashboard/hr pages/Rejectedstudent";
import QuickHire from "./Hrdashboard/hr pages/QuickHire";
import DataRequest from "./Hrdashboard/hr pages/DataRequest";
import GetProfile from "./Hrdashboard/hr pages/GetProfile";
import Hiring from "./Hrdashboard/hr pages/Hiring";
import ForgotPassword from "./Landing/components/ForgotPassword";
import Navbar from "./Landing/components/Navbar";
import ChangePassword from "./studentsComponents/components/ChangePassword";
import CustomCursor from "./components/CustomCursor";
import StudentEmailOtp from "./studentsComponents/components/StudentEmailOtp";
import { Toaster } from 'react-hot-toast';

import "./App.css";

function StudentLayout({ children }) {
  return (
    <>
      {children}
      <SupportChat />
    </>
  );
}

function App() {
  const location = useLocation();

  // Check if the current path is "/"
  const isMainPage = location.pathname === "/";

  return (
    <>
      {/* Custom Cursor only on main landing page */}
      {isMainPage && <CustomCursor />}
      {/* ✅ Padding only for main page */}
      {isMainPage && <div className="pt-1" />}

      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainPages />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* HR Dashboard Routes */}
        <Route path="/hire" element={<Layout />}>
          <Route index element={<HRProfile />} />
          <Route path="hrprofile" element={<HRProfile />} />
          <Route path="schedule" element={<HRSchedulePage />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="all-jobs" element={<AllJobs />} />
          <Route path="applications" element={<Applications />} />
          <Route path="all-applications" element={<AllApplicationsContent />} />
          <Route path="approved-students" element={<ApprovedStudents />} />
          <Route path="students-on-hold" element={<StudentsOnHold />} />
          <Route path="rejected-students" element={<RejectedStudents />} />
          <Route path="quick-hire" element={<QuickHire />} />
          <Route path="data-request" element={<DataRequest />} />
          <Route path="get-profile" element={<GetProfile />} />
          <Route path="hiring" element={<Hiring />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="/profile"
          element={
            <StudentLayout>
              <StudentProfile />
            </StudentLayout>
          }
        />
        <Route
          path="/verify-email-otp"
          element={
            <StudentLayout>
              <StudentEmailOtp />
            </StudentLayout>
          }
        />
        <Route
          path="/ChangePassword"
          element={
            <StudentLayout>
              <ChangePassword />
            </StudentLayout>
          }
        />
        <Route
          path="/schedule"
          element={
            <StudentLayout>
              <SchedulePage />
            </StudentLayout>
          }
        />
        <Route
          path="/apply-for-jobs"
          element={
            <StudentLayout>
              <ApplyForJobs />
            </StudentLayout>
          }
        />
        <Route
          path="/apply-for-jobs/job-details/:id"
          element={
            <StudentLayout>
              <JobDetails />
            </StudentLayout>
          }
        />
        <Route
          path="/applied-jobs"
          element={
            <StudentLayout>
              <JobApplied />
            </StudentLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
