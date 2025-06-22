import React, { useState, useEffect } from "react";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import AllApplicationsContent from "./AllApplicationsContent";
import ApprovedStudents from "./ApprovedStudents";
import StudentsOnHold from "./StudentsOnHold";
import RejectedStudents from "./Rejectedstudent";

const JobApplications = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const totalPages = 5;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handlePageChange = (direction) => {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const tabs = [
    { id: "all", label: "All Applications" },
    { id: "approved", label: "Approved" },
    { id: "hold", label: "On Hold" },
    { id: "rejected", label: "Rejected" },
  ];

  const Pagination = () => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 mr-2">
        {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => handlePageChange('prev')}
        disabled={currentPage === 1}
        className={`p-2 rounded-full ${
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
        className={`p-2 rounded-full ${
          currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100 hover:text-[#0F52BA]"
        }`}
        aria-label="Next job"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );

  // Render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "all":
        return <AllApplicationsContent />;
      case "approved":
        return <ApprovedStudents />;
      case "hold":
        return <StudentsOnHold />;
      case "rejected":
        return <RejectedStudents />;
      default:
        return <AllApplicationsContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="mb-6">
            {/* Header with pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center gap-3">
                <Briefcase className="text-[#0F52BA] h-5 w-5" />
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  Job Applications
                </h2>
              </div>
              {totalPages > 1 && <Pagination />}
            </div>
            
            {/* Tabs */}
            <div className="flex gap-2 sm:gap-4 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`pb-2 px-1 sm:px-3 whitespace-nowrap text-sm ${
                    activeTab === tab.id
                      ? "text-[#0F52BA] border-b-2 border-[#0F52BA] font-medium"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="overflow-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplications;