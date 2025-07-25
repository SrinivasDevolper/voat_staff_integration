import React, { useEffect, useState, useContext } from "react";
import { User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../header/Header";
import Cookies from "js-cookie";
import { apiUrl } from "../../../utilits/apiUrl";
import { UserDetailsContext } from "../../contexts/UserDetailsContext";
import toast from "react-hot-toast";
import axios from "axios";

const MobileSidebarContent = ({ setSidebarOpen }) => {
  const pathname = useLocation();
  const [currentPath, setCurrentPath] = useState(pathname.pathname);
  const { username, setUserName, userBio, setUserBio } =
    useContext(UserDetailsContext);
  useEffect(() => {
    setCurrentPath(pathname.pathname);
  }, [pathname]);
  const [sidebarDetails, setSidebarDetails] = useState(null);

  useEffect(() => {
    const userSideBarDetails = Cookies.get("sideBarDetails");
    if (userSideBarDetails) {
      try {
        const parsed = JSON.parse(userSideBarDetails);
        setSidebarDetails(parsed);
      } catch (err) {
        console.error("Invalid sidebarDetails cookie:", err);
      }
    }
  }, []);

  return (
    <>
      <div className="p-4 flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border-4 border-blue-100">
            <User size={48} className="text-[#0F52BA]" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          {username || sidebarDetails?.username}
        </h2>
        <p className="text-gray-500 text-xs text-center">
          {userBio || sidebarDetails?.bio}
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
                    ? "bg-[#0F52BA] text-white shadow-md"
                    : "bg-blue-50 text-[#0F52BA] hover:bg-blue-100 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={
                      currentPath === item.path
                        ? "text-white"
                        : "text-[#0F52BA]"
                    }
                  >
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
