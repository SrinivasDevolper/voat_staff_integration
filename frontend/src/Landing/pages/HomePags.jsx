import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Search, MapPin } from "lucide-react";

function HomePags() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const navigate = useNavigate();

  const images = [
    "https://cdni.iconscout.com/illustration/premium/thumb/boy-working-on-creative-building-website-front-page-illustration-download-in-svg-png-gif-file-formats--design-web-template-layout-agency-activity-pack-business-illustrations-9890601.png?f=webp",
    "https://cdni.iconscout.com/illustration/premium/thumb/recruitment-process-illustration-9890602.png?f=webp",
    "https://cdni.iconscout.com/illustration/premium/thumb/job-interview-illustration-9890603.png?f=webp",
    "https://cdni.iconscout.com/illustration/premium/thumb/team-collaboration-illustration-9890604.png?f=webp",
    "https://cdni.iconscout.com/illustration/premium/thumb/career-growth-illustration-9890605.png?f=webp"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs/search?q=${searchQuery}&location=${location}&experience=${experience}`);
  };

  return (
    <div className="home-page-container flex flex-col items-center min-h-screen bg-[#f5faff] pt-4 md:pt-7">
      <div className="w-full max-w-6xl mx-auto px-2 py-4 ">
<motion.h1 
  className="text-xl sm:text-2xl md:text-2xl lg:text-4xl text-center font-bold mb-4"
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  <div className="mt-5 ">This Platform makes it easy to</div>
  <div className="text-blue-600 block">find jobs & hire talent</div>
</motion.h1>
        
        <motion.div 
          className="bg-white p-4 md:p-6 shadow-lg rounded-lg mb-8 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
            <div className="flex-1 relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="w-full pr-10 pl-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Job title, keywords, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 relative w-full">
              <Briefcase className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="w-full pr-10 pl-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Experience level"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>
            <div className="flex-1 relative w-full">
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                className="w-full pr-10 pl-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 w-full md:w-auto mt-2 md:mt-0"
            >
              Search
            </button>
          </form>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mt-8 md:mt-12">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] bg-[#f5faff] rounded-lg">
              <AnimatePresence mode="wait">
                {images.map((src, index) => (
                  <motion.img
                    key={index}
                    src={src}
                    alt={`Professional Staffing Illustration ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-contain"
                    initial={{ 
                      opacity: 0, 
                      scale: 0.8, 
                      rotateY: -15,
                      filter: 'blur(2px)'
                    }}
                    animate={currentImageIndex === index ? {
                      opacity: 1, 
                      scale: 1, 
                      rotateY: 0,
                      filter: 'blur(0px)'
                    } : {
                      opacity: 0, 
                      scale: 0.8, 
                      rotateY: 15,
                      filter: 'blur(2px)'
                    }}
                    exit={{ 
                      opacity: 0, 
                      scale: 0.8, 
                      rotateY: 15,
                      filter: 'blur(2px)'
                    }}
                    transition={{ 
                      duration: 1.2, 
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {[
              { number: "2k+", label: "Qualified Candidates" },
              { number: "500+", label: "Active Jobs" },
              { number: "100+", label: "Companies" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-white p-4 md:p-6 rounded-lg shadow-lg text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">
                  {stat.number}
                </h2>
                <p className="text-sm md:text-base text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePags;