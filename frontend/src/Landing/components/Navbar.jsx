import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Power } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("left");
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setTimeout(() => {
      if (tab === "left") {
        navigate("/apply-for-jobs");
      } else if (tab === "right") {
        navigate("/hire/hrprofile");
      }
    }, 500);
  };

  const handleProfileClick = () => setDropdownOpen((open) => !open);

  const handleProfileOption = (option) => {
    setDropdownOpen(false);
    if (option === "profile") navigate("/profile");
    if (option === "logout") handleLogout();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-[#0F52BA] transition-shadow duration-300 
          ${scrolled ? 'md:breathing-effect md:shadow-none shadow-md' : 'shadow-md'}
        `}
      >
        <div className="flex items-center justify-between px-3 py-3 relative">
          {/* Left section */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Profile section (where search bar was) */}
            <div className="relative ml-2 hidden md:flex" ref={profileRef}>
              <button
                className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-md focus:outline-none"
                onClick={handleProfileClick}
              >
                <FaUserCircle className="text-blue-600 w-6 h-6" />
                <span className="text-blue-900 font-semibold text-sm">
                  Hi, Shivam
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    onClick={() => handleProfileOption("profile")}
                  >
                    Profile
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                    onClick={() => handleProfileOption("logout")}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Centered logo absolutely centered */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full pointer-events-none">
            <Link to="/" className="pointer-events-auto">
              <img src="/MANAHIRE.png" alt="MANAHIRE Logo" className="w-44 mx-auto" />
            </Link>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-6 min-w-0 ml-auto">
            {/* Add hidden md:flex to show only on medium screens and above */}
            <div className="relative hidden md:flex w-40 rounded-full bg-white overflow-hidden h-9 border-2 border-blue-600">
              <div
                className={`absolute top-0 bottom-0 left-[-2px] w-[calc(52%)] bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-transform duration-300 ${
                  activeTab === "right" ? "translate-x-full" : "translate-x-0"
                }`}
              />
              {["left", "right"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`relative z-10 w-1/2 py-1.5 text-xs font-semibold ${
                    activeTab === tab ? "text-white" : "text-blue-900"
                  }`}
                >
                  {tab === "left" ? "Apply Job" : "Hire Now"}
                </button>
              ))}
            </div>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 h-9 rounded-full transition-all duration-300 flex items-center gap-2 shadow-md"
              >
                <Power className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 h-9 rounded-full transition-all duration-300 flex items-center gap-2 shadow-md"
              >
                <Power className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>
      <style>{`
        @media (min-width: 768px) {
          @keyframes breathing {
            0% { box-shadow: 0 4px 24px 0 rgba(59, 130, 246, 0.10); }
            50% { box-shadow: 0 8px 32px 0 rgba(59, 130, 246, 0.18); }
            100% { box-shadow: 0 4px 24px 0 rgba(59, 130, 246, 0.10); }
          }
          .breathing-effect {
            animation: breathing 2.5s infinite ease-in-out;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
