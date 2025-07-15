import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockJobs } from '../../utilits/mockJobs';
import { Briefcase, Search, MapPin, Clock, ArrowLeft, Building, Code, Map, ArrowRight } from 'lucide-react';

const LogoOnlyNavbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F52BA] shadow-md py-3 flex items-center justify-between px-6">
    <Link to="/" className="inline-flex items-center text-white hover:text-blue-200 font-semibold transition-colors">
      <ArrowLeft size={20} className="mr-2" />
      Back to Home
    </Link>
    <Link to="/" className="flex-1 flex justify-center">
      <img src="/MANAHIRE.png" alt="MANAHIRE Logo" className="w-44 mx-auto" />
    </Link>
    <Link to="/login" className="inline-flex items-center text-white hover:text-blue-200 font-semibold transition-colors">
      Login to Apply
      <ArrowRight size={20} className="ml-2" />
    </Link>
  </nav>
);

const JobSearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [experience, setExperience] = useState(searchParams.get('experience') || '');

  const [jobSuggestions, setJobSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showJobSuggestions, setShowJobSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const allJobKeywords = useMemo(() => {
    const keywordSet = new Set();
    mockJobs.forEach(job => {
      keywordSet.add(job.title);
      keywordSet.add(job.company);
      job.skills.split(',').forEach(skill => keywordSet.add(skill.trim()));
    });
    return Array.from(keywordSet);
  }, []);

  const allLocations = useMemo(() => {
    const locationSet = new Set();
    mockJobs.forEach(job => {
      locationSet.add(job.location);
    });
    return Array.from(locationSet);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowJobSuggestions(false);
        setShowLocationSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const filteredJobs = useMemo(() => {
    const q = (searchParams.get('q') || '').toLowerCase();
    const loc = (searchParams.get('location') || '').toLowerCase();
    const exp = (searchParams.get('experience') || '').toLowerCase();
    
    if (!q && !loc && !exp) {
        return mockJobs;
    }

    return mockJobs.filter(job => {
      const queryMatch = job.title.toLowerCase().includes(q) ||
                         job.company.toLowerCase().includes(q) ||
                         job.skills.toLowerCase().includes(q);
      const locationMatch = job.location.toLowerCase().includes(loc);
      const expMatch = job.experience.toLowerCase().includes(exp);
      return queryMatch && locationMatch && expMatch;
    });
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery, location, experience });
  };
  
  const handleJobQueryChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 1) {
      const suggestions = allJobKeywords.filter(k => k.toLowerCase().includes(value.toLowerCase()));
      setJobSuggestions(suggestions.slice(0, 5)); // Limit suggestions
      setShowJobSuggestions(true);
    } else {
      setShowJobSuggestions(false);
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    if (value.length > 1) {
      const suggestions = allLocations.filter(l => l.toLowerCase().includes(value.toLowerCase()));
      setLocationSuggestions(suggestions.slice(0, 5)); // Limit suggestions
      setShowLocationSuggestions(true);
    } else {
      setShowLocationSuggestions(false);
    }
  };

  const handleSuggestionClick = (setter, suggestion, hideSetter) => {
    setter(suggestion);
    hideSetter(false);
  };

  const hasSearched = searchParams.get('q') !== null || searchParams.get('location') !== null || searchParams.get('experience') !== null;

  return (
    <>
      <LogoOnlyNavbar />
      <div className="job-search-page-container min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            className="bg-white/70 backdrop-blur-sm p-6 sm:p-8 shadow-lg rounded-2xl mb-12 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Find Your Next Opportunity</h1>
            <form ref={wrapperRef} onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
               <div className="flex-1 relative w-full">
                <input
                  type="text"
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={handleJobQueryChange}
                  onFocus={() => searchQuery && setShowJobSuggestions(true)}
                />
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <AnimatePresence>
                  {showJobSuggestions && jobSuggestions.length > 0 && (
                    <motion.ul 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg"
                    >
                      {jobSuggestions.map((s, i) => (
                        <li 
                          key={i} 
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSuggestionClick(setSearchQuery, s, setShowJobSuggestions)}
                        >
                          {s}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex-1 relative w-full">
                <input
                  type="text"
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  placeholder="Experience level"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
                 <Briefcase className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1 relative w-full">
                <input
                  type="text"
                  className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  placeholder="Location"
                  value={location}
                  onChange={handleLocationChange}
                  onFocus={() => location && setShowLocationSuggestions(true)}
                />
                <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <AnimatePresence>
                  {showLocationSuggestions && locationSuggestions.length > 0 && (
                    <motion.ul 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg"
                    >
                      {locationSuggestions.map((s, i) => (
                        <li 
                          key={i} 
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() => handleSuggestionClick(setLocation, s, setShowLocationSuggestions)}
                        >
                          {s}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
              <motion.button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all w-full md:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Search
              </motion.button>
            </form>
          </motion.div>

          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
          >
              <AnimatePresence>
                  {hasSearched ? (
                      filteredJobs.length > 0 ? (
                          <>
                              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                  {filteredJobs.length} Job Result{filteredJobs.length > 1 && 's'} Found
                              </h2>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                  {filteredJobs.map((job, index) => (
                                  <motion.div 
                                      key={job.id}
                                      className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-200/80"
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.4, delay: index * 0.05 }}
                                      whileHover={{ y: -8, scale: 1.03 }}
                                  >
                                      <div className="flex justify-between items-start mb-4">
                                          <h3 className="text-lg font-bold text-gray-900 leading-tight">{job.title}</h3>
                                          {job.isUrgent && <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full">Urgent</span>}
                                      </div>
                                      <div className="flex items-center text-gray-600 font-medium mb-3">
                                          <Building size={16} className="mr-2 text-gray-500" />
                                          <span>{job.company}</span>
                                      </div>
                                      <div className="space-y-3 text-sm text-gray-700 mb-4">
                                          <div className="flex items-center">
                                              <MapPin size={16} className="mr-2 text-gray-500" />
                                              <span>{job.location}</span>
                                          </div>
                                          <div className="flex items-center">
                                              <Briefcase size={16} className="mr-2 text-gray-500" />
                                              <span>{job.experience}</span>
                                          </div>
                                          <div className="flex items-center">
                                              <Code size={16} className="mr-2 text-gray-500" />
                                              <span className="font-semibold text-green-700">{job.salary}</span>
                                          </div>
                                      </div>
                                      <div className="flex items-center text-gray-500 text-xs mt-auto pt-4 border-t border-gray-100">
                                          <Clock size={14} className="mr-2" />
                                          <span>Posted: {job.postedDate}</span>
                                      </div>
                                      <div className="flex justify-end items-end mt-4">
                                        <button
                                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-full transition-all duration-300 shadow text-base"
                                          onClick={() => navigate(`/jobs/details/${job.id}`)}
                                        >
                                          View Details
                                        </button>
                                      </div>
                                  </motion.div>
                                  ))}
                              </div>
                          </>
                      ) : (
                      <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center text-gray-600 py-20 bg-white rounded-2xl shadow-md border"
                      >
                          <Search size={48} className="mx-auto text-gray-400 mb-4" />
                          <p className="font-bold text-xl text-gray-800">No jobs found matching your criteria.</p>
                          <p className="text-base mt-2">Try adjusting your search terms or broadening your search.</p>
                      </motion.div>
                      )
                  ) : (
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center text-gray-600 py-20 bg-white rounded-2xl shadow-md border"
                      >
                          <Search size={48} className="mx-auto text-gray-400 mb-4" />
                          <p className="font-bold text-xl text-gray-800">Start your job search</p>
                          <p className="text-base mt-2">Use the form above to find your dream job.</p>
                      </motion.div>
                  )}
              </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default JobSearchPage; 