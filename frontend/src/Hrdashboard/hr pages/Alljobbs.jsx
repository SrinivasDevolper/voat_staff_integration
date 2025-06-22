import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Edit, 
  XCircle, 
  CheckCircle, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  ClipboardList,
  Paperclip,
  UploadCloud,
  AlertCircle,
  Loader2,
  Check
} from "lucide-react";
import { toast } from "react-toastify";
import { Switch } from '@headlessui/react';

const JobDetailView = ({ job, onCloseHiring, onDelete, currentIndex, totalJobs, onPrev, onNext, onUpdate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
const [sampleJobs, setSampleJobs] = useState([
  {
    id: 'job1',
    title: "Senior Frontend Developer",
    company: "Tech Corp Inc.",
    description: "We're looking for an experienced frontend developer with React expertise to join our team...",
    location: "New York, NY",
    salaryMin: "₹90,000",
    salaryMax: "₹120,000",
    salaryPeriod: "per year",
    type: "Full-time",
    experience: "Mid-Senior level",
    skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML"],
    isRemote: true,
    isUrgent: false,
    postedDate: "May 25, 2025",
    applications: { received: 12, needed: 6 },
    status: "active",
    autoStopHiring: {
      enabled: true,
      type: "applications",
      date: "",
      applications: 50
    },
    attachment: {
      name: "Job_Description.pdf",
      size: "250 KB",
      type: "pdf"
    }
  },
]);

  // State to track current job index
  const [currentJobIndex, setCurrentJobIndex] = useState(currentIndex || 0);
  
  // Use the passed job prop or fall back to sample data
  const [jobData, setJobData] = useState(job || sampleJobs[currentJobIndex]);
  const totalJobCount = totalJobs || sampleJobs.length;

  // Update job data when location state changes (after edit)
  useEffect(() => {
    if (location.state?.updatedJob) {
      if (job) {
        // If this is a real job (passed via props), call the onUpdate callback
        onUpdate?.(location.state.updatedJob);
      } else {
        // Update local sample data
        const updatedJobs = [...sampleJobs];
        const jobIndex = updatedJobs.findIndex(j => j.id === location.state.updatedJob.id);
        if (jobIndex !== -1) {
          updatedJobs[jobIndex] = location.state.updatedJob;
          setSampleJobs(updatedJobs);
        }
      }
      // Clear the state to prevent infinite updates
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state]);

  // Update jobData when job prop or sampleJobs changes
  useEffect(() => {
    setJobData(job || sampleJobs[currentJobIndex]);
  }, [job, sampleJobs, currentJobIndex]);

  // Handle previous job
  const handlePrev = () => {
    if (currentJobIndex > 0) {
      setCurrentJobIndex(currentJobIndex - 1);
      if (onPrev) onPrev();
    }
  };

  // Handle next job
  const handleNext = () => {
    if (currentJobIndex < totalJobCount - 1) {
      setCurrentJobIndex(currentJobIndex + 1);
      if (onNext) onNext();
    }
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    setDeleteConfirmOpen(true);
  };

  // Handle delete job
  const handleDeleteJob = () => {
    const jobId = jobData?.id;

    if (!jobId) return;

    if (job) {
      // Real job passed via props – call parent delete handler
      onDelete?.(jobId);
      toast.success("Job posting deleted successfully");
    } else {
      // Local sample data case
      const updatedJobs = sampleJobs.filter(j => j.id !== jobId);
      setSampleJobs(updatedJobs);

      // If no jobs left, redirect
      if (updatedJobs.length === 0) {
        navigate('/hiring');
      } else {
        // Adjust index if necessary
        if (currentJobIndex >= updatedJobs.length) {
          setCurrentJobIndex(updatedJobs.length - 1);
        }
      }
      toast.success("Job posting deleted successfully");
    }

    // Close the confirmation modal
    setDeleteConfirmOpen(false);
  };

  // Handle close/reopen hiring
  const handleCloseHiring = () => {
    const action = jobData.status === 'active' ? 'close' : 'reopen';
    const actionText = jobData.status === 'active' ? 'closed' : 'reopened';
    
    if (job) {
      // Call parent handler if job is passed via props
      onCloseHiring?.(jobData.id, action);
    } else {
      // Update local state for sample data
      const updatedJobs = [...sampleJobs];
      updatedJobs[currentJobIndex].status = action === 'close' ? 'inactive' : 'active';
      setSampleJobs(updatedJobs);
    }
    toast.success(`Job posting ${actionText} successfully`);
  };





  const handleDownload = () => {
    toast.info("Downloading attachment...");
  };

  // Get edit link for the job
const getEditLink = () => (
  <Link 
    to="/post-job" 
    state={{ 
      jobData: {
        id: jobData.id,
        title: jobData.title,
        company: jobData.company,
        description: jobData.description,
        location: jobData.location,
        salaryMin: jobData.salaryMin,
        salaryMax: jobData.salaryMax,
        salaryPeriod: jobData.salaryPeriod || "per year",
        type: jobData.type,
        experience: jobData.experience,
        skills: jobData.skills,
        isRemote: jobData.isRemote,
        isUrgent: jobData.isUrgent,
        postedDate: jobData.postedDate,
        applications: jobData.applications,
        status: jobData.status,
        autoStopHiring: jobData.autoStopHiring,
        attachment: jobData.attachment
      },
      isEditing: true
    }}
      className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium flex items-center justify-center shadow-sm hover:shadow-md active:scale-[0.98]"
    >
      <Edit className="h-5 w-5 mr-2 flex-shrink-0" />
      <span>Edit Job</span>
    </Link>
  );

  // Get icon based on file type
  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'image':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'doc':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="flex justify-center items-start">
        <div className="w-full max-w-7xl rounded-2xl p-6 bg-white shadow-sm border border-gray-100">
          {/* Header with pagination */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
              <p className="text-gray-500 mt-1">Manage and view job posting details</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handlePrev}
                disabled={currentJobIndex <= 0}
                className={`p-2 rounded-full transition-all ${currentJobIndex <= 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:shadow-sm active:scale-95'}`}
                aria-label="Previous job"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {currentJobIndex + 1} of {totalJobCount}
              </span>
              
              <button 
                onClick={handleNext}
                disabled={currentJobIndex >= totalJobCount - 1}
                className={`p-2 rounded-full transition-all ${currentJobIndex >= totalJobCount - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:shadow-sm active:scale-95'}`}
                aria-label="Next job"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              
              <Link 
                to="/hiring" 
                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline ml-4 transition-colors font-medium flex items-center"
              >
                <span>View All Jobs</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Main job details container */}
          <div className="flex flex-col gap-6">
            {/* Top section - Job details and actions with equal height */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left column - Job details (2/3 width) */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-xl p-6 border border-gray-200 h-full flex flex-col shadow-sm">
                  {/* Job header with status */}
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold text-gray-800">{jobData.title}</h2>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          jobData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {jobData.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-lg text-gray-600">{jobData.company}</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {jobData.type}
                    </span>
                  </div>

                  {/* Job metadata */}
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                      {jobData.location}
                    </div>
{/* Replace the single salary field with the min/max range */}
<div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
  {jobData.salaryMin} - {jobData.salaryMax} {jobData.salaryPeriod}
</div>
                    <div className="flex items-center text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
                      {jobData.experience}
                    </div>
                    {jobData.isRemote && (
                      <div className="flex items-center text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
                        <Check className="h-5 w-5 mr-2 text-blue-500" />
                        Remote Available
                      </div>
                    )}
                    {jobData.isUrgent && (
                      <div className="flex items-center text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                        <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                        Urgent Hiring
                      </div>
                    )}
                  </div>
                  



                  {/* Job description */}
                  <div className="mb-6 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Job Description</h3>
                    <div className="prose prose-sm max-w-none text-gray-700">
                      {jobData.description.split('\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {jobData.skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                
                </div>
              </div>
              

              {/* Right column - Actions (1/3 width) */}
              <div className="lg:w-1/3">
                <div className="bg-white rounded-xl p-6 border border-gray-200 h-full flex flex-col shadow-sm">
                  {/* Applications header */}
                  <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800">Applications</h3>
                    <span className="text-sm text-gray-500">{jobData.postedDate}</span>
                  </div>

                  {/* Applications count */}
                  <div className="relative p-4 bg-blue-50 rounded-lg border border-blue-100 my-3">
                    <div className="flex flex-col">
                      <div>
                        <p className="text-xs text-blue-600 font-medium mb-2">APPLICATIONS RECEIVED</p>
                        <span className="font-semibold text-5xl text-gray-800 leading-tight">
                          {jobData.applications.received}
                          <span className="text-gray-500 text-3xl"> / {jobData.applications.needed}</span>
                        </span>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Link to="/applications">
                          <button 
                            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all font-medium text-sm shadow-sm hover:shadow-md active:scale-95"
                          >
                            View All
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Attachments section */}
                  {jobData.attachment && (
                    <div className="bg-gray-50 rounded-md p-3 border border-gray-200 text-xs mb-4">
                      <div className="flex items-center mb-1">
                        <Paperclip className="h-3.5 w-3.5 text-gray-500 mr-1.5" />
                        <h3 className="font-medium text-gray-900">Attachment</h3>
                      </div>
                      <p className="text-gray-500 mb-2">PDF, DOCX, JPG, PNG (Max 5MB)</p>

                      <div 
                        className="flex items-center p-2 border border-gray-200 rounded-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={handleDownload}
                      >
                        {getFileIcon(jobData.attachment.type)}
                        <div className="ml-2 flex-1">
                          <p className="text-sm font-medium text-gray-700 truncate">{jobData.attachment.name}</p>
                          <p className="text-xs text-gray-500">{jobData.attachment.size}</p>
                        </div>
                        <button 
                          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload();
                          }}
                          aria-label="Download attachment"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="space-y-3 mt-auto">
                    {getEditLink()}
                    
                    <button 
                      onClick={handleCloseHiring}
                      className={`w-full px-4 py-3 rounded-lg transition-all font-medium flex items-center justify-center shadow-sm hover:shadow-md active:scale-[0.98] border ${
                        jobData.status === 'active' 
                          ? 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300' 
                          : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      {jobData.status === 'active' ? (
                        <>
                          <XCircle className="h-5 w-5 mr-2 flex-shrink-0 text-amber-500" />
                          <span>Close Hiring</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-green-500" />
                          <span>Reopen Hiring</span>
                        </>
                      )}
                    </button>

                    <button 
                      onClick={handleDeleteConfirm}
                      className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium flex items-center justify-center shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                      <Trash2 className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span>Delete Job</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this job posting? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium shadow-sm hover:shadow-md"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

JobDetailView.defaultProps = {
  onCloseHiring: () => {},
  onDelete: () => {},
  onUpdate: () => {},
  onPrev: () => {},
  onNext: () => {},
  currentIndex: 0,
  totalJobs: null
};

export default JobDetailView;