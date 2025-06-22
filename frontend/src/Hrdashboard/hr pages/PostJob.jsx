import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  X,
  Check,
  Upload,
  Edit,
  Calendar,
  Users,
  ClipboardList,
  Plus,
  Paperclip,
  UploadCloud,
  Settings,
  AlertCircle,
  Loader2,
  CheckCircle,
  CalendarIcon
} from 'lucide-react';
import { Switch } from '@headlessui/react';

const PostJob = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const topRef = useRef(null);

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    company: '',
    description: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    salaryPeriod: 'per month',
    type: 'Full-time',
    experience: 'Mid-level',
    skills: [],
    postedDate: new Date().toISOString().split('T')[0],
    applications: 0,
    status: 'active',
    isRemote: false,
    isUrgent: false
  });

  const [autoStopSettings, setAutoStopSettings] = useState({
    enabled: false,
    option: 'applications',
    applicationsCount: 0,
    daysCount: '',
    specificDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
  const experienceLevels = ['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Executive'];

  useEffect(() => {
    if (submitSuccess && topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [submitSuccess]);

  useEffect(() => {
    if (location.state?.jobData) {
      const jobData = location.state.jobData;
      setFormData({
        id: jobData.id || '',
        title: jobData.title || '',
        company: jobData.company || '',
        description: jobData.description || '',
        location: jobData.location || '',
        salaryMin: jobData.salaryMin || '',
        salaryMax: jobData.salaryMax || '',
        salaryPeriod: jobData.salaryPeriod || 'per month',
        type: jobData.type || 'Full-time',
        experience: jobData.experience || 'Mid-level',
        skills: jobData.skills || [],
        postedDate: jobData.postedDate || new Date().toISOString().split('T')[0],
        applications: jobData.applications || 0,
        status: jobData.status || 'active',
        isRemote: jobData.isRemote || false,
        isUrgent: jobData.isUrgent || false
      });

      if (jobData.autoStopSettings) {
        setAutoStopSettings(jobData.autoStopSettings);
      }

      setIsEditing(true);
    }
  }, [location.state]);

  useEffect(() => {
    const hasValues =
      !!autoStopSettings.applicationsCount ||
      !!autoStopSettings.daysCount ||
      !!autoStopSettings.specificDate;

    if (hasValues && !autoStopSettings.enabled) {
      setAutoStopSettings((prev) => ({ ...prev, enabled: true }));
    }
  }, [
    autoStopSettings.applicationsCount,
    autoStopSettings.daysCount,
    autoStopSettings.specificDate,
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAutoStopChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAutoStopSettings({
      ...autoStopSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill.trim()]
      });
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleFileChange = (e) => {
    setFileError("");
    const selectedFiles = Array.from(e.target.files);
    const oversized = selectedFiles.find(file => file.size > 5 * 1024 * 1024);
    if (oversized) {
      setFileError("Each file must be 5MB or less.");
      return;
    }
    if (selectedFiles.length > 0) {
      setFiles([...files, ...selectedFiles]);
    }
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const validateSalary = (value) => {
    const numericValue = value.replace(/[^\d]/g, '');
    if (numericValue) {
      return '₹' + parseInt(numericValue, 10).toLocaleString('en-IN');
    }
    return '';
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = validateSalary(value);
    setFormData({
      ...formData,
      [name]: formattedValue
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFileError("");
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.salaryMin) newErrors.salaryMin = 'Minimum salary is required';
    if (!formData.salaryMax) newErrors.salaryMax = 'Maximum salary is required';
    if (!formData.skills || formData.skills.length === 0) newErrors.skills = 'At least one skill is required';
    if (files.some(file => file.size > 5 * 1024 * 1024)) {
      setFileError("Each file must be 5MB or less.");
      setIsSubmitting(false);
      return;
    }
    if (formData.salaryMin && formData.salaryMax) {
      const minValue = parseInt(formData.salaryMin.replace(/[^\d]/g, ''), 10);
      const maxValue = parseInt(formData.salaryMax.replace(/[^\d]/g, ''), 10);
      if (minValue > maxValue) {
        newErrors.salaryMax = 'Maximum salary must be greater than minimum';
      }
      if (minValue <= 0) {
        newErrors.salaryMin = 'Salary must be greater than 0';
      }
      if (maxValue <= 0) {
        newErrors.salaryMax = 'Salary must be greater than 0';
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    const finalAutoStop = autoStopSettings.enabled ? {
      ...autoStopSettings,
      applicationsCount: Number(autoStopSettings.applicationsCount) || 0,
      daysCount: Number(autoStopSettings.daysCount) || 0,
    } : null;
    const finalData = {
      ...formData,
      autoStopSettings: finalAutoStop,
      postedDate: isEditing ? formData.postedDate : new Date().toISOString().split('T')[0],
      attachments: files.map(file => file.name)
    };
    setTimeout(() => {
      console.log(isEditing ? 'Job updated:' : 'Job posted:', finalData);
      setSubmitSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        if (isEditing) {
          navigate('/all-jobs', { 
            state: { 
              updatedJob: finalData,
              fromEdit: true 
            },
            replace: true
          });
        } else {
          navigate('/all-jobs', { replace: true });
        }
      }, 2000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" ref={topRef}>
      <div className="flex justify-center items-start">
        <div className="w-full max-w-7xl rounded-2xl p-6 bg-white shadow-sm border border-gray-100">
          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-800">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="font-medium">
                {isEditing ? 'Job updated successfully!' : 'Job posted successfully!'}
              </span>
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Job Posting' : 'Create New Job Posting'}
              </h1>
              <p className="text-gray-500 mt-1">
                {isEditing ? 'Update your job details' : 'Fill in the details to post a new job'}
              </p>
            </div>
            <Link
              to={isEditing ? '/job-detail' : '/all-jobs'}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1.5 transition-colors"
            >
              <X className="h-5 w-5" />
              <span className="hidden sm:inline">Cancel</span>
            </Link>
          </div>

          {/* Main Content Grid */}
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Left Column - Job Details */}
            <div className="lg:w-2/3 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs h-full">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Attachments Section - Moved to top */}
                  <div className=" pb-2 border-b border-blue-700">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-lg font-semibold text-gray-900 flex items-center">
                        <Paperclip className="h-5 w-5 text-blue-500 mr-2" />
                        Attachments
                        <span className="ml-2 text-sm font-normal text-gray-500">(Optional)</span>
                      </label>
                      
                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-2 hover:border-blue-300 transition-colors">
                        <label className="flex items-center cursor-pointer">
                          <div className="flex items-center">
                            <UploadCloud className="h-5 w-5 text-gray-400 mr-2" />
                            <p className="text-sm text-gray-600">
                              <span className="text-blue-600 font-medium">Click to upload</span>
                            </p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>

                    <span className="block text-sm text-gray-500 mb-1">PDF, DOCX, JPG, PNG (Max 5MB each)</span>
                    
                    {files.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {files.map((file, index) => (
                          <div 
                            key={index} 
                            className="flex items-center justify-between bg-white px-3 py-2 rounded-md border border-gray-200 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-center min-w-0">
                              <Paperclip className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                              <span className="truncate text-sm" title={file.name}>
                                {file.name}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-gray-400 hover:text-red-500 ml-2 focus:outline-none"
                              aria-label={`Remove ${file.name}`}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {fileError && (
                      <div className="text-red-600 text-sm mt-2">{fileError}</div>
                    )}
                  </div>

                  {/* Job Title & Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Job Title<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="title"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
                          errors.title ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                        }`}
                        placeholder="e.g. Senior Frontend Developer"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Company Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="company"
                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
                          errors.company ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                        }`}
                        placeholder="Your company name"
                        value={formData.company}
                        onChange={handleInputChange}
                      />
                      {errors.company && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.company}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Description<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 min-h-[75px] ${
                        errors.description ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                      }`}
                      placeholder="Describe the job responsibilities and requirements"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Combined Location, Job Type & Experience in one row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Location<span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="location"
                          className={`w-full pr-11 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
                            errors.location ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                          }`}
                          placeholder="e.g. New York, NY"
                          value={formData.location}
                          onChange={handleInputChange}
                        />
                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.location}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Job Type
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        <select
                          name="type"
                          className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 appearance-none"
                          value={formData.type}
                          onChange={handleInputChange}
                        >
                          {jobTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Experience Level
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        <select
                          name="experience"
                          className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 appearance-none"
                          value={formData.experience}
                          onChange={handleInputChange}
                        >
                          {experienceLevels.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Salary Range<span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-4">
                      {/* Min Salary */}
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="text"
                            name="salaryMin"
                            className={`w-full pr-11 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
                              errors.salaryMin ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                            }`}
                            placeholder="Min"
                            value={formData.salaryMin}
                            onChange={handleSalaryChange}
                          />
                          <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.salaryMin && (
                          <p className="mt-1.5 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.salaryMin}
                          </p>
                        )}
                      </div>

                      {/* To */}
                      <span className="text-gray-500">to</span>

                      {/* Max Salary */}
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="text"
                            name="salaryMax"
                            className={`w-full pr-11 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
                              errors.salaryMax ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                            }`}
                            placeholder="Max"
                            value={formData.salaryMax}
                            onChange={handleSalaryChange}
                          />
                          <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                        {errors.salaryMax && (
                          <p className="mt-1.5 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.salaryMax}
                          </p>
                        )}
                      </div>

                      {/* Period Selector */}
                      <div className="w-32">
                        <select
                          name="salaryPeriod"
                          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 ${
                            errors.salaryPeriod ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                          }`}
                          value={formData.salaryPeriod}
                          onChange={handleInputChange}
                        >
                          <option value="per hour">per hour</option>
                          <option value="per day">per day</option>
                          <option value="per week">per week</option>
                          <option value="per month">per month</option>
                          <option value="per year">per year</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Skills Required<span className="text-red-500">*</span>
                      <span className="block text-xs text-gray-500 mt-1">Add relevant skills for this position</span>
                    </label>
                    
                    <div className="flex">
                      <input
                        type="text"
                        className="flex-grow px-4 py-2.5 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        placeholder="e.g. React, Python, UX Design"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg transition-colors flex items-center justify-center"
                        aria-label="Add skill"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                    
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.skills.map(skill => (
                          <div 
                            key={skill} 
                            className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm transition-colors hover:bg-blue-100"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1.5 text-blue-500 hover:text-blue-700 focus:outline-none"
                              aria-label={`Remove ${skill}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.skills && (
                      <div className="text-red-600 text-sm mt-1">{errors.skills}</div>
                    )}
                  </div>
                  {/* Submit Button at the end of the form */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-colors duration-200 flex items-center justify-center mt-6"
                    disabled={isSubmitting || submitSuccess}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        {isEditing ? 'Updating...' : 'Posting...'}
                      </>
                    ) : (
                      isEditing ? 'Update Job' : 'Post Job Now'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column - Hiring Settings */}
            <div className="lg:w-1/3 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs h-full">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
                  <Settings className="h-5 w-5 text-blue-500 mr-2" />
                  Hiring Settings
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="autoStopEnabled" className="text-sm font-medium text-gray-700 cursor-pointer block">
                        Enable Auto Stop
                      </label>
                    </div>
                    <Switch
                      id="autoStopEnabled"
                      checked={autoStopSettings.enabled}
                      onChange={(checked) => setAutoStopSettings({ ...autoStopSettings, enabled: checked })}
                      className={`${autoStopSettings.enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                    >
                      <span
                        className={`${autoStopSettings.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>

                  <div className="space-y-5 pl-4 border-l-2 border-blue-100">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500 mr-2" />
                        <label htmlFor="autoStopApplications" className="text-sm font-medium text-gray-700">
                          Maximum Applications
                        </label>
                      </div>
                      <input
                        type="number"
                        id="autoStopApplications"
                        name="applicationsCount"
                        value={autoStopSettings.applicationsCount}
                        onChange={handleAutoStopChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        min="1"
                        placeholder="e.g. 100"
                      />
                      <p className="text-xs text-gray-500">Automatically closes after this number of applications.</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500 mr-2" />
                        <label htmlFor="autoStopDays" className="text-sm font-medium text-gray-700">
                          Days Remaining
                        </label>
                      </div>
                      <input
                        type="number"
                        id="autoStopDays"
                        name="daysCount"
                        value={autoStopSettings.daysCount}
                        onChange={handleAutoStopChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                        min="1"
                        placeholder="e.g. 30"
                      />
                      <p className="text-xs text-gray-500">Closes this many days after posting.</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500 mr-2" />
                        <label htmlFor="autoStopDate" className="text-sm font-medium text-gray-700 ">
                          Closing Date
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="date"
                          id="autoStopDate"
                          name="specificDate"
                          value={autoStopSettings.specificDate}
                          onChange={handleAutoStopChange}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <CalendarIcon className="h-4 w-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Auto Stop Settings... */}

                    {/* Urgent Hiring Switch */}
                    <div className="flex items-center justify-between pt-4">
                      <div className="space-y-1">
                        <label htmlFor="isUrgent" className="text-sm font-medium text-gray-700 cursor-pointer block">
                          Urgent Hiring
                        </label>
                        <p className="text-xs text-gray-500">Highlight this job as urgent</p>
                      </div>
                      <Switch
                        id="isUrgent"
                        checked={formData.isUrgent}
                        onChange={() => handleCheckboxChange({ target: { name: 'isUrgent', checked: !formData.isUrgent } })}
                        className={`${formData.isUrgent ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                      >
                        <span className={`${formData.isUrgent ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                      </Switch>
                    </div>

                    {/* Remote Position Switch */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label htmlFor="isRemote" className="text-sm font-medium text-gray-700 cursor-pointer block">
                          Remote Position
                        </label>
                        <p className="text-xs text-gray-500">This job can be done remotely</p>
                      </div>
                      <Switch
                        id="isRemote"
                        checked={formData.isRemote}
                        onChange={() => handleCheckboxChange({ target: { name: 'isRemote', checked: !formData.isRemote } })}
                        className={`${formData.isRemote ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                      >
                        <span className={`${formData.isRemote ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                      </Switch>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;