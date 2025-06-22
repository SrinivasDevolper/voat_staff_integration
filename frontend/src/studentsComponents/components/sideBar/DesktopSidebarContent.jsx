import { MessageCircle, Settings, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../header/Header";

const DesktopSidebarContent = () => {
  const pathname = useLocation();
  const [currentPath, setCurrentPath] = useState(pathname.pathname);

  useEffect(() => {
    setCurrentPath(pathname.pathname);
  }, [pathname]);

  return (
    <>
      <div className="p-6 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border-4 border-blue-100">
            <User size={64} className="text-[#0F52BA]" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Shivam Dubey
        </h2>
        <p className="text-gray-500 text-sm text-center">
          Computer Science Student
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto pb-6 px-4">
        {navItems.map((item, index) => (
          <div key={index} className="mb-2">
            <Link to={item.path}>
              <div
                onClick={() => {
                  setCurrentPath(item.path);
                }}
                className={`w-full flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 ${
                  currentPath === item.path 
                    ? 'bg-[#0F52BA] text-white shadow-md' 
                    : 'bg-blue-50 text-[#0F52BA] hover:bg-blue-100 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={currentPath === item.path ? 'text-white' : 'text-[#0F52BA]'}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </nav>

      {/* <div className="p-4 border-t border-gray-200">
        <div className="flex justify-center space-x-4">
          <button className="p-2 text-[#0F52BA] hover:bg-blue-50 rounded-full transition-colors">
            <MessageCircle size={18} />
          </button>
          <button className="p-2 text-[#0F52BA] hover:bg-blue-50 rounded-full transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div> */}
    </>
  );
};

export default DesktopSidebarContent;
