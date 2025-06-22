import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Power } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("left");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

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
    if (tab === "left") navigate("/profile");
    else if (tab === "right") navigate("/hire");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-[#0b52c0] shadow-md transition-shadow duration-300 ${
        scrolled ? "breathing-effect" : ""
      }`}
    >
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(true)}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="relative hidden md:block">
            <div className="flex items-center bg-white rounded-full shadow-md w-80 h-9 py-2 px-4">
              <input
                type="text"
                placeholder="Search..."
                className="flex-grow bg-transparent text-black placeholder-gray-500 border-none focus:outline-none focus:ring-0 text-sm"
                style={{ border: "none", outline: "none" }}
              />
              <svg
                className="text-gray-500 ml-2"
                stroke="currentColor"
                fill="currentColor"
                viewBox="0 0 1024 1024"
                height="16"
                width="16"
              >
                <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-5 flex-1">
          <span className="text-white text-xl font-bold">ASK FINANCE</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative flex w-40 rounded-full bg-white overflow-hidden h-9 border-2 border-blue-600">
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

          <button
            onClick={() => navigate("/login")}
            className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 h-9 rounded-full transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Power className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-all" />
            <span className="group-hover:translate-x-0.5 transition-transform">
              Login
            </span>
          </button>
        </div>
      </div>

      <div
        className={`fixed top-0 left-0 h-full w-40 bg-[#0b52c0] p-6 transition-transform duration-300 z-50 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="text-white text-3xl mb-8"
          onClick={() => setMenuOpen(false)}
        >
          ×
        </button>

        <ul className="flex flex-col gap-4 text-white text-sm">
          <li>
            <div className="relative flex w-full rounded-full bg-white overflow-hidden h-7 border-2 border-blue-600">
              <div
                className={`absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-blue-600 to-blue-500 transition-transform duration-350 ${
                  activeTab === "right" ? "translate-x-full" : "translate-x-0"
                }`}
              />
              {["left", "right"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    handleTabClick(tab);
                    setMenuOpen(false);
                  }}
                  className={`relative z-10 w-1/2 text-xs font-semibold py-1 ${
                    activeTab === tab ? "text-white" : "text-blue-900"
                  }`}
                >
                  {tab === "left" ? "Apply Job" : "Hire Now"}
                </button>
              ))}
            </div>
          </li>
          {["Home", "Updates", "FAQs", "Support"].map((item) => (
            <li
              key={item}
              className="border border-white text-center rounded-full py-1 cursor-pointer hover:bg-blue-600"
            >
              {item}
            </li>
          ))}
          <li
            onClick={() => {
              navigate("/login");
              setMenuOpen(false);
            }}
            className="border border-white text-center rounded-full py-1 cursor-pointer hover:bg-blue-600"
          >
            Login
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
