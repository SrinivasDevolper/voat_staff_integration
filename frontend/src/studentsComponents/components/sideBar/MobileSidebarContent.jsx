import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../header/Header";

const MobileSidebarContent = ({ setSidebarOpen }) => {
  const pathname = useLocation();
  const [currentPath, setCurrentPath] = useState(pathname.pathname);

  useEffect(() => {
    setCurrentPath(pathname.pathname);
  }, [pathname]);

  return (
    <>
      <div className="p-4 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border-4 border-blue-100">
            <User size={48} className="text-[#0F52BA]" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Shivam Dubey
        </h2>
        <p className="text-gray-500 text-xs text-center">
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
                  setSidebarOpen(false);
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
    </>
  );
};

export default MobileSidebarContent;
