import React, { useState, useEffect } from "react";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AllApplicationsContent from "./AllApplicationsContent";
import ApprovedStudents from "./ApprovedStudents";
import StudentsOnHold from "./StudentsOnHold";
import RejectedStudents from "./Rejectedstudent";

const JobApplications = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  
  const jobs = [
    { id: "12345", title: "Senior Frontend Developer" },
    { id: "12346", title: "Backend Engineer" },
    { id: "12347", title: "UX Designer" },
    { id: "12348", title: "Product Manager" },
    { id: "12349", title: "DevOps Specialist" },
  ];
  
  const totalPages = jobs.length;
  const [currentJob, setCurrentJob] = useState(jobs[0]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setCurrentJob(jobs[currentPage - 1]);
  }, [currentPage]);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
    setCurrentJob(jobs[0]);
  };

  const handlePageChange = (newDirection) => {
    setDirection(newDirection === 'next' ? 1 : -1);
    const newPage = newDirection === 'next' ? currentPage + 1 : currentPage - 1;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const Pagination = () => (
    <div className="flex items-center gap-2 sm:gap-4">
      <span className="text-sm text-gray-600 hidden sm:inline">
        Job {currentPage} of {totalPages}
      </span>
      <div className="flex gap-1">
        <button
          onClick={() => handlePageChange('prev')}
          disabled={currentPage === 1}
          className={`p-2 rounded-full transition-colors ${
            currentPage === 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 hover:text-[#0F52BA]"
          }`}
          aria-label="Previous job"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => handlePageChange('next')}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-full transition-colors ${
            currentPage === totalPages
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100 hover:text-[#0F52BA]"
          }`}
          aria-label="Next job"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  const tabs = [
    { id: "all", label: "All Applications" },
    { id: "approved", label: "Approved" },
    { id: "hold", label: "On Hold" },
    { id: "rejected", label: "Rejected" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "all":
        return <AllApplicationsContent 
                 isMobile={isMobile} 
                 jobTitle={currentJob.title} 
                 jobId={currentJob.id}
                 currentPage={currentPage}
               />;
      case "approved":
        return <ApprovedStudents 
                 isMobile={isMobile} 
                 jobTitle={currentJob.title} 
                 jobId={currentJob.id}
                 currentPage={currentPage}
               />;
      case "hold":
        return <StudentsOnHold 
                 isMobile={isMobile} 
                 jobTitle={currentJob.title} 
                 jobId={currentJob.id}
                 currentPage={currentPage}
               />;
      case "rejected":
        return <RejectedStudents 
                 isMobile={isMobile} 
                 jobTitle={currentJob.title} 
                 jobId={currentJob.id}
                 currentPage={currentPage}
               />;
      default:
        return <AllApplicationsContent 
                 isMobile={isMobile} 
                 jobTitle={currentJob.title} 
                 jobId={currentJob.id}
                 currentPage={currentPage}
               />;
    }
  };

  // Animation variants
  const pageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    })
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6">
            {/* Header with job title and pagination (hidden on mobile) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Briefcase className="text-[#0F52BA] h-5 w-5" />
                </div>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentJob.id}
                    custom={direction}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    variants={pageVariants}
                  >
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                      Applications for: {currentJob.title}
                    </h1>
                    <p className="text-sm text-gray-500">Job ID: {currentJob.id}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Show pagination only on desktop */}
              {!isMobile && totalPages > 1 && <Pagination />}
            </div>
            
            {/* Tabs */}
            <div className="relative mb-6">
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
              <div className="flex space-x-8 overflow-x-auto pb-1 hide-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`relative pb-3 px-1 whitespace-nowrap text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-[#0F52BA]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F52BA]"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content area with animation */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={`${currentJob.id}-${activeTab}`}
                custom={direction}
                initial="enter"
                animate="center"
                exit="exit"
                variants={pageVariants}
                className="overflow-x-auto"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile floating pagination (shown only on mobile) */}
      {isMobile && totalPages > 1 && (
        <div className="fixed bottom-4 right-4 sm:hidden">
          <div className="bg-white rounded-full shadow-lg p-2 flex items-center gap-2">
            <button
              onClick={() => handlePageChange('prev')}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${
                currentPage === 1 ? "text-gray-300" : "text-[#0F52BA]"
              }`}
              aria-label="Previous job"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-600 px-1">
              {currentPage}/{totalPages}
            </span>
            <button
              onClick={() => handlePageChange('next')}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${
                currentPage === totalPages ? "text-gray-300" : "text-[#0F52BA]"
              }`}
              aria-label="Next job"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplications;