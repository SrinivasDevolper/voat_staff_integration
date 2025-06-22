import { useState, useEffect } from "react";
import { FileText, Upload, X, Edit2, Check } from "lucide-react";
import Header from "./header/Header";
import { useNavigate, useLocation } from "react-router-dom";
import toast from 'react-hot-toast';



export default function StudentProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [isParentEditing, setIsParentEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);

  const initialStudentDetails = {
    name: "Shivam Dubey",
    email: "shivam.dubey@example.com",
    password: "********",
    phone: "+91 9876543210",
    gender: "Male",
    address: "123 Main Street, Mumbai, India",
    skills: "React, JavaScript, TypeScript, Node.js",
    whatsapp: "+91 9876543210",
    about: "I am a passionate computer science student with a keen interest in web development and software engineering.",
  };

  const initialParentDetails = {
    name: "Rajesh Dubey",
    phone: "+91 9876543211",
    relation: "Father",
    email: "rajesh.dubey@example.com",
  };

  const [studentDetails, setStudentDetails] = useState(initialStudentDetails);
  const [parentDetails, setParentDetails] = useState(initialParentDetails);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update email from localStorage if it changes (e.g., after OTP verification)
  useEffect(() => {
    const storedEmail = localStorage.getItem('studentEmail');
    if (storedEmail && storedEmail !== studentDetails.email) {
      setStudentDetails(prev => ({ ...prev, email: storedEmail }));
    }
  }, [location]);

  const validateForm = () => {
    const newErrors = {};

    if (!studentDetails.name.trim()) newErrors.studentName = "Name is required";
    if (!studentDetails.email.trim())
      newErrors.studentEmail = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(studentDetails.email))
      newErrors.studentEmail = "Email is invalid";
    if (!studentDetails.phone.trim())
      newErrors.studentPhone = "Phone is required";
    if (!studentDetails.gender) newErrors.studentGender = "Gender is required";
    if (!studentDetails.address.trim())
      newErrors.studentAddress = "Address is required";
    if (!studentDetails.skills.trim())
      newErrors.studentSkills = "Skills are required";
    if (!studentDetails.whatsapp.trim())
      newErrors.studentWhatsapp = "WhatsApp number is required";
    if (!studentDetails.about.trim()) {
      newErrors.studentAbout = "About is required";
    } else if (studentDetails.about.length < 500 || studentDetails.about.length > 5000) {
      newErrors.studentAbout = "About must be between 500 and 5000 characters";
    }

    if (!parentDetails.name.trim())
      newErrors.parentName = "Parent name is required";
    if (!parentDetails.phone.trim())
      newErrors.parentPhone = "Parent phone is required";
    if (!parentDetails.relation)
      newErrors.parentRelation = "Relation is required";
    if (!parentDetails.email.trim())
      newErrors.parentEmail = "Parent email is required";
    else if (!/^\S+@\S+\.\S+$/.test(parentDetails.email))
      newErrors.parentEmail = "Parent email is invalid";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[`student${name.charAt(0).toUpperCase() + name.slice(1)}`]) {
      setErrors((prev) => ({
        ...prev,
        [`student${name.charAt(0).toUpperCase() + name.slice(1)}`]: "",
      }));
    }
  };

  const handleParentChange = (e) => {
    const { name, value } = e.target;
    const fieldName = name.replace('parent', '').toLowerCase();
    setParentDetails((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      const previewURL = URL.createObjectURL(file);
      setResumePreview(previewURL);

      if (errors.resume) {
        setErrors((prev) => ({ ...prev, resume: "" }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      console.log("Student Details:", studentDetails);
      console.log("Parent Details:", parentDetails);
      console.log("Resume File:", resumeFile);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setIsParentEditing(false);
      setIsEmailEditing(false);
    }

    setIsSubmitting(false);
  };

  const renderField = (label, value) => (
    <div className="mb-3 sm:mb-4">
      <label className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">
        {label}
      </label>
      <p className="text-sm sm:text-base text-gray-900">{value}</p>
    </div>
  );

  const renderInput = (label, name, value, type = "text", options = null) => {
    const isParentField = name.startsWith("parent");
    const isNonEditable = !isParentField && ["name", "email", "phone"].includes(name);
    const currentEditingState = isParentField ? isParentEditing : isEditing;

   if (name === "password") {
  return isEditing ? (
    <div className="mb-3 sm:mb-4">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
        {label} *
      </label>
      <button
        type="button"
        onClick={() => navigate("/changePassword")}
        className="px-4 sm:px-5 py-2 bg-[#0F52BA] text-white rounded-lg hover:bg-[#1565C0] transition-colors text-sm sm:text-base"
      >
        Update Password
      </button>
    </div>
  ) : null;
}


    return (
      <div className="mb-3 sm:mb-4" key={name}>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {label} *
        </label>
        {type === "select" ? (
          <select
            name={name}
            value={value}
            onChange={
              isParentField
                ? handleParentChange
                : handleStudentChange
            }
            className={`w-full px-3 sm:px-4 py-1 sm:py-2 rounded-lg border ${
              errors[name] ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-[#0F52BA] focus:border-transparent text-sm sm:text-base`}
            disabled={!currentEditingState || isNonEditable}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            name={name}
            value={value}
            onChange={handleStudentChange}
            className={`w-full px-3 sm:px-4 py-1 sm:py-2 rounded-lg border ${
              errors[name] ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-[#0F52BA] focus:border-transparent text-sm sm:text-base min-h-[200px]`}
            disabled={!currentEditingState || isNonEditable}
            placeholder={`Enter ${label.toLowerCase()} (500-5000 characters)`}
          />
        ) : (
          <div className="relative">
            <input
              type={type}
              name={name}
              value={value}
              onChange={
                isParentField
                  ? handleParentChange
                  : handleStudentChange
              }
              className={`w-full px-3 sm:px-4 py-1 sm:py-2 rounded-lg border ${
                errors[name] ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#0F52BA] focus:border-transparent text-sm sm:text-base`}
              disabled={!currentEditingState || isNonEditable}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
            {name === "email" && (
              <button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  if (isEmailEditing) {
                    const emailChanged = studentDetails.email !== initialStudentDetails.email;
                    const emailRegex = /^\S+@\S+\.\S+$/;
                    if (emailChanged && emailRegex.test(studentDetails.email)) {
                      toast.success('Please verify your new email address with the OTP sent to it.');
                      setTimeout(() => {
                        navigate('/verify-email-otp', { state: { email: studentDetails.email } });
                      }, 1500);
                    } else if (emailChanged && !emailRegex.test(studentDetails.email)) {
                      setErrors((prev) => ({ ...prev, email: 'Email is invalid' }));
                    }
                    setIsEmailEditing(false);
                  } else {
                    setIsEmailEditing(true);
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0F52BA] transition-colors"
              >
                {isEmailEditing ? <Check size={16} /> : <Edit2 size={16} />}
              </button>
            )}
          </div>
        )}
        {errors[name] && (
          <p className="mt-1 text-xs sm:text-sm text-red-600">
            {errors[name]}
          </p>
        )}
        {name === "about" && (
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            {value.length} / 5000 characters
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="flex">
      <Header />
      <div className="flex-1 h-screen overflow-y-auto px-4 sm:px-6 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md">
            <form onSubmit={handleSubmit} onKeyDown={e => {
              if (e.key === 'Enter' && e.target.type !== 'textarea') {
                e.preventDefault();
              }
            }}>
              <div className="bg-[#0F52BA] text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg mb-3 sm:mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Student Details
                  </h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white text-[#0F52BA] hover:bg-blue-50 text-sm"
                  >
                    {isEditing ? (
                      <>
                        <Check size={16} />
                        <span>Done</span>
                      </>
                    ) : (
                      <>
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {renderInput("Name", "name", studentDetails.name)}
                    <div className="relative mb-3 sm:mb-4">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={studentDetails.email}
                          onChange={e => {
                            handleStudentChange(e);
                            // Real-time validation
                            const emailRegex = /^\S+@\S+\.\S+$/;
                            if (!emailRegex.test(e.target.value)) {
                              setErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
                            } else {
                              setErrors(prev => ({ ...prev, email: '' }));
                            }
                          }}
                          pattern="^\\S+@\\S+\\.\\S+$"
                          className={`w-full px-3 sm:px-4 py-1 sm:py-2 rounded-lg border ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-[#0F52BA] focus:border-transparent text-sm sm:text-base ${
                            !isEmailEditing ? 'bg-gray-50' : 'bg-white'
                          }`}
                          disabled={!isEmailEditing}
                          placeholder="Enter email"
                          autoComplete="off"
                          required
                        />
                        <button
                          type="button"
                          onClick={async (e) => {
                            e.preventDefault();
                            if (isEmailEditing) {
                              const emailChanged = studentDetails.email !== initialStudentDetails.email;
                              const emailRegex = /^\S+@\S+\.\S+$/;
                              if (emailChanged && emailRegex.test(studentDetails.email)) {
                                toast.success('Please verify your new email address with the OTP sent to it.');
                                setTimeout(() => {
                                  navigate('/verify-email-otp', { state: { email: studentDetails.email } });
                                }, 1500);
                              } else if (emailChanged && !emailRegex.test(studentDetails.email)) {
                                setErrors((prev) => ({ ...prev, email: 'Email is invalid' }));
                              }
                              setIsEmailEditing(false);
                            } else {
                              setIsEmailEditing(true);
                            }
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0F52BA] transition-colors"
                          disabled={isEmailEditing && !!errors.email}
                        >
                          {isEmailEditing ? <Check size={16} /> : <Edit2 size={16} />}
                        </button>
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs sm:text-sm text-red-600">
                          {errors.email}
                        </p>
                      )}
                      {isEmailEditing && (
                        <div className="mt-1 flex flex-col items-start">
                          <div className="w-full h-0.5 bg-red-500 rounded-full mb-1" />
                          <span className="text-xs text-red-600 font-medium italic">
                            <span className="text-red-600 font-bold mr-1">*</span>
                            This field requires OTP verification when changed.
                          </span>
                        </div>
                      )}
                    </div>
                    {renderInput("Password", "password", studentDetails.password)}
                    {renderInput(
                      "Phone Number",
                      "phone",
                      studentDetails.phone,
                      "tel"
                    )}
                    {renderInput(
                      "Gender",
                      "gender",
                      studentDetails.gender,
                      "select",
                      ["Male", "Female", "Other"]
                    )}
                    {renderInput("Address", "address", studentDetails.address)}
                    {renderInput("Skills", "skills", studentDetails.skills)}
                    {renderInput(
                      "WhatsApp No.",
                      "whatsapp",
                      studentDetails.whatsapp,
                      "tel"
                    )}
                  </div>
                  <div className="mt-4">
                    {renderInput(
                      "About",
                      "about",
                      studentDetails.about,
                      "textarea"
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {renderField("Name", studentDetails.name)}
                    {renderField("Email", studentDetails.email)}
                    {renderField("Phone Number", studentDetails.phone)}
                    {renderField("Gender", studentDetails.gender)}
                    {renderField("Address", studentDetails.address)}
                    {renderField("Skills", studentDetails.skills)}
                    {renderField("WhatsApp No.", studentDetails.whatsapp)}
                  </div>
                  <div className="mt-4">
                    {renderField("About", studentDetails.about)}
                  </div>
                </>
              )}

              <div className="bg-[#0F52BA] text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg mb-3 sm:mb-4 mt-6 sm:mt-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Parent Details
                  </h3>
                  <button
                    onClick={() => setIsParentEditing(!isParentEditing)}
                    className="flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white text-[#0F52BA] hover:bg-blue-50 text-sm"
                  >
                    {isParentEditing ? (
                      <>
                        <Check size={16} />
                        <span>Done</span>
                      </>
                    ) : (
                      <>
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isParentEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {renderInput("Parent Name", "parentName", parentDetails.name)}
                  {renderInput(
                    "Phone/WhatsApp No.",
                    "parentPhone",
                    parentDetails.phone,
                    "tel"
                  )}
                  {renderInput(
                    "Relation",
                    "parentRelation",
                    parentDetails.relation,
                    "select",
                    ["Father", "Mother", "Guardian"]
                  )}
                  {renderInput(
                    "Email",
                    "parentEmail",
                    parentDetails.email,
                    "email"
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {renderField("Parent Name", parentDetails.name)}
                  {renderField("Phone/WhatsApp No.", parentDetails.phone)}
                  {renderField("Relation", parentDetails.relation)}
                  {renderField("Email", parentDetails.email)}
                </div>
              )}
            </form>
          </div>

          {/* Resume Upload Section */}
          <div className="bg-white -order-1 md:order-1 rounded-xl p-4 sm:p-6 shadow-md">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
              Resume
            </h2>
            <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] lg:min-h-[700px] border-2 border-dashed border-blue-200 rounded-xl bg-blue-50 p-4 sm:p-6">
              {resumePreview ? (
                <div className="w-full h-full flex flex-col items-center">
                  <div className="relative w-full flex-1 mb-3 sm:mb-4">
                    <iframe
                      src={resumePreview}
                      className="w-full h-full min-h-[300px] border border-gray-200"
                      title="Resume Preview"
                    />
                  </div>
                  <div className="flex items-center">
                    <FileText size={20} className="text-[#0F52BA] mr-2" />
                    <p className="text-gray-600 text-sm sm:text-base">
                      {resumeFile.name}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setResumeFile(null);
                      setResumePreview(null);
                    }}
                    className="mt-3 text-red-500 text-xs sm:text-sm hover:text-red-700 flex items-center"
                  >
                    <X size={16} className="mr-1" />
                    Remove Resume
                  </button>
                </div>
              ) : (
                <>
                  <FileText size={60} className="text-[#0F52BA] mb-4 sm:mb-6" />
                  <p className="text-gray-600 mb-4 sm:mb-6 text-center max-w-md text-sm sm:text-base">
                    Upload your resume
                  </p>
                  <label className="px-6 sm:px-8 py-2 sm:py-3 bg-white border-2 border-[#0F52BA] text-[#0F52BA] rounded-full hover:bg-blue-50 transition-colors font-medium shadow-sm text-xs sm:text-sm cursor-pointer flex items-center gap-2">
                    <Upload size={20} />
                    <span>Upload Resume</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf, .doc, .docx"
                      onChange={handleResumeUpload}
                    />
                  </label>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
