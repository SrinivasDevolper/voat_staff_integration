import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion'
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
  Calendar as CalendarIcon
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
    enabled: true,
    applicationsCount: '',
    daysCount: '',
    specificDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    errors: {}
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [files, setFiles] = useState([]);

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

  const validateAutoStopSettings = () => {
    const newErrors = {};
    
    if (autoStopSettings.enabled) {
      if (!autoStopSettings.applicationsCount && !autoStopSettings.daysCount && !autoStopSettings.specificDate) {
        newErrors.general = 'At least one auto-stop condition is required';
      } else {
        if (autoStopSettings.applicationsCount && autoStopSettings.applicationsCount < 1) {
          newErrors.applicationsCount = 'Must be at least 1';
        }
        
        if (autoStopSettings.daysCount && autoStopSettings.daysCount < 1) {
          newErrors.daysCount = 'Must be at least 1';
        }
        
        if (autoStopSettings.specificDate && new Date(autoStopSettings.specificDate) < new Date()) {
          newErrors.specificDate = 'Date must be in the future';
        }
      }
    }
    
    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAutoStopChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setAutoStopSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      errors: {
        ...prev.errors,
        [name]: undefined,
        general: undefined
      }
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const toggleAutoStop = (enabled) => {
    setAutoStopSettings(prev => ({
      ...prev,
      enabled,
      errors: enabled ? prev.errors : {} // Clear errors when disabling
    }));
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
    const selectedFiles = Array.from(e.target.files);
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
    
    // Validate main form
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    if (!formData.salaryMin) newErrors.salaryMin = 'Minimum salary is required';
    if (!formData.salaryMax) newErrors.salaryMax = 'Maximum salary is required';
    
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
    
    // Validate auto-stop settings if enabled
    const autoStopErrors = validateAutoStopSettings();
    if (autoStopSettings.enabled && Object.keys(autoStopErrors).length > 0) {
      setAutoStopSettings(prev => ({
        ...prev,
        errors: autoStopErrors
      }));
      setIsSubmitting(false);
      return;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    
    const finalData = {
      ...formData,
      autoStopSettings: autoStopSettings.enabled ? {
        enabled: true,
        applicationsCount: autoStopSettings.applicationsCount,
        daysCount: autoStopSettings.daysCount,
        specificDate: autoStopSettings.specificDate
      } : null,
      postedDate: isEditing ? formData.postedDate : new Date().toISOString().split('T')[0],
      attachments: files.map(file => file.name)
    };
    
    // Simulate API call
    setTimeout(() => {
      console.log(isEditing ? 'Job updated:' : 'Job posted:', finalData);
      
      setSubmitSuccess(true);
      setIsSubmitting(false);
      
      setTimeout(() => {
        if (isEditing) {
          navigate('/hire/all-jobs', { 
            state: { 
              updatedJob: finalData,
              fromEdit: true 
            },
            replace: true
          });
        } else {
          navigate('/hire/all-jobs', { replace: true });
        }
      }, 2000);
    }, 1000);
  };

  return (
<div className="min-h-screen bg-gray-50 p-4 md:p-8 transition-all duration-300" ref={topRef}>
  <div className="flex justify-center items-start">
    <div className="w-full max-w-7xl rounded-2xl p-6 bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
      {/* Success Message with animation */}
      {submitSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-800"
        >
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <span className="font-medium">
            {isEditing ? 'Job updated successfully!' : 'Job posted successfully!'}
          </span>
        </motion.div>
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
          to={isEditing ? '/hire/all-jobs' : '/hire/hiring'}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1.5 transition-colors duration-200"
        >
          <X className="h-5 w-5" />
          <span className="hidden sm:inline">Cancel</span>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Left Column - Job Details */}
        <div className="lg:w-2/3 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs h-full hover:shadow-sm transition-shadow duration-300"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Attachments Section */}
              <div className="pb-2 border-b border-blue-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <label className="block text-lg font-semibold text-gray-900 flex items-center">
                    <Paperclip className="h-5 w-5 text-blue-500 mr-2" />
                    Attachments
                    <span className="ml-2 text-sm font-normal text-gray-500">(Optional)</span>
                  </label>
                  
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-2 hover:border-blue-300 transition-colors duration-200">
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
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 space-y-2"
                  >
                    {files.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex items-center justify-between bg-white px-3 py-2 rounded-md border border-gray-200 hover:border-blue-300 transition-colors duration-200"
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
                          className="text-gray-400 hover:text-red-500 ml-2 focus:outline-none transition-colors duration-200"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Job Title & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Job Title<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 ${
                      errors.title ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                    }`}
                    placeholder="e.g. Senior Frontend Developer"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  {errors.title && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-red-600 flex items-center"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.title}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Company Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 ${
                      errors.company ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                    }`}
                    placeholder="Your company name"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                  {errors.company && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-red-600 flex items-center"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.company}
                    </motion.p>
                  )}
                </motion.div>
              </div>

              {/* Job Description */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 min-h-[75px] transition-all outline-none duration-200 ${
                    errors.description ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                  }`}
                  placeholder="Describe the job responsibilities and requirements"
                  value={formData.description}
                  onChange={handleInputChange}
                />
                {errors.description && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-sm text-red-600 flex items-center"
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.description}
                  </motion.p>
                )}
              </motion.div>

              {/* Combined Location, Job Type & Experience */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Location Field */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1.5">
    Location<span className="text-red-500">*</span>
  </label>
  <div className="relative">
    <input
      type="text"
      name="location"
      className={`w-full h-11 pl-12 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 ${
        errors.location ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
      }`}
      placeholder="e.g. New York, NY"
      value={formData.location}
      onChange={handleInputChange}
    />
  </div>
  {errors.location && (
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-1.5 text-sm text-red-600 flex items-center"
    >
      <AlertCircle className="h-4 w-4 mr-1" />
      {errors.location}
    </motion.p>
  )}
</div>

                {/* Job Type Field */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1.5">
    Job Type
  </label>
  <div className="relative">
    <select
      name="type"
      className={`w-full h-11 px-4 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 outline-none ${
        errors.type ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
      }`}
      value={formData.type}
      onChange={handleInputChange}
    >
      {jobTypes.map(type => (
        <option key={type} value={type}>{type}</option>
      ))}
    </select>
  </div>
  {errors.type && (
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-1.5 text-sm text-red-600 flex items-center"
    >
      <AlertCircle className="h-4 w-4 mr-1" />
      {errors.type}
    </motion.p>
  )}
</div>

{/* Experience Level Field */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1.5">
    Experience Level
  </label>
  <div className="relative">
    <select
      name="experience"
      className={`w-full h-11 px-4 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 outline-none ${
        errors.experience ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
      }`}
      value={formData.experience}
      onChange={handleInputChange}
    >
      {experienceLevels.map(level => (
        <option key={level} value={level}>{level}</option>
      ))}
    </select>
  </div>
  {errors.experience && (
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-1.5 text-sm text-red-600 flex items-center"
    >
      <AlertCircle className="h-4 w-4 mr-1" />
      {errors.experience}
    </motion.p>
  )}
</div>
              </motion.div>

              {/* Salary Range */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Salary Range<span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Min Salary */}
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        name="salaryMin"
                        className={`w-full h-11 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 ${
                          errors.salaryMin ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                        }`}
                        placeholder="Min Salary"
                        value={formData.salaryMin}
                        onChange={handleSalaryChange}
                      />
                    </div>
                    {errors.salaryMin && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1.5 text-sm text-red-600 flex items-center"
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.salaryMin}
                      </motion.p>
                    )}
                  </div>

                  {/* Max Salary */}
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="text"
                        name="salaryMax"
                        className={`w-full h-11 pl-10 pr-4 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 ${
                          errors.salaryMax ? 'border-red-300 focus:ring-red-200' : 'border-gray-300'
                        }`}
                        placeholder="Max Salary"
                        value={formData.salaryMax}
                        onChange={handleSalaryChange}
                      />
                    </div>
                    {errors.salaryMax && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1.5 text-sm text-red-600 flex items-center"
                      >
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.salaryMax}
                      </motion.p>
                    )}
                  </div>

                  {/* Period Selector */}
                  <div className="w-full">
                    <select
                      name="salaryPeriod"
                      className={`w-full h-11 px-4 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 ${
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
              </motion.div>

              {/* Skills Section */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-gray-700">
                  Skills Required<span className="text-red-500">*</span>
                </label>
                
                <div className="flex">
                  <input
                    type="text"
                    className="flex-grow px-4 py-2.5 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                    placeholder="e.g. React, Python, UX Design"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg transition-colors duration-200 flex items-center justify-center"
                    aria-label="Add skill"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
                
                {formData.skills.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-wrap gap-2 mt-2"
                  >
                    {formData.skills.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm transition-colors duration-200 hover:bg-blue-100"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-1.5 text-blue-500 hover:text-blue-700 focus:outline-none transition-colors duration-200"
                          aria-label={`Remove ${skill}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </form>
          </motion.div>
        </div>

        {/* Right Column - Hiring Settings */}
        <div className="lg:w-1/3 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs h-full hover:shadow-sm transition-shadow duration-300"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center">
              <Settings className="h-5 w-5 text-blue-500 mr-2" />
              Hiring Settings
            </h3>

            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-between"
              >
                <div>
                  <label htmlFor="autoStopEnabled" className="text-sm font-medium text-gray-700 cursor-pointer block">
                    Enable Auto Stop
                  </label>
                </div>
                <Switch
                  id="autoStopEnabled"
                  checked={autoStopSettings.enabled}
                  onChange={toggleAutoStop}
                  className={`${autoStopSettings.enabled ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200`}
                >
                  <span
                    className={`${autoStopSettings.enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}
                  />
                </Switch>
              </motion.div>

              {autoStopSettings.errors.general && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-start"
                >
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  {autoStopSettings.errors.general}
                </motion.div>
              )}

              {autoStopSettings.enabled && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5 pl-4 border-l-2 border-blue-100"
                >
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-2"
                  >
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
                      className={`block w-full px-3 py-2 border ${
                        autoStopSettings.errors?.applicationsCount ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm transition-all  outline-none duration-200`}
                      min="1"
                      placeholder="e.g. 100"
                    />
                    {autoStopSettings.errors?.applicationsCount && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500"
                      >
                        {autoStopSettings.errors.applicationsCount}
                      </motion.p>
                    )}
                    <p className="text-xs text-gray-500">Automatically closes after this number of applications.</p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-2"
                  >
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
                      className={`block w-full px-3 py-2 border ${
                        autoStopSettings.errors?.daysCount ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm transition-all outline-none duration-200`}
                      min="1"
                      placeholder="e.g. 30"
                    />
                    {autoStopSettings.errors?.daysCount && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500"
                      >
                        {autoStopSettings.errors.daysCount}
                      </motion.p>
                    )}
                    <p className="text-xs text-gray-500">Closes this many days after posting.</p>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-500 mr-2" />
                      <label htmlFor="autoStopDate" className="text-sm font-medium text-gray-700">
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
                        className={`block w-full px-3 py-2 border ${
                          autoStopSettings.errors?.specificDate ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm transition-all outline-none duration-200`}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      <CalendarIcon className="h-4 w-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                    {autoStopSettings.errors?.specificDate && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500"
                      >
                        {autoStopSettings.errors.specificDate}
                      </motion.p>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {/* Urgent Hiring Switch */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex items-center justify-between pt-4"
              >
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
                  className={`${formData.isUrgent ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200`}
                >
                  <span className={`${formData.isUrgent ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`} />
                </Switch>
              </motion.div>

              {/* Remote Position Switch */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-between"
              >
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
                  className={`${formData.isRemote ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200`}
                >
                  <span className={`${formData.isRemote ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`} />
                </Switch>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center mt-6 hover:shadow-md active:scale-95"
                onClick={handleSubmit}
                disabled={isSubmitting || submitSuccess}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    {isEditing ? 'Updating...' : 'Posting...'}
                  </>
                ) : (
                  isEditing ? 'Update Job' : 'Post Job Now'
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </div>
</div>
  );
};

export default PostJob;