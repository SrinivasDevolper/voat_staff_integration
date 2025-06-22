import { useNavigate } from "react-router-dom";
import { Briefcase, MapPin, Brain, ArrowRight, Star, Clock, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function JobBoard() {
  const navigate = useNavigate();
  const [hoveredJob, setHoveredJob] = useState(null);

  return (
    <div className="min-h-screen bg-blue-20 px-4 py-12">
      <motion.h1 
        className="text-4xl font-bold text-center mb-12 text-gray-800"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Recommended <span className="text-blue-600">Jobs</span>
      </motion.h1>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {dummyJobs.map((job, index) => (
          <motion.div
            key={job.id}
            className="group relative"
            variants={itemVariants}
            whileHover={{ 
              y: -4,
              transition: { duration: 0.3 }
            }}
            onHoverStart={() => setHoveredJob(job.id)}
            onHoverEnd={() => setHoveredJob(null)}
          >
            {/* Subtle Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-blue-100 rounded-2xl opacity-0"
              animate={{
                opacity: hoveredJob === job.id ? 0.3 : 0,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Blue Glow Shadow */}
            <motion.div
              className="absolute inset-0 bg-blue-400 rounded-2xl opacity-0 blur-md"
              animate={{
                opacity: hoveredJob === job.id ? 0.15 : 0,
                scale: hoveredJob === job.id ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Main Card */}
            <motion.div
              className="group relative bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col justify-between transition-all duration-300 ease-in-out hover:shadow-xl overflow-hidden"
              whileHover={{ 
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.15), 0 10px 10px -5px rgba(59, 130, 246, 0.1)",
                transition: { duration: 0.3 }
              }}
            >
              {/* Urgent Badge */}
              {job.urgent && (
                <motion.div
                  className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10 shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  whileHover={{ 
                    boxShadow: "0 4px 12px rgba(249, 115, 22, 0.4)",
                    scale: 1.05
                  }}
                >
                  🔥 Urgent
                </motion.div>
              )}

              {/* Company Rating */}
              <motion.div
                className="flex items-center gap-2 mb-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              >
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{job.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <Users size={12} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{job.applicants} applied</span>
                </div>
              </motion.div>

              <div className="transition-opacity duration-300 group-hover:opacity-90">
                <div className="flex justify-between items-center mb-2">
                  <motion.p 
                    className="text-sm text-gray-400 flex items-center gap-1"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Clock size={12} />
                    {job.posted}
                  </motion.p>
                  <motion.div 
                    className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {job.level}
                  </motion.div>
                </div>

                <motion.h2 
                  className="text-xl font-bold text-blue-800 mb-1 flex items-center gap-2"
                  whileHover={{ color: "#1E40AF" }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Briefcase size={20} className="text-blue-600" />
                  </motion.div>
                  {job.role}
                </motion.h2>
                
                <motion.p 
                  className="text-blue-600 mb-2 font-medium text-base"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  {job.company}
                </motion.p>

                <div className="text-sm text-gray-700 space-y-1 mt-2">
                  <motion.p 
                    className="flex items-center gap-2"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MapPin size={16} className="text-blue-500" />
                    </motion.div>
                    <span>{job.location}</span>
                  </motion.p>
                  <motion.p 
                    className="flex items-center gap-2"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Brain size={16} className="text-blue-500" />
                    </motion.div>
                    <span>{job.experience}</span>
                  </motion.p>
                </div>

                {/* Skills Tags */}
                <motion.div
                  className="flex flex-wrap gap-2 mt-3"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                >
                  {job.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skillIndex}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      whileHover={{ 
                        scale: 1.05, 
                        backgroundColor: "#E5E7EB",
                        transition: { duration: 0.2 }
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <motion.p 
                  className="text-blue-600 font-semibold text-sm flex items-center gap-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>${job.salary}/mo</span>
                </motion.p>
                <motion.button 
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out flex items-center gap-2 shadow-md"
                  whileHover={{ 
                    scale: 1.02, 
                    x: 1,
                    boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4), 0 2px 4px rgba(59, 130, 246, 0.2)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center gap-2">
                    Apply Now 
                    <motion.div
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight size={14} />
                    </motion.div>
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        className="text-center mt-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <motion.button
          onClick={() => navigate("/apply-for-jobs")}
          className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-all duration-300"
          whileHover={{ 
            scale: 1.02, 
            y: -1,
            boxShadow: "0 6px 20px rgba(59, 130, 246, 0.3), 0 4px 8px rgba(59, 130, 246, 0.2)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center gap-2 font-semibold">
            Show More Jobs
            <motion.div
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight size={18} />
            </motion.div>
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
