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
  Check,
  ArrowLeft,
  FileText,
  Image,
  File
} from "lucide-react";
import { toast } from "react-toastify";

const JobDetailView = ({ job, onCloseHiring, onDelete, currentIndex, totalJobs, onPrev, onNext, onUpdate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
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
  const [jobData, setJobData] = useState(job || sampleJobs[currentJobIndex]);
  const totalJobCount = totalJobs || sampleJobs.length;

  // Check for mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update job data when location state changes (after edit)
  useEffect(() => {
    if (location.state?.updatedJob) {
      if (job) {
        onUpdate?.(location.state.updatedJob);
      } else {
        const updatedJobs = [...sampleJobs];
        const jobIndex = updatedJobs.findIndex(j => j.id === location.state.updatedJob.id);
        if (jobIndex !== -1) {
          updatedJobs[jobIndex] = location.state.updatedJob;
          setSampleJobs(updatedJobs);
        }
      }
      navigate('.', { replace: true, state: {} });
    }
  }, [location.state]);

  // Update jobData when job prop or sampleJobs changes
  useEffect(() => {
    setJobData(job || sampleJobs[currentJobIndex]);
  }, [job, sampleJobs, currentJobIndex]);

  const handlePrev = () => {
    if (currentJobIndex > 0) {
      setCurrentJobIndex(currentJobIndex - 1);
      if (onPrev) onPrev();
    }
  };

  const handleNext = () => {
    if (currentJobIndex < totalJobCount - 1) {
      setCurrentJobIndex(currentJobIndex + 1);
      if (onNext) onNext();
    }
  };

  const handleDeleteConfirm = () => setDeleteConfirmOpen(true);

  const handleDeleteJob = () => {
    const jobId = jobData?.id;
    if (!jobId) return;

    if (job) {
      onDelete?.(jobId);
      toast.success("Job posting deleted successfully");
    } else {
      const updatedJobs = sampleJobs.filter(j => j.id !== jobId);
      setSampleJobs(updatedJobs);

      if (updatedJobs.length === 0) {
        navigate('/hire/hiring');
      } else if (currentJobIndex >= updatedJobs.length) {
        setCurrentJobIndex(updatedJobs.length - 1);
      }
      toast.success("Job posting deleted successfully");
    }
    setDeleteConfirmOpen(false);
  };

  const handleCloseHiring = () => {
    const action = jobData.status === 'active' ? 'close' : 'reopen';
    const actionText = jobData.status === 'active' ? 'closed' : 'reopened';
    
    if (job) {
      onCloseHiring?.(jobData.id, action);
    } else {
      const updatedJobs = [...sampleJobs];
      updatedJobs[currentJobIndex].status = action === 'close' ? 'inactive' : 'active';
      setSampleJobs(updatedJobs);
    }
    toast.success(`Job posting ${actionText} successfully`);
  };

  const handleDownload = () => {
    toast.info("Downloading attachment...");
  };

  const getEditLink = () => (
    <Link 
      to="/hire/post-job" 
      state={{ 
        jobData: {
          ...jobData,
          salaryPeriod: jobData.salaryPeriod || "per year"
        },
        isEditing: true
      }}
      className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium flex items-center justify-center shadow-sm hover:shadow-md active:scale-[0.98]"
    >
      <Edit className="h-5 w-5 mr-2 flex-shrink-0" />
      <span>Edit Job</span>
    </Link>
  );

  const getFileIcon = (type) => {
    const iconClass = "h-5 w-5";
    switch(type) {
      case 'pdf':
        return <FileText className={`${iconClass} text-red-500`} />;
      case 'image':
        return <Image className={`${iconClass} text-blue-500`} />;
      case 'doc':
        return <File className={`${iconClass} text-blue-400`} />;
      default:
        return <File className={`${iconClass} text-gray-500`} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="flex justify-center items-start">
        <div className="w-full max-w-7xl rounded-2xl p-4 sm:p-6 bg-white shadow-sm border border-gray-100">
          {/* Mobile back button */}
          {isMobile && (
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 mb-4 sm:hidden"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </button>
          )}

          {/* Header with pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Job Details</h1>
              <p className="text-sm sm:text-base text-gray-500 mt-1">Manage and view job posting details</p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrev}
                  disabled={currentJobIndex <= 0}
                  className={`p-1 sm:p-2 rounded-full transition-all ${currentJobIndex <= 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:shadow-sm active:scale-95'}`}
                  aria-label="Previous job"
                >
                  <ChevronLeft className="h-4 sm:h-5 w-4 sm:w-5" />
                </button>
                
                <span className="text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  {currentJobIndex + 1} of {totalJobCount}
                </span>
                
                <button 
                  onClick={handleNext}
                  disabled={currentJobIndex >= totalJobCount - 1}
                  className={`p-1 sm:p-2 rounded-full transition-all ${currentJobIndex >= totalJobCount - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100 hover:shadow-sm active:scale-95'}`}
                  aria-label="Next job"
                >
                  <ChevronRight className="h-4 sm:h-5 w-4 sm:w-5" />
                </button>
              </div>
              
              <Link 
                to="/hire/hiring" 
                className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800 hover:underline ml-auto sm:ml-4 transition-colors font-medium flex items-center"
              >
                <span>View All</span>
                <ChevronRight className="h-3 sm:h-4 w-3 sm:w-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Main job details container */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Top section - Job details and actions */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              {/* Left column - Job details (2/3 width) */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 h-full flex flex-col shadow-sm">
                  {/* Job header with status */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{jobData.title}</h2>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          jobData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {jobData.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-base sm:text-lg text-gray-600">{jobData.company}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 self-start sm:self-auto`}>
                      {jobData.type}
                    </span>
                  </div>

                  {/* Job metadata */}
                  <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center text-sm sm:text-base text-gray-600 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                      <MapPin className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 text-gray-500" />
                      {jobData.location}
                    </div>
                    <div className="flex items-center text-sm sm:text-base text-gray-600 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                      <DollarSign className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 text-gray-500" />
                      {jobData.salaryMin} - {jobData.salaryMax} {jobData.salaryPeriod}
                    </div>
                    <div className="flex items-center text-sm sm:text-base text-gray-600 bg-gray-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                      <Briefcase className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 text-gray-500" />
                      {jobData.experience}
                    </div>
                    {jobData.isRemote && (
                      <div className="flex items-center text-sm sm:text-base text-blue-600 bg-blue-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                        <Check className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 text-blue-500" />
                        Remote
                      </div>
                    )}
                    {jobData.isUrgent && (
                      <div className="flex items-center text-sm sm:text-base text-red-600 bg-red-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                        <AlertCircle className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 text-red-500" />
                        Urgent
                      </div>
                    )}
                  </div>

                  {/* Job description */}
                  <div className="mb-4 sm:mb-6 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Job Description</h3>
                    <div className="prose prose-sm max-w-none text-gray-700">
                      {jobData.description.split('\n').map((paragraph, i) => (
                        <p key={i} className="text-sm sm:text-base">{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Skills Required</h3>
                    <div className="flex flex-wrap gap-2">
                      {jobData.skills.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right column - Actions (1/3 width) */}
              <div className="lg:w-1/3">
                <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 h-full flex flex-col shadow-sm">
                  {/* Applications header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-4 mb-4 border-b border-gray-100">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Applications</h3>
                    <span className="text-xs sm:text-sm text-gray-500">{jobData.postedDate}</span>
                  </div>

                  {/* Applications count */}
                  <div className="relative p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-100 my-2 sm:my-3">
                    <div className="flex flex-col">
                      <div>
                        <p className="text-xs text-blue-600 font-medium mb-1 sm:mb-2">APPLICATIONS RECEIVED</p>
                        <span className="font-semibold text-3xl sm:text-5xl text-gray-800 leading-tight">
                          {jobData.applications.received}
                          <span className="text-gray-500 text-xl sm:text-3xl"> / {jobData.applications.needed}</span>
                        </span>
                      </div>

                      <div className="mt-4 sm:mt-6 flex justify-end">
                        <Link to="/hire/applications">
                          <button 
                            className="px-3 sm:px-5 py-1 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all font-medium text-xs sm:text-sm shadow-sm hover:shadow-md active:scale-95"
                          >
                            View All
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Attachments section */}
                  {jobData.attachment && (
                    <div className="bg-gray-50 rounded-md p-2 sm:p-3 border border-gray-200 text-xs mb-3 sm:mb-4">
                      <div className="flex items-center mb-1">
                        <Paperclip className="h-3 w-3 text-gray-500 mr-1" />
                        <h3 className="font-medium text-gray-900">Attachment</h3>
                      </div>
                      <p className="text-gray-500 mb-2">PDF, DOCX, JPG, PNG (Max 5MB)</p>

                      <div 
                        className="flex items-center p-2 border border-gray-200 rounded-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={handleDownload}
                      >
                        {getFileIcon(jobData.attachment.type)}
                        <div className="ml-2 flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">{jobData.attachment.name}</p>
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
                  <div className="space-y-2 sm:space-y-3 mt-auto">
                    {getEditLink()}
                    
                    <button 
                      onClick={handleCloseHiring}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all font-medium flex items-center justify-center shadow-sm hover:shadow-md active:scale-[0.98] border ${
                        jobData.status === 'active' 
                          ? 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300' 
                          : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      {jobData.status === 'active' ? (
                        <>
                          <XCircle className="h-4 sm:h-5 w-4 sm:w-5 mr-2 flex-shrink-0 text-amber-500" />
                          <span className="text-sm sm:text-base">Close Hiring</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 sm:h-5 w-4 sm:w-5 mr-2 flex-shrink-0 text-green-500" />
                          <span className="text-sm sm:text-base">Reopen Hiring</span>
                        </>
                      )}
                    </button>

                    <button 
                      onClick={handleDeleteConfirm}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium flex items-center justify-center shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                      <Trash2 className="h-4 sm:h-5 w-4 sm:w-5 mr-2 flex-shrink-0" />
                      <span className="text-sm sm:text-base">Delete Job</span>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl max-w-md w-full shadow-xl border border-gray-200">
            <h3 className="text-lg font-medium mb-3 sm:mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Are you sure you want to delete this job posting? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                className="px-3 sm:px-4 py-1 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium shadow-sm hover:shadow-md text-sm sm:text-base"
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