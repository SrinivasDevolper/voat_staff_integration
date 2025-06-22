import React, { useState } from "react";
import { Bell, BellDot, Home, Menu, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useNotifications } from "./contexts/Notification";

const Header = ({ onMenuToggle }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/login");
  };

  const formatNotificationTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-10">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#0F52BA] text-white py-3 px-4 flex justify-between items-center shadow-md">
          <Home size={20} />
          <span className="font-medium">HOME</span>

        <h1 className="text-2xl font-bold text-center flex-1">
          <Link to="/profile" className="flex items-center justify-center flex-1">
            VOAT
          </Link>
          </h1>
        <h1 className="text-xl font-bold">VOAT</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-full hover:bg-[#1565C0] transition-colors relative"
            >
              {unreadCount > 0 ? <BellDot size={20} /> : <Bell size={20} />}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="fixed right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Notifications</h3>
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-[#0F52BA] hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 cursor-pointer ${
                        !notification.read ? "bg-blue-50" : "bg-white"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <p className="text-sm text-gray-800">
                        {notification.text}
                      </p>
                      {notification.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatNotificationTime(notification.date)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center border-t border-gray-200">
                  <Link
                    to="/hire/schedule"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-sm text-[#0F52BA] hover:underline"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
              className="p-2 rounded-full hover:bg-[#1565C0] transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
            {showLogoutConfirm && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-50 border border-gray-200 p-2">
                <p className="text-sm text-gray-800 mb-2">Are you sure?</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex bg-[#0F52BA] text-white py-4 px-6 justify-between items-center shadow-md">
        <Link
          to="/"
          className="flex items-center space-x-2 bg-[#0D47A1] rounded-full px-4 py-2 hover:bg-[#1565C0] transition-colors cursor-pointer"
        >
          <Home size={20} />
          <span className="font-medium">HOME</span>
        </Link>
        <Link to="/" className="flex items-center justify-center flex-1">
          <h1 className="text-2xl font-bold text-center w-full">VOAT</h1>

        </Link>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 bg-[#0D47A1] rounded-full hover:bg-[#1565C0] transition-colors relative"
            >
              {unreadCount > 0 ? <BellDot size={20} /> : <Bell size={20} />}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-medium text-gray-800">Notifications</h3>
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-[#0F52BA] hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        !notification.read ? "bg-blue-50" : "bg-white"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <p className="text-sm text-gray-800">
                        {notification.text}
                      </p>
                      {notification.date && (
                        <p className="text-xs text-gray-500 mt-1">
                          {formatNotificationTime(notification.date)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center border-t border-gray-200">
                  <Link
                    to="/hire/schedule"
                    onClick={() => setNotificationsOpen(false)}
                    className="text-sm text-[#0F52BA] hover:underline"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
              className="p-2 bg-[#0D47A1] rounded-full hover:bg-[#1565C0] transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
            {showLogoutConfirm && (
              <div className="absolute right-0 mt-4 w-72 bg-white rounded-xl shadow-2xl z-50 border border-gray-300 p-6">
                <p className="text-lg font-semibold text-gray-900 mb-6">
                  Are you sure you want to logout?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="text-base font-medium px-5 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-base font-medium px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;