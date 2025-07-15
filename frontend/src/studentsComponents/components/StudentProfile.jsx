import { useState, useEffect, useContext } from "react";
import { FileText, Upload, X, Edit2, Check } from "lucide-react";
import Header from "./header/Header";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { apiUrl } from "../../utilits/apiUrl";
import Cookies from "js-cookie";
import { UserDetailsContext } from "../contexts/UserDetailsContext";

export default function StudentProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [isParentEditing, setIsParentEditing] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const { username, setUserName, userBio, setUserBio } =
    useContext(UserDetailsContext);

  console.log(username, "username");
  const initialStudentDetails = {
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    address: "",
    skills: "",
    whatsapp: "",
    about: "",
  };

  const initialParentDetails = {
    name: "",
    phone: "",
    relation: "",
    email: "",
  };

  const [studentDetails, setStudentDetails] = useState(initialStudentDetails);
  const [parentDetails, setParentDetails] = useState(initialParentDetails);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get("jwtToken");
        console.log(token, "token");
        const userDetails = Cookies.get("userDetails");
        const res = await axios.get(`${apiUrl}/jobseeker/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data;

        console.log(data, "data");

        // Optional: You may need to transform keys to match existing state structure
        setStudentDetails((prev) => ({
          ...prev,
          name: data.username,
          email: data.email,
          phone: data.phone,
          gender: data.gender,
          address: data.address,
          skills: data.skills,
          whatsapp: data.whatsapp,
          about: data.bio,
        }));

        setParentDetails({
          name: data?.parentDetails?.name,
          phone: data?.parentDetails?.phone,
          relation: data?.parentDetails?.relation,
          email: data?.parentDetails?.email,
        });

        setUserName(data.username);
        setUserBio(data.bio);
        // if (data?.resume_filepath) {
        //   setResumePreview(data?.resume_filepath);
        //   setResumeFile({ name: data.resume_filepath });
        // }
      } catch (err) {
        console.error("Failed to load profile:", err);
        toast.error("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = Cookies.get("jwtToken");
        if (!token) throw new Error("Token missing");

        const res = await axios.get(`${apiUrl}/jobseeker/profile/resume`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { resumeUrl } = res.data;
        if (!resumeUrl) throw new Error("Resume URL missing");

        const fileName = resumeUrl.split("/").pop();
        console.log(resumeUrl, "resumeUrl");
        setResumePreview(`${apiUrl}${resumeUrl}`); // Show PDF
        setResumeFile({ name: fileName }); // Show name below
      } catch (error) {
        console.error("Resume fetch failed:", error);
        toast.error("Resume not found or failed to load.");
      }
    };
    fetchResume();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!studentDetails.name?.trim())
      newErrors.studentName = "Name is required";
    if (!studentDetails.email?.trim())
      newErrors.studentEmail = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(studentDetails.email))
      newErrors.studentEmail = "Email is invalid";
    if (!studentDetails.phone?.trim())
      newErrors.studentPhone = "Phone is required";
    if (!studentDetails.gender) newErrors.studentGender = "Gender is required";
    if (!studentDetails.address?.trim())
      newErrors.studentAddress = "Address is required";
    if (!studentDetails.skills?.trim())
      newErrors.studentSkills = "Skills are required";
    if (!studentDetails.whatsapp?.trim())
      newErrors.studentWhatsapp = "WhatsApp number is required";
    if (!studentDetails.about?.trim()) {
      newErrors.studentAbout = "About is required";
    } else if (
      studentDetails.about.length < 500 ||
      studentDetails.about.length > 5000
    ) {
      newErrors.studentAbout = "About must be between 500 and 5000 characters";
    }

    if (!parentDetails.name?.trim())
      newErrors.parentName = "Parent name is required";
    if (!parentDetails.phone?.trim())
      newErrors.parentPhone = "Parent phone is required";
    if (!parentDetails.relation)
      newErrors.parentRelation = "Relation is required";
    if (!parentDetails.email?.trim())
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
    const fieldName = name.replace("parent", "").toLowerCase();
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

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumeFile(file);
    setResumePreview(URL.createObjectURL(file));
    if (errors.resume) {
      setErrors((prev) => ({ ...prev, resume: "" }));
    }

    try {
      const token = Cookies.get("jwtToken");
      if (!token) throw new Error("Missing auth token.");

      const formData = new FormData();
      formData.append("resume", file);

      const res = await axios.post(
        `${apiUrl}/jobseeker/profile/resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { resumeUrl, message } = res.data;
      setResumePreview(`${apiUrl}${resumeUrl}`);
      toast.success(message || "Resume uploaded successfully.");
    } catch (err) {
      console.error("Resume upload error:", err);
      toast.error("Failed to upload resume. Please try again.");
    }
  };

  const studentUpdate = async (e) => {
    e.preventDefault();
    console.log(isEditing, "isSubmitting");
    // if (isSubmitting === false) return;
    if (isEditing === true) {
      // if (validateForm()) {
      //   console.log("Student Details:", studentDetails);
      // }
      try {
        const token = Cookies.get("jwtToken");

        // Utility to convert "null", null, or undefined to empty string
        const sanitize = (val) =>
          val === "null" || val === null || val === undefined ? "" : val;

        const payload = {
          username: sanitize(studentDetails.name),
          phone: sanitize(studentDetails.phone),
          gender: sanitize(studentDetails.gender),
          address: sanitize(studentDetails.address),
          whatsapp: sanitize(studentDetails.whatsapp),
          bio: sanitize(studentDetails.about),
          portfolio: sanitize(studentDetails.portfolio),
          education: sanitize(studentDetails.education),
          experience_years: parseInt(studentDetails.experienceYears || "0", 10),
          skills: sanitize(studentDetails.skills),
          parentDetails: {
            name: sanitize(parentDetails.name),
            phone: sanitize(parentDetails.phone),
            relation: sanitize(parentDetails.relation),
            email: sanitize(parentDetails.email),
          },
        };

        const response = await axios.patch(
          `${apiUrl}/jobseeker/profile`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setUserName(response?.data?.profile?.username);
        setUserBio(response?.data?.profile?.bio);

        console.log("✅ Updated Profile:", response.data.profile);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } catch (err) {
        console.error("❌ Profile update failed:", err);
        setIsEditing(false);
        toast.error(
          err?.response?.data?.errors?.[0] || "Failed to update profile."
        );
      }
    } else {
      setIsEditing(false);
      // setIsSubmitting(false);
      setIsSubmitting(!isSubmitting);
      console.log(isSubmitting, "isSubmitting");
    }
  };

  const parentUpdate = async (e) => {
    e.preventDefault();
    console.log(isParentEditing, "isSubmitting");
    if (isParentEditing === true) {
      // if (validateForm()) {
      //   console.log("Student Details:", studentDetails);
      // }
      try {
        const token = Cookies.get("jwtToken");

        // Utility to convert "null", null, or undefined to empty string
        const sanitize = (val) =>
          val === "null" || val === null || val === undefined ? "" : val;

        const payload = {
          username: sanitize(studentDetails.name),
          phone: sanitize(studentDetails.phone),
          gender: sanitize(studentDetails.gender),
          address: sanitize(studentDetails.address),
          whatsapp: sanitize(studentDetails.whatsapp),
          bio: sanitize(studentDetails.about),
          portfolio: sanitize(studentDetails.portfolio),
          education: sanitize(studentDetails.education),
          experience_years: parseInt(studentDetails.experienceYears || "0", 10),
          skills: sanitize(studentDetails.skills),
          parentDetails: {
            name: sanitize(parentDetails.name),
            phone: sanitize(parentDetails.phone),
            relation: sanitize(parentDetails.relation),
            email: sanitize(parentDetails.email),
          },
        };

        const response = await axios.patch(
          `${apiUrl}/jobseeker/profile`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Updated Profile:", response.data.profile);
        setIsParentEditing(false);
        toast.success("Profile updated successfully!");
      } catch (err) {
        console.error("❌ Profile update failed:", err);
        setIsParentEditing(false);
        toast.error(
          err?.response?.data?.errors?.[0] || "Failed to update profile."
        );
      }
    } else {
      setIsEditing(false);
      // setIsSubmitting(false);
      setIsSubmitting(!isSubmitting);
      console.log(isSubmitting, "isSubmitting");
    }
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
    const isNonEditable =
      !isParentField && ["name", "email", "phone"].includes(name);
    const currentEditingState = isParentField ? isParentEditing : isEditing;

    if (name === "password") {
      return isEditing ? (
        <div className="mb-3 sm:mb-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            {label} *
          </label>
          <button
            type="button"
            onClick={() => navigate("/reset-password")}
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
            onChange={isParentField ? handleParentChange : handleStudentChange}
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
                isParentField ? handleParentChange : handleStudentChange
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
                    const emailChanged =
                      studentDetails.email !== initialStudentDetails.email;
                    const emailRegex = /^\S+@\S+\.\S+$/;
                    if (emailChanged && emailRegex.test(studentDetails.email)) {
                      toast.success(
                        "Please verify your new email address with the OTP sent to it."
                      );
                      setTimeout(() => {
                        navigate("/verify-email-otp", {
                          state: { email: studentDetails.email },
                        });
                      }, 1500);
                    } else if (
                      emailChanged &&
                      !emailRegex.test(studentDetails.email)
                    ) {
                      setErrors((prev) => ({
                        ...prev,
                        email: "Email is invalid",
                      }));
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
          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors[name]}</p>
        )}
        {name === "about" && (
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            {value?.length} / 5000 characters
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
            <form
              onSubmit={(event) => event.preventDefault()}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.type !== "textarea") {
                  e.preventDefault();
                }
              }}
            >
              <div className="bg-[#0F52BA] text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg mb-3 sm:mb-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Student Details
                  </h3>
                  {isEditing ? (
                    <button
                      onClick={studentUpdate}
                      className="flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white text-[#0F52BA] hover:bg-blue-50 text-sm"
                    >
                      <>
                        <Check size={16} />
                        <span>Done</span>
                      </>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white text-[#0F52BA] hover:bg-blue-50 text-sm"
                    >
                      {" "}
                      <>
                        <Edit2 size={16} />
                        <span>Edit</span>
                      </>
                    </button>
                  )}
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
                          onChange={(e) => {
                            handleStudentChange(e);
                            // Real-time validation
                            const emailRegex = /^\S+@\S+\.\S+$/;
                            if (!emailRegex.test(e.target.value)) {
                              setErrors((prev) => ({
                                ...prev,
                                email: "Please enter a valid email address.",
                              }));
                            } else {
                              setErrors((prev) => ({ ...prev, email: "" }));
                            }
                          }}
                          pattern="^\\S+@\\S+\\.\\S+$"
                          className={`w-full px-3 sm:px-4 py-1 sm:py-2 rounded-lg border ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          } focus:outline-none focus:ring-2 focus:ring-[#0F52BA] focus:border-transparent text-sm sm:text-base ${
                            !isEmailEditing ? "bg-gray-50" : "bg-white"
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
                              const emailChanged =
                                studentDetails.email !==
                                initialStudentDetails.email;
                              const emailRegex = /^\S+@\S+\.\S+$/;
                              if (
                                emailChanged &&
                                emailRegex.test(studentDetails.email)
                              ) {
                                toast.success(
                                  "Please verify your new email address with the OTP sent to it."
                                );
                                setTimeout(() => {
                                  navigate("/verify-email-otp", {
                                    state: { email: studentDetails.email },
                                  });
                                }, 1500);
                              } else if (
                                emailChanged &&
                                !emailRegex.test(studentDetails.email)
                              ) {
                                setErrors((prev) => ({
                                  ...prev,
                                  email: "Email is invalid",
                                }));
                              }
                              setIsEmailEditing(false);
                            } else {
                              setIsEmailEditing(true);
                            }
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#0F52BA] transition-colors"
                          disabled={isEmailEditing && !!errors.email}
                        >
                          {isEmailEditing ? (
                            <Check size={16} />
                          ) : (
                            <Edit2 size={16} />
                          )}
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
                            <span className="text-red-600 font-bold mr-1">
                              *
                            </span>
                            This field requires OTP verification when changed.
                          </span>
                        </div>
                      )}
                    </div>
                    {renderInput(
                      "Password",
                      "password",
                      studentDetails.password
                    )}
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

                  {isParentEditing ? (
                    <button
                      onClick={parentUpdate}
                      className="flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white text-[#0F52BA] hover:bg-blue-50 text-sm"
                    >
                      <Check size={16} />
                      <span>Done</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsParentEditing(!isParentEditing)}
                      className="flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white text-[#0F52BA] hover:bg-blue-50 text-sm"
                    >
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </button>
                  )}
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
                      className="w-full h-full min-h-[90vh] border border-gray-200"
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
