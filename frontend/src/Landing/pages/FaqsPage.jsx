import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "What is a staffing agency?",
    a: "We connect companies with skilled professionals for temporary, permanent, or contract roles.",
  },
  {
    q: "How does the hiring process work?",
    a: "We screen, interview, and match qualified candidates to your specific job requirements.",
  },
  {
    q: "Do you handle payroll for placed candidates?",
    a: "Yes, we manage payroll, taxes, and benefits for temporary and contract-based employees.",
  },
  {
    q: "What industries do you specialize in?",
    a: "We specialize in IT, healthcare, finance, engineering, and several other major industries.",
  },
  {
    q: "Can I hire someone permanently from a temp placement?",
    a: "Yes, you can hire a temporary employee full-time after evaluating their performance on the job.",
  },
  {
    q: "How long does it take to fill a position?",
    a: "Most roles are filled within 3–10 business days, depending on the position's complexity.",
  },
  {
    q: "Is there a replacement guarantee?",
    a: "Yes, we offer a replacement guarantee if a candidate does not meet your expectations.",
  },
  {
    q: "Do you provide background checks?",
    a: "Yes, we conduct comprehensive background, employment, and reference checks for all candidates.",
  },
  {
    q: "How do you ensure candidate quality?",
    a: "We use a multi-step process, including skills testing, interviews, and reference checks.",
  },
  {
    q: "Is there a fee for job seekers?",
    a: "No, our services are always 100% free for job seekers.",
  },
  {
    q: "What are your business hours?",
    a: "Our office is open Monday to Friday from 8:00 AM to 6:00 PM.",
  },
  {
    q: "Do you offer international placements?",
    a: "Yes, we have partnerships with companies in multiple countries for international placements.",
  },
  {
    q: "How do you source candidates?",
    a: "We use multiple channels including job boards, social media, referrals, and our extensive database.",
  },
  {
    q: "What's your success rate?",
    a: "We maintain a 95% placement success rate with our rigorous screening process.",
  },
  {
    q: "Can you help with bulk hiring?",
    a: "Absolutely, we specialize in volume hiring for companies with large staffing needs.",
  },
  {
    q: "Do you offer training for candidates?",
    a: "Yes, we provide upskilling and training programs for candidates when needed.",
  },
  {
    q: "What's your pricing model?",
    a: "Our fees are competitive and based on the type and duration of the placement.",
  },
  {
    q: "How do I get started?",
    a: "Simply contact us through our website or phone, and we'll guide you through the process.",
  },
  {
    q: "Do you offer executive search services?",
    a: "Yes, we have a dedicated team for C-level and executive placements.",
  },
  {
    q: "What makes your agency different?",
    a: "Our personalized approach, industry expertise, and commitment to quality set us apart.",
  },
];

const slideVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    height: 0
  },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: {
      duration: 0.5,
      ease: [0.33, 1, 0.68, 1],
      height: {
        duration: 0.4
      },
      opacity: {
        duration: 0.3,
        delay: 0.1
      }
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    height: 0,
    transition: {
      duration: 0.4,
      ease: [0.33, 1, 0.68, 1]
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
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

export default function FAQsPage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggle = (i) => {
    setActiveIndex(activeIndex === i ? null : i);
  };

  // Pagination settings
  const faqsPerPage = isMobile ? 5 : 10;
  const indexOfLastFaq = currentPage * faqsPerPage;
  const indexOfFirstFaq = indexOfLastFaq - faqsPerPage;
  const currentFaqs = faqs.slice(indexOfFirstFaq, indexOfLastFaq);
  const totalPages = Math.ceil(faqs.length / faqsPerPage);

  // Pagination controls
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
<div className="p-4 sm:p-6 md:p-8 max-w-screen-2xl mx-auto">
  <div className="text-center mb-8 sm:mb-12">
    <motion.h1 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-700 mb-3 sm:mb-4"
    >
      Frequently Asked Questions
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto"
    >
      Find answers to common questions about our staffing services, hiring process, and how we can help your organization find the perfect talent match.
    </motion.p>
  </div>

  <motion.div 
    className="space-y-4 sm:space-y-6"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {currentFaqs.map((faq, i) => {
      const originalIndex = indexOfFirstFaq + i;
      return (
        <motion.div
          key={originalIndex}
          variants={itemVariants}
          className={`rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg border transition-all duration-500 ease-in-out transform ${
            activeIndex === originalIndex
              ? "bg-blue-600 text-white border-blue-700 scale-[1.02] shadow-xl sm:shadow-2xl"
              : "bg-white text-blue-900 hover:bg-blue-50 border-gray-200 hover:scale-[1.01] hover:shadow-md sm:hover:shadow-xl"
          }`}
          whileHover={{ 
            y: activeIndex === originalIndex ? 0 : -2,
            transition: { duration: 0.2 }
          }}
        >
          <motion.button
            onClick={() => toggle(originalIndex)}
            className="w-full flex justify-between items-center text-base sm:text-lg font-semibold p-4 sm:p-6 focus:outline-none"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span className="text-left">{faq.q}</span>
            <motion.div
              animate={{ 
                rotate: activeIndex === originalIndex ? 180 : 0
              }}
              transition={{ 
                duration: 0.4,
                ease: [0.33, 1, 0.68, 1]
              }}
              whileHover={{ scale: 1.1 }}
            >
              {activeIndex === originalIndex ? (
                <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </motion.div>
          </motion.button>
          <AnimatePresence initial={false}>
            {activeIndex === originalIndex && (
              <motion.div
                key="content"
                variants={slideVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="overflow-hidden"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="px-4 sm:px-6 pb-4 sm:pb-6"
                >
                  <p className="text-sm sm:text-base leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      );
    })}
  </motion.div>

  {/* Pagination for both mobile and desktop */}
  {totalPages > 1 && (
    <div className="flex justify-center mt-6 sm:mt-8">
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-3 sm:px-4 py-1 sm:py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm sm:text-base"
        >
          Previous
        </button>
        
        {/* Show limited page numbers on mobile */}
        {isMobile ? (
          <>
            {currentPage > 2 && (
              <span className="px-1 sm:px-2">...</span>
            )}
            {currentPage > 1 && (
              <button
                onClick={() => paginate(currentPage - 1)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 text-sm sm:text-base"
              >
                {currentPage - 1}
              </button>
            )}
            <button
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 text-white text-sm sm:text-base"
            >
              {currentPage}
            </button>
            {currentPage < totalPages && (
              <button
                onClick={() => paginate(currentPage + 1)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-gray-100 text-sm sm:text-base"
              >
                {currentPage + 1}
              </button>
            )}
            {currentPage < totalPages - 1 && (
              <span className="px-1 sm:px-2">...</span>
            )}
          </>
        ) : (
          // Show all page numbers on desktop
          Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base ${
                currentPage === page 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          ))
        )}
        
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-3 sm:px-4 py-1 sm:py-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-sm sm:text-base"
        >
          Next
        </button>
      </div>
    </div>
  )}
</div>
  );
}