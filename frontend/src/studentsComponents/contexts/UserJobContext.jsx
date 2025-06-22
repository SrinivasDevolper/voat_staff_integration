import { createContext, useState, useEffect, useContext } from "react";
import { mockJobs } from "../../utilits/mockJobs";

export const UserJobContext = createContext();

export const useUserJobContext = () => {
  return useContext(UserJobContext);
};

export const UserJobProvider = ({ children }) => {
  const [userJob, setUserJob] = useState(null);
  const [searchRole, setSearchRole] = useState("");
  const [searchExperience, setSearchExperience] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [datePosted, setDatePosted] = useState("All");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setIsLoading(false);
    }, 800);
  }, []);

  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  };

  const handleApplyNow = (jobId) => {
    const jobToApply = mockJobs.find((job) => job.id === jobId);

    // Check if job is already applied
    const isAlreadyApplied = appliedJobs.some((job) => job.id === jobId);

    if (!isAlreadyApplied && jobToApply) {
      // Add eligibility criteria and required skills based on job type
      const jobRequirements = {
        "Software / Web Developer Intern": {
          eligibility: "Basic knowledge of HTML, CSS, JavaScript, and React. Currently pursuing or completed degree in Computer Science or related field.",
          requiredSkills: "• HTML5 and CSS3 fundamentals\n• Basic JavaScript and React concepts\n• Understanding of responsive design\n• Version control (Git)\n• Basic problem-solving skills"
        },
        "Frontend Developer": {
          eligibility: "2+ years of experience with React, JavaScript, and CSS. Strong understanding of modern frontend frameworks and responsive design.",
          requiredSkills: "• Advanced React.js and JavaScript\n• CSS3 and modern styling solutions\n• State management (Redux/Context)\n• RESTful APIs integration\n• Performance optimization\n• Testing frameworks (Jest/React Testing Library)"
        },
        "Backend Engineer": {
          eligibility: "3+ years of experience with Node.js, MongoDB, and Express. Strong understanding of RESTful APIs and database design.",
          requiredSkills: "• Node.js and Express.js\n• MongoDB and database design\n• RESTful API development\n• Authentication and authorization\n• Microservices architecture\n• Cloud platforms (AWS/Azure)"
        }
      };

      const jobWithRequirements = {
        ...jobToApply,
        eligibility: jobRequirements[jobToApply.title]?.eligibility || "Experience in relevant technologies and strong problem-solving skills.",
        requiredSkills: jobRequirements[jobToApply.title]?.requiredSkills || "• Strong technical background\n• Problem-solving abilities\n• Team collaboration\n• Communication skills"
      };

      setAppliedJobs((prev) => [...prev, jobWithRequirements]);
      setSelectedJob(null);
    } else {
      console.warn("Job already applied or not found");
    }
  };

  // Optional: Function to remove a job from applied jobs
  const removeAppliedJob = (jobId) => {
    setAppliedJobs((prev) => prev.filter((job) => job.id !== jobId));
  };

  return (
    <UserJobContext.Provider
      value={{
        userJob,
        setUserJob,
        searchRole,
        setSearchRole,
        searchExperience,
        setSearchExperience,
        searchLocation,
        setSearchLocation,
        activeFilters,
        setActiveFilters,
        datePosted,
        setDatePosted,
        urgentOnly,
        setUrgentOnly,
        savedJobs,
        setSavedJobs,
        isLoading,
        setIsLoading,
        jobs,
        setJobs,
        filteredJobs,
        setFilteredJobs,
        selectedJob,
        setSelectedJob,
        currentPage,
        setCurrentPage,
        getDaysAgo,
        appliedJobs,
        handleApplyNow,
        removeAppliedJob, // Optional: if you want to allow removing applied jobs
      }}
    >
      {children}
    </UserJobContext.Provider>
  );
};
