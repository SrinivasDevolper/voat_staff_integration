import { useState, useEffect } from 'react';

export default function HRJobsDashboard() {
  // Mock data for all jobs
  const [allJobs, setAllJobs] = useState([
    { id: 1, title: "Frontend Developer", applications: 1500, created: "2023-05-15" },
    { id: 2, title: "Backend Engineer", applications: 2000, created: "2023-06-20" },
    { id: 3, title: "UX Designer", applications: 1800, created: "2023-04-10" },
    { id: 4, title: "Product Manager", applications: 2200, created: "2023-07-05" },
    { id: 5, title: "Data Scientist", applications: 0, created: "2023-08-12" },
    { id: 6, title: "DevOps Specialist", applications: 1900, created: "2023-07-18" },
    { id: 7, title: "HR Coordinator", applications: 2100, created: "2023-03-22" },
  ]);

  // State for search
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(allJobs);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  // Analytics data
  const [analytics, setAnalytics] = useState({
    totalJobs: 0,
    totalApplications: 0
  });

  // Filter jobs whenever search term changes
  useEffect(() => {
    let results = allJobs;
    
    // Apply search term
    if (searchTerm) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredJobs(results);
    setCurrentPage(1); // Reset to first page when search changes
    
    // Update analytics
    updateAnalytics(results);
  }, [allJobs, searchTerm]);

  // Update analytics data
  const updateAnalytics = (jobs) => {
    const totalJobs = jobs.length;
    const totalApplications = jobs.reduce((sum, job) => sum + job.applications, 0);
    
    setAnalytics({
      totalJobs,
      totalApplications
    });
  };

  // Get current jobs for pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="p-6 min-h-[calc(100vh-48px)]">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Box - Job Listings */}
        <div className="bg-white rounded-xl p-6 flex-1">
          {/* Header with search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Job Listings</h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-4 mb-6">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <div key={job.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 rounded-xl p-5 hover:shadow-sm transition-all border border-gray-100">
                  {/* Job Info */}
                  <div className="w-full sm:w-[70%] mb-3 sm:mb-0">
                    <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <span>Posted: {job.created}</span>
                    </div>
                  </div>
                  
                  {/* Applications and Action */}
                  <div className="w-full sm:w-[30%] flex flex-col sm:items-end space-y-2">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {job.applications.toLocaleString()} Application{job.applications !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                      View Applicants
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No jobs found matching your search</p>
                <button 
                  onClick={() => setSearchTerm("")}
                  className="mt-3 text-blue-600 hover:text-blue-800"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredJobs.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <div className="text-sm text-gray-500">
                Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Box - Analytics */}
        <div className="bg-white rounded-xl p-6 w-full lg:w-[30%] h-fit lg:sticky lg:top-6 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Job Analytics</h2>
          
          {/* Analytics Cards */}
          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Jobs</p>
              <p className="text-2xl font-bold text-blue-800">{analytics.totalJobs}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Total Applications</p>
              <p className="text-2xl font-bold text-purple-800">{analytics.totalApplications.toLocaleString()}</p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-3">
            {/* Removed View All Applicants and Manage Reminders buttons */}
          </div>
        </div>
      </div>
    </div>
  );
}