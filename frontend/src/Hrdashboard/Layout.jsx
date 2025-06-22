import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Head';
import Sidebar from './Sidebars';

const Layout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex flex-col">
      <Header 
        onMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />
      
      <div className="flex flex-1 pt-16 h-[calc(100vh-4rem)] ">
        <Sidebar 
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />
        
        <main
         className="ml-0 lg:ml-1 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;