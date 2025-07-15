import { useNavigate } from "react-router-dom";
import { Briefcase, MapPin, Brain, ArrowRight, Star, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const dummyJobs = Array(15)
  .fill(0)
  .map((_, i) => ({
    id: i + 1,
    role: ["UI/UX Designer", "Graphic Designer", "Frontend Dev", "Motion Designer"][i % 4],
    company: ["Google", "Spotify", "Tesla", "Netflix"][i % 4],
    location: i % 2 === 0 ? "Remote" : "Onsite",
    experience: ["Junior", "Mid-Level", "Senior"][i % 3],
    salary: 3000 + i * 250,
    posted: `2025-04-${(i % 28) + 1}`,
    level: ["Full-time", "Part-time", "Contract"][(i + 1) % 3],
    urgent: i % 3 === 0,
    rating: 4.5 + (Math.random() * 0.5),
    applicants: 20 + Math.floor(Math.random() * 50),
    skills: [["React", "Figma", "UI/UX"], ["Design", "Adobe", "Creative"], ["JavaScript", "React", "Node"], ["Animation", "Motion", "Design"]][i % 4]
  }));

export default function JobBoard() {
  const navigate = useNavigate();
  const [hoveredJob, setHoveredJob] = useState(null);
  const [showAllMobile, setShowAllMobile] = useState(false);

  return (
    <div className="min-h-screen bg-blue-20 px-3 sm:px-4 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
        Recommended <span className="text-blue-600">Jobs</span>
      </h1>

      {/* Desktop View */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {dummyJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            hoveredJob={hoveredJob}
            setHoveredJob={setHoveredJob}
            navigate={navigate}
          />
        ))}
      </div>

      {/* Mobile View */}
      <div className="sm:hidden grid grid-cols-1 gap-4">
        {(showAllMobile ? dummyJobs : dummyJobs.slice(0, 5)).map((job) => (
          <JobCard
            key={job.id}
            job={job}
            hoveredJob={hoveredJob}
            setHoveredJob={setHoveredJob}
            navigate={navigate}
          />
        ))}
        {dummyJobs.length > 5 && (
          <button
            onClick={() => setShowAllMobile((prev) => !prev)}
            className="mx-auto mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 text-sm"
          >
            {showAllMobile ? "Show Less" : "Show More Jobs"}
          </button>
        )}
      </div>

      {/* Desktop CTA Button */}
      <div className="text-center mt-10 sm:mt-14 hidden sm:block">
        <motion.button
          onClick={() => navigate("/apply-for-jobs")}
          className="px-5 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
          whileHover={{
            scale: 1.02,
            y: -1,
            boxShadow: "0 6px 20px rgba(59, 130, 246, 0.3), 0 4px 8px rgba(59, 130, 246, 0.2)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center gap-2 font-semibold">
            Show More Jobs
            <ArrowRight size={16} />
          </span>
        </motion.button>
      </div>
    </div>
  );
}

const JobCard = ({ job, hoveredJob, setHoveredJob, navigate }) => (
  <div
    className="group relative"
    onMouseEnter={() => setHoveredJob(job.id)}
    onMouseLeave={() => setHoveredJob(null)}
  >
    <motion.div
      className="absolute inset-0 bg-blue-100 rounded-xl sm:rounded-2xl opacity-0"
      animate={{
        opacity: hoveredJob === job.id ? 0.3 : 0,
      }}
      transition={{ duration: 0.3 }}
    />
    <motion.div
      className="absolute inset-0 bg-blue-400 rounded-xl sm:rounded-2xl opacity-0 blur-md"
      animate={{
        opacity: hoveredJob === job.id ? 0.15 : 0,
        scale: hoveredJob === job.id ? 1.02 : 1,
      }}
      transition={{ duration: 0.3 }}
    />

    <div className="group relative bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-4 sm:p-6 flex flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-md sm:hover:shadow-xl overflow-hidden">
      {job.urgent && (
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-orange-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10 shadow-md">
          🔥 Urgent
        </div>
      )}

      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <div className="flex items-center gap-1">
          <Star size={12} className="text-yellow-500 fill-current" />
          <span className="text-xs sm:text-sm font-medium">{job.rating.toFixed(1)}</span>
        </div>
        <span className="text-gray-400">•</span>
        <div className="flex items-center gap-1">
          <Users size={10} className="text-gray-400" />
          <span className="text-xs sm:text-sm text-gray-600">{job.applicants} applied</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1 sm:mb-2">
          <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
            <Clock size={10} />
            {job.posted}
          </p>
          <div className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
            {job.level}
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-blue-800 mb-1 flex items-center gap-2">
          <Briefcase size={16} className="text-blue-600" />
          {job.role}
        </h2>

        <p className="text-blue-600 mb-1 sm:mb-2 font-medium text-sm sm:text-base">{job.company}</p>

        <div className="text-xs sm:text-sm text-gray-700 space-y-1 mt-1 sm:mt-2">
          <p className="flex items-center gap-2">
            <MapPin size={14} className="text-blue-500" />
            <span>{job.location}</span>
          </p>
          <p className="flex items-center gap-2">
            <Brain size={14} className="text-blue-500" />
            <span>{job.experience}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-3">
          {job.skills.map((skill, i) => (
            <span
              key={i}
              className="bg-gray-100 text-gray-700 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 sm:mt-6">
        <p className="text-blue-600 font-semibold text-xs sm:text-sm flex items-center gap-1">
          <span>₹{job.salary}/mo</span>
        </p>
        <button
          className="bg-blue-600 text-white text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center gap-1 sm:gap-2 shadow-sm sm:shadow-md"
          onClick={() => navigate(`/jobs/details/${job.id}`)}
        >
          <span className="flex items-center gap-1 sm:gap-2">
            View Details
            <ArrowRight size={12} />
          </span>
        </button>
      </div>
    </div>
  </div>
);