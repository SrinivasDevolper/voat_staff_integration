import React, { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserJobContext } from "../contexts/UserJobContext";
import JobCard from "./jobView/JobCard";

import Header from "./header/Header";

const jobsData = [
  {
    id: "GIIR2AD013B8",
    title: "Front End/React JS Developer (Offline Drive)",
    location: "Hyderabad",
    salary: "₹2.5L",
    openings: 2,
    date: "5 Apr 25, 10:00 AM",
    status: "open",
    eligibility: "3+ years of React experience",
  },
  {
    id: "TwB01729525",
    title: "Web Developer",
    location: "Kerala",
    salary: "₹2.5L - ₹4L",
    openings: 1,
    date: "5 Apr 25, 10:30 AM",
    status: "open",
    eligibility: "HTML, CSS, JavaScript proficiency",
  },
  {
    id: "e9A56503A381",
    title: "Software Development Engineer in Testing(QA Interns)",
    location: "Bengaluru",
    salary: "₹8L",
    openings: 3,
    date: "5 Apr 25, 02:30 PM",
    status: "open",
    eligibility: "Testing knowledge, programming basics",
  },
  {
    id: "PREV123456",
    title: "Backend Developer",
    location: "Remote",
    salary: "₹5L",
    openings: 0,
    date: "1 Mar 25, 09:00 AM",
    status: "previous",
    eligibility: "Node.js, MongoDB experience",
  },
];

const JobApplied = () => {
  const { appliedJobs } = useUserJobContext();
  const [activeTab, setActiveTab] = useState("applied");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [visibleJobs, setVisibleJobs] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let jobsToShow = [];
    switch (activeTab) {
      case "applied":
        // Set status for all applied jobs
        jobsToShow = appliedJobs.map(job => ({
          ...job,
          status: "applied"  // Add status for applied jobs
        }));
        break;
      case "hiring":
        jobsToShow = jobsData.filter(job => job.status === "hiring").map(job => ({
          ...job,
          status: "hiring"  // Make sure hiring jobs have status
        }));
        break;
      // case "previous":
      //   jobsToShow = jobsData.filter(job => job.status === "previous");
      //   break;
      // default:
      //   jobsToShow = [];
    }
    setVisibleJobs(jobsToShow);
  }, [activeTab, appliedJobs]);

  const handleCheckEligibility = (job) => {
    console.log(`Checking eligibility for job: ${job.title}`);
  };

  const tabs = [
    { id: "applied", label: "Applied" },
    { id: "hiring", label: "Hiring Done" },
    // { id: "previous", label: "Previous Jobs" },
  ];

  return (
    <div className="flex">
      <Header />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-24 max-w-[1800px] mx-auto p-2 h-screen flex flex-col">
        <div className="min-h-screen bg-[#F5F7FF]">
          <div className="container mx-auto">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-none">
              <div className="mb-4 sm:mb-6">
                <div className="mb-3 sm:mb-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
                    Jobs
                  </h2>
                </div>

                <div className="flex gap-2 sm:gap-4 border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto pb-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`pb-2 px-2 sm:px-3 whitespace-nowrap text-xs sm:text-sm ${
                        activeTab === tab.id
                          ? "text-[#0F52BA] border-b-2 border-[#0F52BA] font-medium"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {visibleJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {visibleJobs.map((job) => (
                        <div key={job.id} className="shadow-none">
                          <JobCard
                            job={job}
                            onCheckEligibility={handleCheckEligibility}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-8">
                      {activeTab === "applied" ? (
                        <div className="flex flex-col items-center">
                          <Briefcase
                            size={isMobile ? 36 : 48}
                            className="text-gray-300 mb-3 sm:mb-4"
                          />
                          <h3 className="text-base sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
                            You haven't applied for any jobs yet
                          </h3>
                          <p className="text-gray-500 text-sm sm:text-base mb-3 sm:mb-4 max-w-md mx-auto">
                            Browse open positions and apply for jobs that match
                            your skills
                          </p>
                          <Link
                            to="/apply-for-jobs"
                            className="bg-[#0F52BA] text-white px-4 sm:px-6 py-1 sm:py-2 rounded-md hover:bg-[#0d469d] transition-colors flex items-center gap-2 text-sm sm:text-base"
                          >
                            <Briefcase size={14} />
                            Browse Jobs
                          </Link>
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm sm:text-base">
                          No jobs found in this category
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplied;