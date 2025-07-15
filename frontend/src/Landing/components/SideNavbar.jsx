import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const sections = [
  { id: "home", label: "Home" },
  { id: "updates", label: "Announcements" },
  { id: "jobs", label: "Jobs" },
  { id: "faqs", label: "FAQs" },
  { id: "contact", label: "Contact" },
];

const StickySidebarButtons = ({ footerRef }) => {
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toggle, setToggle] = useState("apply");
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const navigate = useNavigate();
  const observerRef = useRef(null);
  const { isLoggedIn, logout } = useAuth();

  // Get user's first name from cookies
  let firstName = "User";
  try {
    const userDetails = Cookies.get("userDetails");
    if (userDetails) {
      const user = JSON.parse(userDetails);
      if (user.name) firstName = user.name.split(" ")[0];
    }
  } catch {}

  // Detect scroll position and footer visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      let current = "";
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) {
          const { top, height } = el.getBoundingClientRect();
          const sectionTop = window.scrollY + top;
          if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + height
          ) {
            current = section.id;
          }
        }
      });
      setActiveSection(current);
    };

    if (!footerRef?.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(footerRef.current);
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [footerRef]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToSectionMobile = (id) => {
    setMobileOpen(false);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate("/login");
  };

  const handleApply = () => {
    setToggle("apply");
    setTimeout(() => {
      setMobileOpen(false);
      navigate("/apply-for-jobs");
    }, 800);
  };

  const handleHire = () => {
    setToggle("hire");
    setTimeout(() => {
      setMobileOpen(false);
      navigate("hire/hrprofile");
    }, 800);
  };

  const toggleButtonMobile = (
    <div className="relative flex w-full rounded-full bg-white overflow-hidden h-10 border-2 border-blue-600 mb-6">
      <div
        className={`absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] ${
          toggle === "hire" ? "translate-x-full" : "translate-x-0"
        }`}
        style={{ left: "-2px" }}
      />
      <button
        onClick={handleApply}
        className={`relative z-10 w-1/2 py-2 text-sm font-semibold transition-colors duration-300 ${
          toggle === "apply"
            ? "text-white"
            : "text-blue-900 hover:text-blue-700"
        }`}
      >
        Apply Job
      </button>
      <button
        onClick={handleHire}
        className={`relative z-10 w-1/2 py-2 text-sm font-semibold transition-colors duration-300 ${
          toggle === "hire"
            ? "text-white"
            : "text-blue-900 hover:text-blue-700"
        }`}
      >
        Hire Now
      </button>
    </div>
  );

  // Add transition classes based on visibility
  const sidebarClass = `fixed top-16 left-0 w-44 h-[calc(100vh-15rem)] bg-[#f5faff] border-r border-none z-40 flex flex-col justify-center items-center hidden md:flex transition-all duration-500 ${
    isFooterVisible ? "opacity-0 pointer-events-none -translate-x-10" : "opacity-100 translate-x-0"
  }`;

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="fixed top-2 left-4 z-50 md:hidden bg-[#0B52C0] text-white p-2 rounded-full shadow-lg transition-transform duration-200"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
        style={{ left: '1rem', top: '0.25rem' }}
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
          <rect y="4" width="24" height="2" rx="1" fill="currentColor" />
          <rect y="11" width="24" height="2" rx="1" fill="currentColor" />
          <rect y="18" width="24" height="2" rx="1" fill="currentColor" />
        </svg>
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 h-full bg-white p-6 flex flex-col shadow-2xl animate-slideInLeft">
            <button
              className="self-end mb-6 text-gray-500 transition-transform duration-200"
              onClick={() => setMobileOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Profile section for mobile */}
            <div className="flex flex-col items-center mb-6">
              <FaUserCircle className="text-blue-600 w-10 h-10 mb-1" />
              <span className="text-blue-900 font-semibold text-base mb-2">Hi, {firstName}</span>
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded"
                onClick={() => { setMobileOpen(false); navigate("/profile"); }}
              >
                Profile
              </button>
            </div>

            {toggleButtonMobile}

            <div className="flex flex-col gap-3 flex-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSectionMobile(section.id)}
                  className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeSection === section.id
                      ? "bg-[#0B52C0] text-white shadow-md"
                      : "bg-white text-gray-700 shadow-sm hover:bg-blue-100"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Login/Logout button at the bottom */}
            <div className="mt-auto pt-6 flex justify-center">
              {isLoggedIn ? (
                <button
                  className="text-base text-gray-700 hover:underline bg-transparent shadow-none px-0 py-0 rounded-none"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              ) : (
                <button
                  className="text-base text-gray-700 hover:underline bg-transparent shadow-none px-0 py-0 rounded-none"
                  onClick={() => { setMobileOpen(false); navigate("/login"); }}
                >
                  Login
                </button>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sidebar - hidden when footer is visible */}
      <aside className={sidebarClass}>
        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`w-36 py-2 rounded-full text-sm font-medium shadow transition-all duration-300 ${
                activeSection === section.id
                  ? "bg-[#0B52C0] text-white shadow-md"
                  : "bg-white text-[#0B52C0] border border-[#0B52C0] shadow-sm hover:bg-blue-100"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Animation Style */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </>
  );
};

export default StickySidebarButtons;
