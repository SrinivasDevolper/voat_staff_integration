import { createBrowserRouter } from "react-router-dom";

// Navigate for redirection
import { Navigate } from 'react-router-dom';

import App from "../src/App";
import Layout from "../Layout";
import Profile from "../pages/hrProfile";
import HRSchedulePage from "../pages/hrSchedule";
import PostJob from "../pages/PostJob";
import AllJobs from "../pages/Alljobbs";
import Applications from "../pages/Applications";
import AllApplicationsContent from "../hr pages/AllApplicationsContent";
import ApprovedStudents from "../pages/ApprovedStudents";
import StudentsOnHold from "../pages/StudentsOnHold";
import RejectedStudents from "../hr pages/Rejectedstudent";
import QuickHire from "../pages/QuickHire";
import DataRequest from "../pages/DataRequest";
import GetProfile from "../pages/GetProfile";

const router = createBrowserRouter([
  {
    path: "/hire",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/hire/post-job" replace />
      },
      {
        path: "hrprofile",
        element: <Profile />
      },
      {
        path: "schedule",
        element: <HRSchedulePage />
      },
      {
        path: "post-job",
        element: <PostJob />
      },
      {
        path: "all-jobs",
        element: <AllJobs />
      },
      {
        path: "applications",
        element: <Applications />,
        children: [
          {
            index: true,
            element: <Navigate to="all" replace />
          },
          {
            path: "all",
            element: <AllApplicationsContent />
          },
          {
            path: "approved",
            element: <ApprovedStudents />
          },
          {
            path: "hold",
            element: <StudentsOnHold />
          },
          {
            path: "rejected",
            element: <RejectedStudents />
          }
        ]
      },
      {
        path: "approved-students",
        element: <ApprovedStudents />
      },
      {
        path: "students-on-hold",
        element: <StudentsOnHold />
      },
      {
        path: "quick-hire",
        element: <QuickHire />
      },
      {
        path: "data-request",
        element: <DataRequest />
      },
      {
        path: "get-profile",
        element: <GetProfile/>
      }
    ]
  }
]);

export default Router;