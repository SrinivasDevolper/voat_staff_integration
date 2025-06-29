import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, ChevronDown, X, Bookmark, Clock,
  Briefcase, Mail,
  Phone,
  Globe,
  GraduationCap,
  Calendar,
  ArrowLeft,
  User,
  Briefcase as BriefcaseIcon,
  Award,
  FileText,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import axios from 'axios';

const AllApplicationsContent = () => {
  const [allApplications, setAllApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(3);
  const [sortedApplications, setSortedApplications] = useState([]);
  const [applicationToReject, setApplicationToReject] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [applicationToApprove, setApplicationToApprove] = useState(null);
  const [applicationOnHold, setApplicationOnHold] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("tempToken") || localStorage.getItem("token");
        if (!token) {
          console.error("Authentication token not found.");
          setAllApplications([]);
          return;
        }

        const response = await axios.get('/api/hr/applications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedApplications = response.data.map(app => ({
          id: app.application_id,
          name: app.jobseeker_name,
          experience: '',
          skills: [],
          location: '',
          appliedDate: new Date(app.created_at),
          email: '',
          phone: '',
          portfolio: '',
          education: '',
          bio: '',
          resume: app.resume_filepath,
          projects: [],
          certifications: [],
          status: app.status,
          job_title: app.job_title,
          company: app.company
        }));
        setAllApplications(fetchedApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setAllApplications([]);
      }
    };
    fetchApplications();
  }, []);

  const handleHold = (id) => {
    setAllApplications(allApplications.map(app => 
      app.id === id ? { ...app, status: "On Hold" } : app
    ));
    setApplicationOnHold(null);
    if (selectedApplication?.id === id) {
      setSelectedApplication({ ...selectedApplication, status: "On Hold" });
    }
  };

  const handleApprove = (id) => {
    setAllApplications(allApplications.map(app => 
      app.id === id ? { ...app, status: "Approved" } : app
    ));
    setApplicationToApprove(null);
    if (selectedApplication?.id === id) {
      setSelectedApplication({ ...selectedApplication, status: "Approved" });
    }
  };

  const handleReject = (id) => {
    setAllApplications(allApplications.filter(app => app.id !== id));
    setApplicationToReject(null);
    if (selectedApplication?.id === id) {
      setSelectedApplication(null);
    }
    if (currentApplications.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const sorted = [...allApplications].sort((a, b) => b.appliedDate - a.appliedDate);
    setSortedApplications(sorted);
  }, [allApplications]);

  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = sortedApplications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(sortedApplications.length / applicationsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const formatDate = (date) => {
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const leftOffset = Math.floor(maxVisiblePages / 2);
      const rightOffset = Math.ceil(maxVisiblePages / 2) - 1;
      
      if (currentPage <= leftOffset) {
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - rightOffset) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - (maxVisiblePages - 2); i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (selectedApplication) {
    const currentIndex = sortedApplications.findIndex(app => app.id === selectedApplication.id);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < sortedApplications.length - 1;

    const handlePrevious = () => {
      if (hasPrevious) {
        setSelectedApplication(sortedApplications[currentIndex - 1]);
      }
    };

    const handleNext = () => {
      if (hasNext) {
        setSelectedApplication(sortedApplications[currentIndex + 1]);
      }
    };

    return (
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setSelectedApplication(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={18} />
            Back to List
          </button>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrevious}
              className={`flex items-center gap-2 ${hasPrevious ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'}`}
              disabled={!hasPrevious}
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            
            <span className="text-sm text-gray-500">
              {currentIndex + 1} of {sortedApplications.length}
            </span>
            
            <button 
              onClick={handleNext}
              className={`flex items-center gap-2 ${hasNext ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'}`}
              disabled={!hasNext}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
  
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{selectedApplication.name}</h1>
        </div>
  
        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Resume Preview</h2>
            <a 
              href={selectedApplication.resume} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-2 text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Full Resume
            </a>
          </div>
          
          <div className="h-[600px] w-full bg-white border border-gray-300 rounded overflow-hidden">
            <iframe 
              src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedApplication.resume)}&embedded=true`}
              className="w-full h-full"
              frameBorder="0"
              title="Resume Preview"
            >
              <p className="p-4 text-gray-500">Your browser does not support PDF preview. 
                <a href={selectedApplication.resume} className="text-blue-600 hover:underline ml-1">
                  Download the resume instead
                </a>
              </p>
            </iframe>
          </div>
        </div>
  
        <div className="flex items-center gap-4 mb-6">
          <span className="text-gray-500 flex items-center gap-1">
            <Clock size={14} />
            Applied {formatDate(selectedApplication.appliedDate)}
          </span>
        </div>
  
        <div className="flex flex-wrap gap-3 mb-8">
          <button 
            onClick={() => setApplicationToApprove(selectedApplication.id)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
          >
            Approve
          </button>
          <button 
            onClick={() => setApplicationToReject(selectedApplication.id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
          >
            Reject
          </button>
          <button 
            onClick={() => setApplicationOnHold(selectedApplication.id)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-medium"
          >
            Put on hold
          </button>
          <button 
            onClick={() => window.open(selectedApplication.resume, '_blank')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            DOWNLOAD RESUME
          </button>
        </div>
  
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={18} />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-500" />
                <span className="text-gray-700">{selectedApplication.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-500" />
                <span className="text-gray-700">{selectedApplication.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-gray-500" />
                <a href={`https://${selectedApplication.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {selectedApplication.portfolio}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-gray-700">{selectedApplication.location}</span>
              </div>
            </div>
          </div>
  
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap size={18} />
              Education
            </h2>
            <p className="text-gray-700">{selectedApplication.education}</p>
          </div>
  
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award size={18} />
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectedApplication.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
  
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText size={18} />
              About
            </h2>
            <p className="text-gray-700 whitespace-pre-line">{selectedApplication.bio}</p>
          </div>
        </div>

        {applicationToApprove && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Confirm Approval</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to approve this application?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setApplicationToApprove(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleApprove(applicationToApprove);
                    setApplicationToApprove(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirm Approve
                </button>
              </div>
            </div>
          </div>
        )}

        {applicationToReject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Confirm Rejection</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to reject this application?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setApplicationToReject(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleReject(applicationToReject);
                    setApplicationToReject(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {applicationOnHold && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Confirm Hold</h3>
              <p className="text-gray-600 mb-6">Are you sure you want to put this application on hold?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setApplicationOnHold(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleHold(applicationOnHold);
                    setApplicationOnHold(null);
                  }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Confirm Hold
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } 

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Applications</h1>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search applications..."
              />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="location"
                id="location"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="e.g., New York"
              />
            </div>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <select
                id="status"
                name="status"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                defaultValue=""
              >
                <option value="">All</option>
                <option value="New">New</option>
                <option value="In Review">In Review</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offer Extended">Offer Extended</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="On Hold">On Hold</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="skills"
                id="skills"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="e.g., React, Node.js"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Applications</h2>
        
        {sortedApplications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentApplications.map(application => (
                  <React.Fragment key={application.id}>
                    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedApplication(application)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{application.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.job_title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{application.company}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                          application.status === 'In Review' || application.status === 'Interview Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'On Hold' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(application.appliedDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={(e) => { e.stopPropagation(); setApplicationToApprove(application); }} className="text-green-600 hover:text-green-900 mr-4">Approve</button>
                        <button onClick={(e) => { e.stopPropagation(); setApplicationOnHold(application); }} className="text-orange-600 hover:text-orange-900 mr-4">Hold</button>
                        <button onClick={(e) => { e.stopPropagation(); setApplicationToReject(application); }} className="text-red-600 hover:text-red-900">Reject</button>
                      </td>
                    </tr>

                    {selectedApplication?.id === application.id && (
                      <tr>
                        <td colSpan="6" className="p-4 bg-gray-50">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                            <div className="lg:w-2/3">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedApplication.name}</h3>
                              <p className="text-gray-600 mb-4">{selectedApplication.bio}</p>
                              
                              <div className="mb-4">
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center"><BriefcaseIcon size={18} className="mr-2" /> Experience</h4>
                                <p className="text-gray-700">{selectedApplication.experience}</p>
                              </div>

                              <div className="mb-4">
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center"><Award size={18} className="mr-2" /> Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedApplication.skills.map(skill => (
                                    <span key={skill} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill}</span>
                                  ))}
                                </div>
                              </div>

                              <div className="mb-4">
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center"><GraduationCap size={18} className="mr-2" /> Education</h4>
                                <p className="text-gray-700">{selectedApplication.education}</p>
                              </div>

                              {selectedApplication.projects && selectedApplication.projects.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center"><Briefcase size={18} className="mr-2" /> Projects</h4>
                                  {selectedApplication.projects.map((project, idx) => (
                                    <div key={idx} className="mb-2 p-3 bg-white rounded-md shadow-sm border border-gray-100">
                                      <p className="font-medium text-gray-800">{project.name}</p>
                                      <p className="text-sm text-gray-600">{project.description}</p>
                                      {project.technologies && project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {project.technologies.map(tech => (
                                            <span key={tech} className="bg-gray-100 text-gray-700 text-xs px-1.5 py-0.5 rounded">{tech}</span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {selectedApplication.certifications && selectedApplication.certifications.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center"><Award size={18} className="mr-2" /> Certifications</h4>
                                  <ul className="list-disc list-inside text-gray-700">
                                    {selectedApplication.certifications.map((cert, idx) => (
                                      <li key={idx}>{cert}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              <div className="flex items-center justify-between mt-6">
                                <button
                                  onClick={() => setSelectedApplication(null)}
                                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <ArrowLeft size={16} className="mr-2" /> Back to Applications
                                </button>
                                <a
                                  href={selectedApplication.resume}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <FileText size={16} className="mr-2" /> View Resume
                                </a>
                              </div>
                            </div>

                            <div className="lg:w-1/3 mt-6 lg:mt-0 bg-white p-4 rounded-lg shadow-md">
                              <h4 className="font-semibold text-gray-800 mb-3">Contact Info</h4>
                              <div className="space-y-2">
                                <p className="text-gray-700 flex items-center"><Mail size={16} className="mr-2" /> {selectedApplication.email}</p>
                                <p className="text-gray-700 flex items-center"><Phone size={16} className="mr-2" /> {selectedApplication.phone}</p>
                                <p className="text-gray-700 flex items-center"><Globe size={16} className="mr-2" /> <a href={`https://${selectedApplication.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{selectedApplication.portfolio}</a></p>
                                <p className="text-gray-700 flex items-center"><MapPin size={16} className="mr-2" /> {selectedApplication.location}</p>
                                <p className="text-gray-700 flex items-center"><Calendar size={16} className="mr-2" /> Applied: {formatDate(selectedApplication.appliedDate)}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No applications found.</p>
        )}

        {totalPages > 1 && (
          <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6" aria-label="Pagination">
            <div className="flex-1 flex justify-between sm:justify-end">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} className="mr-2" /> Previous
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={16} className="ml-2" />
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstApplication + 1}</span> to <span className="font-medium">{Math.min(indexOfLastApplication, sortedApplications.length)}</span> of{" "}<span className="font-medium">{sortedApplications.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  {getPageNumbers().map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      aria-current={currentPage === number ? 'page' : undefined}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === number
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } rounded-md`}
                    >
                      {number}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </nav>
        )}
      </div>

      {applicationToReject && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="p-8 border w-96 shadow-lg rounded-md bg-white text-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Reject Application</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to reject {applicationToReject.name}'s application?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleReject(applicationToReject.id)}
                className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Reject
              </button>
              <button
                onClick={() => setApplicationToReject(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {applicationToApprove && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="p-8 border w-96 shadow-lg rounded-md bg-white text-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Approve Application</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to approve {applicationToApprove.name}'s application?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleApprove(applicationToApprove.id)}
                className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Approve
              </button>
              <button
                onClick={() => setApplicationToApprove(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {applicationOnHold && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="p-8 border w-96 shadow-lg rounded-md bg-white text-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Put Application on Hold</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to put {applicationOnHold.name}'s application on hold?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleHold(applicationOnHold.id)}
                className="px-4 py-2 bg-orange-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Put on Hold
              </button>
              <button
                onClick={() => setApplicationOnHold(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllApplicationsContent;