import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    q: "What is a staffing agency?",
    a: "A staffing agency is a professional service that helps companies find and hire temporary, permanent, or contract-based employees. We act as a bridge between talented professionals and organizations looking to fill positions. Our services include candidate screening, skill assessment, and ensuring the right match between employers and employees. We handle all the complexities of recruitment, allowing companies to focus on their core business operations.",
  },
  {
    q: "How does the hiring process work?",
    a: "Our hiring process is streamlined and efficient. First, we thoroughly screen and interview candidates to understand their skills, experience, and career goals. Then, we match them with your specific requirements, considering factors like technical expertise, cultural fit, and career aspirations. We handle all the preliminary interviews and assessments, saving you valuable time and effort. Once you select a candidate, we manage the onboarding process and provide ongoing support throughout the placement.",
  },
  {
    q: "Do you handle payroll for placed candidates?",
    a: "Yes, for temporary and contract hires, we provide comprehensive payroll management services. This includes handling all aspects of compensation, including salary processing, tax deductions, benefits administration, and compliance with labor laws. We ensure timely payments, maintain detailed records, and handle all the necessary documentation. This service helps companies reduce administrative burden and ensures compliance with employment regulations.",
  },
  {
    q: "What industries do you specialize in?",
    a: "We serve a wide range of industries with specialized expertise in IT, healthcare, finance, engineering, and more. Our industry-specific knowledge allows us to understand unique requirements and challenges. We have dedicated teams for each sector, ensuring we can provide the most relevant candidates and solutions. Whether you're in technology, healthcare, or manufacturing, we have the expertise to meet your staffing needs.",
  },
  {
    q: "Can I hire someone permanently from a temp placement?",
    a: "Absolutely! Many of our clients successfully convert temporary hires into full-time employees. This approach allows you to evaluate a candidate's performance, skills, and cultural fit before making a permanent commitment. We facilitate this transition process, handling all the necessary paperwork and ensuring a smooth conversion. This 'try before you buy' approach has proven successful for many organizations in finding their ideal long-term team members.",
  },
  {
    q: "How long does it take to fill a position?",
    a: "Most roles are filled within 3–10 business days, depending on the position's complexity and requirements. For standard positions, we typically present qualified candidates within the first week. For specialized or senior roles, the process may take slightly longer to ensure we find the perfect match. We maintain a large pool of pre-screened candidates and use advanced matching algorithms to expedite the hiring process.",
  },
  {
    q: "Is there a replacement guarantee?",
    a: "Yes, we offer a comprehensive replacement guarantee. If a placement doesn't work out within the guarantee period, we provide a free replacement. This guarantee demonstrates our commitment to quality and client satisfaction. The specific terms of the guarantee vary based on the position type and level, but we always ensure you're completely satisfied with your new hire.",
  },
  {
    q: "Do you provide background checks?",
    a: "Yes, all candidates undergo thorough background checks as part of our screening process. This includes criminal history verification, employment verification, education verification, and reference checks. We also conduct drug screening when required. Our comprehensive background check process helps ensure the safety and reliability of our placements, giving you peace of mind when hiring through our agency.",
  },
  {
    q: "How do you ensure candidate quality?",
    a: "We maintain high standards through a multi-step quality assurance process. This includes skills testing, behavioral interviews, technical assessments, and reference verification. We evaluate both technical competencies and soft skills to ensure well-rounded candidates. Our recruiters are industry experts who understand the specific requirements of each role. We also provide ongoing training and development opportunities for our placed candidates.",
  },
  {
    q: "Is there a fee for job seekers?",
    a: "No, our services are completely free for job seekers. We believe in creating opportunities without financial barriers. We cover all costs associated with the recruitment process, including background checks and skill assessments. Our focus is on connecting talented professionals with great opportunities, and we're committed to making this process as smooth and accessible as possible for candidates.",
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
      ease: [0.33, 1, 0.68, 1], // Custom easing for smooth motion
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

  const toggle = (i) => {
    setActiveIndex(activeIndex === i ? null : i);
  };

  return (
    <div className="p-8 max-w-screen-2xl mx-auto">
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-5xl font-extrabold text-blue-700 mb-4"
        >
        Frequently Asked Questions
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-gray-600 text-lg max-w-3xl mx-auto"
        >
          Find answers to common questions about our staffing services, hiring process, and how we can help your organization find the perfect talent match.
        </motion.p>
      </div>

      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className={`rounded-3xl shadow-lg border transition-all duration-500 ease-in-out transform ${
              activeIndex === i
                ? "bg-blue-600 text-white border-blue-700 scale-[1.02] shadow-2xl"
                : "bg-white text-blue-900 hover:bg-blue-50 border-gray-200 hover:scale-[1.01] hover:shadow-xl"
            }`}
            whileHover={{ 
              y: activeIndex === i ? 0 : -2,
              transition: { duration: 0.2 }
            }}
          >
            <motion.button
              onClick={() => toggle(i)}
              className="w-full flex justify-between items-center text-lg font-semibold p-6 focus:outline-none"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span>{faq.q}</span>
              <motion.div
                animate={{ 
                  rotate: activeIndex === i ? 180 : 0
                }}
                transition={{ 
                  duration: 0.4,
                  ease: [0.33, 1, 0.68, 1]
                }}
                whileHover={{ scale: 1.1 }}
              >
                {activeIndex === i ? (
                  <ChevronUp className="w-6 h-6" />
                ) : (
                  <ChevronDown className="w-6 h-6" />
                )}
              </motion.div>
            </motion.button>
            <AnimatePresence initial={false}>
              {activeIndex === i && (
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
                    className="px-6 pb-6"
                  >
                    <p className="text-base leading-relaxed">
                    {faq.a}
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
