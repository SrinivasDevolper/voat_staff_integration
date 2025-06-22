import React, { useState, useEffect, useRef } from "react";
import Header from "./header/Header";
import {
  Search,
  MapPin,
  ChevronDown,
  X,
  Bookmark,
  Clock,
  Briefcase,
} from "lucide-react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { mockJobs } from "../../utilits/mockJobs";
import { useUserJobContext } from "../contexts/UserJobContext";
import ViewJob from "./sideBar/Viewjob";
import { motion, AnimatePresence } from "framer-motion";

function ApplyForJobs() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get context
  const {
    jobs,
    setJobs,
    savedJobs,
    setSavedJobs,
    toggleSaveJob,
    filteredJobs,
    setFilteredJobs,
    searchRole,
    setSearchRole,
    searchExperience,
    setSearchExperience,
    searchLocation,
    setSearchLocation,
    datePosted,
    setDatePosted,
    urgentOnly,
    setUrgentOnly,
    activeFilters,
    setActiveFilters,
    currentPage,
    setCurrentPage,
    getDaysAgo,
    selectedJob,
    setSelectedJob,
  } = useUserJobContext();

  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const locationRef = useRef(null);
  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [showJobSuggestions, setShowJobSuggestions] = useState(false);
  const searchRef = useRef(null);

  const JOBS_PER_PAGE = 10;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset state when component mounts or location changes
  useEffect(() => {
    const resetState = () => {
      setSearchRole("");
      setSearchExperience("");
      setSearchLocation("");
      setDatePosted("All");
      setUrgentOnly(false);
      setActiveFilters([]);
      setCurrentPage(1);
      setSelectedJob(null);
    };

    // Only reset if we're coming from a different route
    if (!location.pathname.includes('/job-details/')) {
      resetState();
    }
  }, [location.pathname]);

  // Load mock jobs data
  useEffect(() => {
    const loadJobs = async () => {
      try {
    setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        const jobsData = mockJobs || [];
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (error) {
        console.error("Error loading jobs:", error);
      } finally {
      setIsLoading(false);
      }
    };

    loadJobs();
  }, [setJobs, setFilteredJobs]);

  // Filter jobs based on search criteria
  useEffect(() => {
    try {
      if (!jobs) return;
      
    let results = [...jobs];

    // Filter by role/company
    if (searchRole) {
      const searchTerm = searchRole.toLowerCase();
      results = results.filter(
        (job) =>
            job?.title?.toLowerCase().includes(searchTerm) ||
            job?.company?.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by experience
    if (searchExperience) {
      results = results.filter((job) =>
          job?.experience?.toLowerCase().includes(searchExperience.toLowerCase())
      );
    }

    // Filter by location
    if (searchLocation) {
      results = results.filter((job) =>
          job?.location?.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }

    // Filter by date posted
    const now = new Date();
    if (datePosted !== "All") {
      const days = {
        "Last 24 hours": 1,
        "Last 3 days": 3,
        "Last 7 days": 7,
      }[datePosted];

      results = results.filter((job) => {
          if (!job?.postedDate) return false;
        const jobDate = new Date(job.postedDate);
        const diffTime = Math.abs(now - jobDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days;
      });
    }

    // Filter urgent jobs
    if (urgentOnly) {
        results = results.filter((job) => job?.isUrgent);
    }

    setFilteredJobs(results);
    setCurrentPage(1);
    } catch (error) {
      console.error("Error filtering jobs:", error);
    }
  }, [
    jobs,
    searchRole,
    searchExperience,
    searchLocation,
    datePosted,
    urgentOnly,
    setFilteredJobs,
    setCurrentPage,
  ]);

  // Common locations in India
  const commonLocations = [
    // Major IT Hubs
    "Bangalore", "Hyderabad", "Pune", "Chennai", "Gurgaon", "Noida",
    // Tech Parks and Special Economic Zones
    "Electronic City, Bangalore", "HITEC City, Hyderabad", "DLF Cyber City, Gurgaon",
    "Mindspace, Hyderabad", "SEZ, Pune", "DLF IT Park, Chennai",
    // Emerging Tech Hubs
    "Bhubaneswar", "Kochi", "Ahmedabad", "Chandigarh", "Indore", "Coimbatore",
    // Traditional IT Centers
    "Mumbai", "Delhi", "Kolkata", "Jaipur", "Lucknow", "Nagpur",
    // Upcoming Tech Cities
    "Vadodara", "Vizag", "Mysore", "Trivandrum", "Guwahati", "Dehradun",
    // Tech Clusters
    "Whitefield, Bangalore", "Gachibowli, Hyderabad", "Hinjewadi, Pune",
    "Tidel Park, Chennai", "Cyber City, Gurgaon", "Noida Sector 62",
    // Remote Work Options
    "Remote", "Work from Home", "Hybrid"
  ];

  const handleLocationInput = (e) => {
    const value = e.target.value;
    setSearchLocation(value);
    
    if (value.trim()) {
      const filtered = commonLocations.filter(location =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setLocationSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (location) => {
    setSearchLocation(location);
    setShowSuggestions(false);
  };

  // Common job titles and roles
  const commonJobs = [
    "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "React Developer", "Node.js Developer", "Python Developer", "Java Developer",
    "DevOps Engineer", "Data Scientist", "Machine Learning Engineer", "UI/UX Designer",
    "Product Manager", "Project Manager", "Business Analyst", "Quality Assurance",
    "Mobile Developer", "iOS Developer", "Android Developer", "Cloud Engineer",
    "System Administrator", "Network Engineer", "Security Engineer", "Database Administrator",
    "Technical Lead", "Solution Architect", "Scrum Master", "Agile Coach"
  ];

  const handleJobSearch = (e) => {
    const value = e.target.value;
    setSearchRole(value);
    
    if (value.trim()) {
      const filtered = commonJobs.filter(job =>
        job.toLowerCase().includes(value.toLowerCase())
      );
      setJobSuggestions(filtered);
      setShowJobSuggestions(true);
    } else {
      setJobSuggestions([]);
      setShowJobSuggestions(false);
    }
  };

  const handleJobSelect = (job) => {
    setSearchRole(job);
    setShowJobSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowJobSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper functions
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchRole("");
    setSearchExperience("");
    setSearchLocation("");
  };

  const addFilter = (filter) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const removeFilter = (filterToRemove) => {
    setActiveFilters(
      activeFilters.filter((filter) => filter !== filterToRemove)
    );
  };

  const clearAllFilters = () => {
    setSearchRole("");
    setSearchExperience("");
    setSearchLocation("");
    setActiveFilters([]);
    setDatePosted("All");
    setUrgentOnly(false);
  };

  const handleJobClick = (job) => {
    try {
      setSelectedJob(job);
      navigate(`/apply-for-jobs/job-details/${job.id}`);
    } catch (error) {
      console.error("Error navigating to job details:", error);
    }
  };

  // Pagination
  const indexOfLastJob = currentPage * JOBS_PER_PAGE;
  const indexOfFirstJob = indexOfLastJob - JOBS_PER_PAGE;
  const currentJobs = (filteredJobs || []).slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil((filteredJobs || []).length / JOBS_PER_PAGE);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const clearSearch = (field) => {
    switch(field) {
      case 'search':
        setSearchRole("");
        break;
      case 'location':
        setSearchLocation("");
        break;
      case 'experience':
        setSearchExperience("");
        break;
      default:
        break;
    }
  };

  // Render job details view
  if (selectedJob) {
    return <Outlet />;
  }

  // Render job listing view
  return (
    <div className="flex">
      <Header />
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-20 max-w-[1800px] mx-auto p-2 h-screen flex flex-col">
        <div className="flex flex-col h-screen">
          {/* Search header */}
          <div className="bg-white p-4 shadow-sm border-b border-gray-200">
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex-1 relative" ref={searchRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={14} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchRole}
                  onChange={handleJobSearch}
                  className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search jobs..."
                  style={{ paddingLeft: "2.5rem" }}
                />
                {searchRole && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      clearSearch('search');
                      setShowJobSuggestions(false);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
                {showJobSuggestions && jobSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {jobSuggestions.map((job, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleJobSelect(job)}
                      >
                        {job}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 relative" ref={locationRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={14} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={handleLocationInput}
                  className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Location"
                  style={{ paddingLeft: "2.5rem" }}
                />
                {searchLocation && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      clearSearch('location');
                      setShowSuggestions(false);
                    }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
                {showSuggestions && locationSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {locationSuggestions.map((location, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => handleLocationSelect(location)}
                      >
                        {location}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase size={14} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchExperience}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value) || value === '') {
                      setSearchExperience(value);
                    }
                  }}
                  onKeyPress={(e) => {
                    if (!/[0-9.]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Experience (in years)"
                  style={{ paddingLeft: "2.5rem" }}
                />
                {searchExperience && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      clearSearch('experience');
                  }}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onSubmit={(e) => e.preventDefault()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Search jobs
              </button>
            </form>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {!isMobile && (
              <div className="w-64 bg-white p-4 border-r border-gray-200 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-700">Date posted</h3>
                      <ChevronDown size={16} className="text-gray-500" />
                    </div>
                    <div className="space-y-2">
                      {[
                        "All",
                        "Last 24 hours",
                        "Last 3 days",
                        "Last 7 days",
                      ].map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="date"
                            checked={datePosted === option}
                            onChange={() => setDatePosted(option)}
                            className="accent-blue-600"
                          />
                          <span className="text-sm text-gray-700">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-gray-700">
                        Urgently hiring
                      </h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={urgentOnly}
                          onChange={() => setUrgentOnly(!urgentOnly)}
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-sm text-gray-600">
                    Showing {indexOfFirstJob + 1} -{" "}
                    {Math.min(indexOfLastJob, (filteredJobs || []).length)} of{" "}
                    {(filteredJobs || []).length} job
                    {(filteredJobs || []).length !== 1 ? "s" : ""} based on your filter
                  </span>
                </div>

                {(activeFilters.length > 0 ||
                  searchRole ||
                  searchLocation ||
                  datePosted !== "All" ||
                  urgentOnly) && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Filters (
                      {activeFilters.length +
                        (searchRole ? 1 : 0) +
                        (searchLocation ? 1 : 0) +
                        (datePosted !== "All" ? 1 : 0) +
                        (urgentOnly ? 1 : 0)}
                      )
                    </span>

                    {searchRole && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        {searchRole}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            clearSearch('search');
                          }}
                          className="text-blue-800 hover:text-blue-900"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    )}

                    {searchLocation && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        {searchLocation}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            clearSearch('location');
                          }}
                          className="text-blue-800 hover:text-blue-900"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    )}

                    {activeFilters.map((filter) => (
                      <span
                        key={filter}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        {filter}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            removeFilter(filter);
                          }}
                          className="text-blue-800 hover:text-blue-900"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}

                    {datePosted !== "All" && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        {datePosted}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setDatePosted("All");
                          }}
                          className="text-blue-800 hover:text-blue-900"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    )}

                    {urgentOnly && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        Urgent
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setUrgentOnly(false);
                          }}
                          className="text-blue-800 hover:text-blue-900"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    )}

                    <button
                      onClick={clearAllFilters}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>

              {/* Job listings */}
              {isLoading ? (
                <motion.div 
                  className="flex justify-center items-center h-64"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </motion.div>
              ) : (filteredJobs || []).length === 0 ? (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-lg font-medium text-gray-700">
                    No jobs found
                  </h3>
                  <p className="text-gray-500 mt-2">
                    Try adjusting your search or filters
                  </p>
                </motion.div>
              ) : (
                <>
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AnimatePresence>
                      {currentJobs.map((job, index) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.4, 
                            delay: index * 0.1,
                            ease: "easeOut"
                          }}
                          whileHover={{ 
                            y: -4,
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                            transition: { duration: 0.2 }
                          }}
                        >
                          <Link
                            to={`/apply-for-jobs/job-details/${job.id}`}
                            className="bg-white rounded-lg p-4 inline-block w-full md:p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 cursor-pointer relative"
                            onClick={() => handleJobClick(job)}
                          >
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  {job.isUrgent && (
                                    <motion.span 
                                      className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full flex items-center gap-1"
                                      whileHover={{ scale: 1.05 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      🔥 Urgently hiring
                                    </motion.span>
                                  )}
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock size={12} />
                                    {getDaysAgo(job.postedDate)}
                                  </span>
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold mb-1 text-gray-800">
                                  {job.title}
                                </h3>
                                <p className="text-gray-600 mb-3">{job.company}</p>
                                <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 md:gap-4 text-gray-600 mb-3">
                                  <div className="flex items-center gap-1">
                                    <MapPin size={16} className="text-gray-500" />
                                    <span>{job.location}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Briefcase
                                      size={16}
                                      className="text-gray-500"
                                    />
                                    <span>{job.salary}</span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {[job.workMode, job.type, job.experience].map((tag, tagIndex) => (
                                    <motion.span 
                                      key={tagIndex}
                                      className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                                      whileHover={{ scale: 1.05, backgroundColor: "#e5e7eb" }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      {tag}
                                    </motion.span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex flex-row md:flex-col items-center md:items-end gap-2 self-end md:self-auto">
                                {job.isNew && (
                                  <motion.span 
                                    className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    New
                                  </motion.span>
                                )}
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                              <motion.button
                                onClick={() => navigate(`/job/${job._id}`)}
                                className="bg-blue-600 text-white text-xs sm:text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                View Job
                              </motion.button>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div 
                      className="flex justify-center items-center mt-8 mb-28 gap-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <motion.button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-blue-600 hover:bg-blue-50"
                        }`}
                        whileHover={currentPage !== 1 ? { scale: 1.05, y: -1 } : {}}
                        whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                        transition={{ duration: 0.2 }}
                      >
                        Previous
                      </motion.button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (number) => (
                          <motion.button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`px-3 py-1 rounded-md ${
                              currentPage === number
                                ? "bg-blue-600 text-white"
                                : "bg-white text-blue-600 hover:bg-blue-50"
                            }`}
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            {number}
                          </motion.button>
                        )
                      )}

                      <motion.button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-blue-600 hover:bg-blue-50"
                        }`}
                        whileHover={currentPage !== totalPages ? { scale: 1.05, y: -1 } : {}}
                        whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                        transition={{ duration: 0.2 }}
                      >
                        Next
                      </motion.button>
                    </motion.div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyForJobs;