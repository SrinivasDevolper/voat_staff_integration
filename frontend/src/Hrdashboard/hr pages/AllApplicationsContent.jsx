import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  X,
  Bookmark,
  Clock,
  Briefcase,
  Mail,
  Phone,
  Globe,
  GraduationCap,
  Calendar,
  ArrowLeft,
  User,
  Briefcase as BriefcaseIcon,
  Award,
  FileText,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const AllApplicationsContent = () => {
  const initialApplications = [
    {
      id: 1,
      name: "John Doe",
      experience: "5 years",
      skills: ["React", "Node.js", "TypeScript"],
      location: "New York, NY",
      appliedDate: new Date("2023-04-15"),
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      portfolio: "johndoe.dev",
      education: "B.S. Computer Science, MIT",
      bio: "Senior frontend developer with 5 years of experience building scalable web applications. Passionate about creating intuitive user interfaces and mentoring junior developers.",
      resume: "https://example.com/resumes/john-doe-resume.pdf",
      projects: [
        {
          name: "E-commerce Platform",
          description:
            "Built a full-featured e-commerce platform with React, Node.js, and MongoDB",
          technologies: ["React", "Node.js", "MongoDB", "Stripe API"],
        },
        {
          name: "Task Management App",
          description:
            "Developed a collaborative task management application with real-time updates",
          technologies: ["React", "Firebase", "Material UI"],
        },
      ],
      certifications: [
        "AWS Certified Developer - Associate",
        "Google Cloud Professional Data Engineer",
      ],
    },
    {
      id: 2,
      name: "Priya Sharma",
      experience: "4 years",
      skills: ["Java", "Spring Boot", "Microservices", "AWS"],
      location: "Bangalore, KA",
      status: "In Review",
      appliedDate: new Date("2023-05-10"),
      email: "priya.sharma@example.com",
      phone: "+91 98765 43210",
      portfolio: "priyasharma.in",
      education: "M.Tech Computer Science, IIT Delhi",
      bio: "Backend developer specializing in building scalable microservices architecture. Experience in fintech and e-commerce domains. Contributor to open-source projects.",
      resume: "https://example.com/resumes/priya-sharma-resume.pdf",
      projects: [
        {
          name: "Digital Banking Platform",
          description:
            "Developed core banking APIs handling 10,000+ TPS for a major Indian bank",
          technologies: ["Java", "Spring Boot", "Kafka", "PostgreSQL"],
        },
        {
          name: "Payment Gateway Integration",
          description:
            "Implemented UPI and Razorpay integrations for e-commerce clients",
          technologies: ["Java", "REST APIs", "AWS Lambda"],
        },
      ],
      certifications: [
        "Oracle Certified Professional: Java SE 11 Developer",
        "AWS Certified Solutions Architect",
      ],
    },
    {
      id: 3,
      name: "Rahul Patel",
      experience: "2 years",
      skills: ["Python", "Django", "Data Analysis", "SQL"],
      location: "Hyderabad, TS",
      status: "New",
      appliedDate: new Date("2023-05-18"),
      email: "rahul.patel@example.com",
      phone: "+91 87654 32109",
      portfolio: "rahulpatel.me",
      education: "B.E. Computer Engineering, VJTI Mumbai",
      bio: "Full-stack developer with strong analytical skills. Passionate about data-driven applications and clean code. Looking to grow in a product-based company.",
      resume: "https://example.com/resumes/rahul-patel-resume.pdf",
      projects: [
        {
          name: "Healthcare Analytics Dashboard",
          description:
            "Built a dashboard for hospital administrators to track patient metrics",
          technologies: ["Python", "Django", "Chart.js", "PostgreSQL"],
        },
        {
          name: "E-learning Platform",
          description:
            "Developed core features for an online education startup",
          technologies: ["Python", "Django", "JavaScript", "Bootstrap"],
        },
      ],
      certifications: [
        "Microsoft Certified: Azure Fundamentals",
        "Python Institute PCAP",
      ],
    },
    {
      id: 4,
      name: "Ananya Gupta",
      experience: "6 years",
      skills: ["React Native", "Flutter", "Mobile UI/UX", "Firebase"],
      location: "Pune, MH",
      status: "Interview Scheduled",
      appliedDate: new Date("2023-05-05"),
      email: "ananya.gupta@example.com",
      phone: "+91 76543 21098",
      portfolio: "ananyagupta.design",
      education: "B.Tech IT, COEP Pune",
      bio: "Lead mobile developer with experience building cross-platform apps downloaded by 1M+ users. Strong focus on performance optimization and beautiful interfaces.",
      resume: "https://example.com/resumes/ananya-gupta-resume.pdf",
      projects: [
        {
          name: "Fitness Tracking App",
          description:
            "Built a popular health app with 500K+ downloads on Play Store",
          technologies: ["Flutter", "Firebase", "Google Fit API"],
        },
        {
          name: "E-commerce Mobile App",
          // description: 'Led development of Flipzon's mobile shopping app',
          // technologies: ['React Native', 'Redux', 'Node.js']
        },
      ],
      certifications: [
        "Google Flutter Certification",
        "Adobe XD UI/UX Certification",
      ],
    },
    {
      id: 5,
      name: "Vikram Singh",
      experience: "8 years",
      skills: ["DevOps", "Docker", "Kubernetes", "CI/CD", "AWS"],
      location: "Gurgaon, HR",
      status: "Offer Extended",
      appliedDate: new Date("2023-04-22"),
      email: "vikram.singh@example.com",
      phone: "+91 98989 98989",
      portfolio: "vikramsingh.tech",
      education: "B.Tech CSE, DTU Delhi",
      bio: "DevOps engineer with extensive cloud infrastructure experience. Implemented CI/CD pipelines reducing deployment time by 80%. Certified AWS and Kubernetes expert.",
      resume: "https://example.com/resumes/vikram-singh-resume.pdf",
      projects: [
        {
          name: "Cloud Migration Project",
          description:
            "Migrated 50+ services from on-prem to AWS with zero downtime",
          technologies: ["AWS", "Terraform", "Ansible", "Jenkins"],
        },
        {
          name: "Kubernetes Cluster Optimization",
          description:
            "Reduced cloud costs by 40% through resource optimization",
          technologies: ["Kubernetes", "Prometheus", "Grafana"],
        },
      ],
      certifications: [
        "Certified Kubernetes Administrator (CKA)",
        "AWS Certified DevOps Engineer - Professional",
      ],
    },
  ];

  const [allApplications, setAllApplications] = useState(initialApplications);
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(3);
  const [sortedApplications, setSortedApplications] = useState([]);
  const [applicationToReject, setApplicationToReject] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [applicationToApprove, setApplicationToApprove] = useState(null);
  const [applicationOnHold, setApplicationOnHold] = useState(null);

  const handleHold = (id) => {
    setAllApplications(
      allApplications.map((app) =>
        app.id === id ? { ...app, status: "On Hold" } : app
      )
    );
    setApplicationOnHold(null);
    if (selectedApplication?.id === id) {
      setSelectedApplication({ ...selectedApplication, status: "On Hold" });
    }
  };

  const handleApprove = (id) => {
    setAllApplications(
      allApplications.map((app) =>
        app.id === id ? { ...app, status: "Approved" } : app
      )
    );
    setApplicationToApprove(null);
    if (selectedApplication?.id === id) {
      setSelectedApplication({ ...selectedApplication, status: "Approved" });
    }
  };

  const handleReject = (id) => {
    setAllApplications(allApplications.filter((app) => app.id !== id));
    setApplicationToReject(null);
    if (selectedApplication?.id === id) {
      setSelectedApplication(null);
    }
    // Adjust page if needed
    if (currentApplications.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const sorted = [...allApplications].sort(
      (a, b) => b.appliedDate - a.appliedDate
    );
    setSortedApplications(sorted);
  }, [allApplications]);

  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = sortedApplications.slice(
    indexOfFirstApplication,
    indexOfLastApplication
  );
  const totalPages = Math.ceil(sortedApplications.length / applicationsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const formatDate = (date) => {
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const leftOffset = Math.floor(maxVisiblePages / 2);
      const rightOffset = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= leftOffset) {
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - rightOffset) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - (maxVisiblePages - 2); i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  if (selectedApplication) {
    const currentIndex = sortedApplications.findIndex(
      (app) => app.id === selectedApplication.id
    );
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < sortedApplications.length - 1;

    const handlePrevious = () => {
      if (hasPrevious) {
        setSelectedApplication(sortedApplications[currentIndex - 1]);
      }
    };

    const handleNext = () => {
      if (hasNext) {
        setSelectedApplication(sortedApplications[currentIndex + 1]);
      }
    };

    return (
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setSelectedApplication(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={18} />
            Back to List
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevious}
              className={`flex items-center gap-2 ${
                hasPrevious
                  ? "text-blue-600 hover:text-blue-800"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              disabled={!hasPrevious}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <span className="text-sm text-gray-500">
              {currentIndex + 1} of {sortedApplications.length}
            </span>

            <button
              onClick={handleNext}
              className={`flex items-center gap-2 ${
                hasNext
                  ? "text-blue-600 hover:text-blue-800"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              disabled={!hasNext}
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedApplication.name}
          </h1>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Resume Preview</h2>
            <a
              href={selectedApplication.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-2 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Full Resume
            </a>
          </div>

          <div className="h-[300px] lg:h-[1150px] w-Full bg-white border border-gray-300 rounded overflow-hidden">
            <iframe
              src="/resume.pdf"
              // src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedApplication.resume)}&embedded=true`}
              className="w-full h-full"
              frameBorder="0"
              title="Resume Preview"
            >
              <p className="p-4 text-gray-500">
                Your browser does not support PDF preview.
                <a
                  href={selectedApplication.resume}
                  className="text-blue-600 hover:underline ml-1"
                >
                  Download the resume instead
                </a>
              </p>
            </iframe>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-gray-500 flex items-center gap-1">
            <Clock size={14} />
            Applied {formatDate(selectedApplication.appliedDate)}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setApplicationToApprove(selectedApplication.id)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
          >
            Approve
          </button>
          <button
            onClick={() => setApplicationToReject(selectedApplication.id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
          >
            Reject
          </button>
          <button
            onClick={() => setApplicationOnHold(selectedApplication.id)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-medium"
          >
            Put on hold
          </button>
          <button
            onClick={() => window.open(selectedApplication.resume, "_blank")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            DOWNLOAD RESUME
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={18} />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-500" />
                <span className="text-gray-700">
                  {selectedApplication.email}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-500" />
                <span className="text-gray-700">
                  {selectedApplication.phone}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-gray-500" />
                <a
                  href={`https://${selectedApplication.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {selectedApplication.portfolio}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-gray-700">
                  {selectedApplication.location}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <GraduationCap size={18} />
              Education
            </h2>
            <p className="text-gray-700">{selectedApplication.education}</p>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award size={18} />
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectedApplication.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText size={18} />
              About
            </h2>
            <p className="text-gray-700 whitespace-pre-line">
              {selectedApplication.bio}
            </p>
          </div>
        </div>

        {/* Confirmation Dialogs */}
        {applicationToApprove && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Confirm Approval</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to approve this application?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setApplicationToApprove(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleApprove(applicationToApprove);
                    setApplicationToApprove(null);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirm Approve
                </button>
              </div>
            </div>
          </div>
        )}

        {applicationToReject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Confirm Rejection</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to reject this application?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setApplicationToReject(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleReject(applicationToReject);
                    setApplicationToReject(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {applicationOnHold && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Confirm Hold</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to put this application on hold?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setApplicationOnHold(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleHold(applicationOnHold);
                    setApplicationOnHold(null);
                  }}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  Confirm Hold
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white m-4 rounded-2xl shadow-sm">
      <div className="space-y-5">
        {currentApplications.length > 0 ? (
          currentApplications.map((app) => (
            <div
              key={app.id}
              className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {app.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {formatDate(app.appliedDate)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </p>
                    <p className="text-sm mt-1">{app.experience}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </p>
                    <p className="text-sm mt-1">{app.location}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase mx-1 tracking-wider">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {app.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
                <button
                  onClick={() => setSelectedApplication(app)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  View Profile
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setApplicationToApprove(app.id)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setApplicationToReject(app.id)}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setApplicationOnHold(app.id)}
                    className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600"
                  >
                    Hold
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No applications found</p>
          </div>
        )}
      </div>

      {sortedApplications.length > 0 && (
        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium">{indexOfFirstApplication + 1}</span> -{" "}
            <span className="font-medium">
              {Math.min(indexOfLastApplication, sortedApplications.length)}
            </span>{" "}
            of <span className="font-medium">{sortedApplications.length}</span>{" "}
            applications
          </div>
          <div className="flex items-center gap-2">
            <button
              className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-1 ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-1">
              {getPageNumbers().map((number, index) =>
                number === "..." ? (
                  <span key={index} className="px-2">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${
                      number === currentPage
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                )
              )}
            </div>

            <button
              className={`px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-1 ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      {applicationToApprove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Approval</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve this application?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setApplicationToApprove(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleApprove(applicationToApprove);
                  setApplicationToApprove(null);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Confirm Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {applicationToReject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Rejection</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reject this application?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setApplicationToReject(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleReject(applicationToReject);
                  setApplicationToReject(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {applicationOnHold && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Hold</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to put this application on hold?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setApplicationOnHold(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleHold(applicationOnHold);
                  setApplicationOnHold(null);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
              >
                Confirm Hold
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllApplicationsContent;
