import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function HomePags() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <div className="home-page-container flex flex-col items-center min-h-screen bg-[#f5faff]">
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <motion.h1 
          className="text-4xl text-center font-bold mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          This Platform make easy to <br />
          <span className="text-blue-600"> find job & Hire Job </span>
        </motion.h1>
        
        <motion.div 
          className="bg-white p-6 shadow-lg rounded-lg mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
          <form className="flex flex-col md:flex-row gap-4">
            <motion.div 
              className="flex-1 relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 1024 1024"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              >
                <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
              </svg>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Job title, keywords, or company"
                style={{ paddingLeft: "2.5rem" }}
              />
            </motion.div>
            <motion.div 
              className="flex-1 relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Experience level"
              />
            </motion.div>
            <motion.div 
              className="flex-1 relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              >
                <path
                  fill="none"
                  stroke="#000"
                  stroke-width="2"
                  d="M12,22 C12,22 4,16 4,10 C4,5 8,2 12,2 C16,2 20,5 20,10 C20,16 12,22 12,22 Z M12,13 C13.657,13 15,11.657 15,10 C15,8.343 13.657,7 12,7 C10.343,7 9,8.343 9,10 C9,11.657 10.343,13 12,13 L12,13 Z"
                ></path>
              </svg>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                placeholder="Location"
                style={{ paddingLeft: "2.5rem" }}
              />
            </motion.div>
            <motion.button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-all duration-300"
              style={{ padding: "0.5rem 1.5rem" }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Search jobs
            </motion.button>
          </form>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-[400px] h-[400px] bg-[#f5faff] rounded-lg">
              <AnimatePresence mode="wait">
                {images.map((src, index) => (
                  <motion.img
                    key={index}
                    src={src}
                    alt={`Professional Staffing Illustration ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ 
                      backgroundColor: 'transparent',
                      filter: 'brightness(1.05) contrast(1.05)',
                      mixBlendMode: 'multiply',
                      transformOrigin: 'center center',
                      willChange: 'transform, opacity'
                    }}
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
                      ease: [0.25, 0.46, 0.45, 0.94],
                      scale: { duration: 0.8 },
                      filter: { duration: 0.6 }
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full md:w-1/2 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { number: "2k+", label: "Qualified Candidates" },
              { number: "500+", label: "Active Jobs" },
              { number: "100+", label: "Companies" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ 
                  y: -8, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  scale: 1.05
                }}
              >
                <motion.h2 
                  className="text-3xl font-bold text-blue-600 mb-2"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {stat.number}
                </motion.h2>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePags;
