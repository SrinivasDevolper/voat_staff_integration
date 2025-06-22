import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  User,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Settings,
} from 'lucide-react';

const SubMenuButton = ({ item, isExpanded, toggleExpand, setMobileOpen }) => {
  const hasChildren = item.children?.length > 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `block py-2 pl-6 pr-2 flex-1 flex items-center transition-all duration-200 ease-in-out hover:scale-105 ${
              isActive 
                ? 'text-[#0F52BA] font-medium bg-blue-100 rounded-lg shadow-md' 
                : 'text-gray-700 hover:text-[#0F52BA] hover:bg-blue-100 rounded-lg hover:shadow-md'
            }`
          }
          onClick={() => setMobileOpen(false)}
        >
          <ArrowRight className="w-4 h-4 text-[#0F52BA] mr-2" />
          {item.label}
        </NavLink>

        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(item.path);
            }}
            className="p-1 mr-2 rounded-full hover:bg-blue-200 transition-all duration-200 ease-in-out hover:scale-110"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-[#0F52BA]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#0F52BA]" />
            )}
          </button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <div className="ml-6 pl-2 border-l border-blue-200 space-y-1">
          {item.children.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                `block py-1 pl-6 flex items-center transition-all duration-200 ease-in-out hover:scale-105 ${
                  isActive 
                    ? 'text-[#0F52BA] font-medium bg-blue-100 rounded-lg shadow-md' 
                    : 'text-gray-600 hover:text-[#0F52BA] hover:bg-blue-100 rounded-lg hover:shadow-md'
                }`
              }
              onClick={() => setMobileOpen(false)}
            >
              <ArrowRight className="w-3 h-3 text-[#0F52BA] mr-2" />
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const UserAvatar = () => (
  <div className="p-6 flex flex-col items-center">
    <div className="relative mb-4">
      <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border-4 border-blue-100">
        <User size={64} className="text-[#0F52BA]" />
      </div>
    </div>
    <h2 className="text-2xl font-bold text-gray-800 text-center">Shivam Dubey</h2>
    <p className="text-gray-500 text-sm text-center">Computer Science Student</p>
  </div>
);

const MenuSection = ({ title, icon, basePath, subItems, isExpanded, toggleExpand, setMobileOpen }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});

  const isActiveRoute = subItems.some(
    (item) =>
      location.pathname.startsWith(item.path) ||
      item.children?.some((child) => location.pathname.startsWith(child.path))
  ) || location.pathname.startsWith(basePath);

  useEffect(() => {
    if (isActiveRoute && !isExpanded) toggleExpand();
  }, [isActiveRoute]);

  const toggleItemExpand = (path) => {
    setExpandedItems((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <div className="space-y-1">
      <div className={`w-full rounded-lg overflow-hidden transition-all duration-200 ease-in-out hover:scale-105 ${isActiveRoute ? 'bg-[#0F52BA] shadow-md' : 'bg-blue-50 hover:bg-blue-100 hover:shadow-md'}`}>
        <div className="w-full flex items-center justify-between py-3 px-4 transition-all duration-200 ease-in-out">
          <NavLink
            to={basePath}
            className={`flex-1 flex items-center gap-2 transition-all duration-200 ease-in-out ${isActiveRoute ? 'text-white' : 'text-[#0F52BA] hover:text-[#0F52BA]'}`}
            onClick={() => setMobileOpen(false)}
          >
            {icon}
            {title}
          </NavLink>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
            className="p-1 rounded-full hover:bg-blue-200 transition-all duration-200 ease-in-out hover:scale-110"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-[#0F52BA]" />
            ) : (
              <ChevronRight className="w-5 h-5 text-[#0F52BA]" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-1">
          {subItems.map((item) => (
            <SubMenuButton
              key={item.path}
              item={item}
              isExpanded={!!expandedItems[item.path]}
              toggleExpand={toggleItemExpand}
              setMobileOpen={setMobileOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (key) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hiringItems = [
    { path: '/hire/post-job', label: 'Post Job' },
    {
      path: '/hire/all-jobs',
      label: 'All Jobs',
      children: [
        { path: '/hire/applications', label: 'Applications' },
        // { path: '/hire/all-applications', label: 'All Applications' }
      ],
    },
    // { path: '/hire/approved-students', label: 'Approved Students' },
    // { path: '/hire/students-on-hold', label: 'Hold Student' },
    // { path: '/hire/rejected-students', label: 'Rejected Students' },
  ];

  const quickHireItems = [
    { path: '/hire/data-request', label: 'Data Request' },
    { path: '/hire/get-profile', label: 'Get Profile / Hire HR' },
    // { path: '/hire/hiring', label: 'Hiring' },
  ];

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 w-64 bg-white border-r border-gray-200
          flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <UserAvatar />

        <div className="flex flex-col flex-1 overflow-y-auto pb-6 px-4 space-y-2">
          <NavLink
            to="/hire/hrprofile"
            className={({ isActive }) =>
              `w-full flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-200 ease-in-out mt-4 hover:scale-105 ${
                isActive 
                  ? 'bg-[#0F52BA] text-white shadow-md' 
                  : 'bg-blue-50 text-[#0F52BA] hover:bg-blue-100 hover:shadow-md'
              }`
            }
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex-1 flex items-center gap-2">
              <User size={18} />
              Profile
            </div>
          </NavLink>

          <NavLink
            to="/hire/schedule"
            className={({ isActive }) =>
              `w-full flex items-center justify-between py-3 px-4 rounded-lg transition-all duration-200 ease-in-out hover:scale-105 ${
                isActive ? 'bg-[#0F52BA] text-white shadow-md' : 'bg-blue-50 text-[#0F52BA] hover:bg-blue-100 hover:shadow-md'
              }`
            }
            onClick={() => setMobileOpen(false)}
          >
            <div className="flex-1 flex items-center gap-2">
              <Settings size={18} />
              Schedule
            </div>
          </NavLink>

          <MenuSection
            title="HIRING"
            icon={<User size={18} />}
            basePath="/hire/hiring"
            subItems={hiringItems}
            isExpanded={!!expandedSections['HIRING']}
            toggleExpand={() => toggleSection('HIRING')}
            setMobileOpen={setMobileOpen}
          />

          <MenuSection
            title="Quick Hire"
            icon={<User size={18} />}
            basePath="/hire/quick-hire"
            subItems={quickHireItems}
            isExpanded={!!expandedSections['Quick Hire']}
            toggleExpand={() => toggleSection('Quick Hire')}
            setMobileOpen={setMobileOpen}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
