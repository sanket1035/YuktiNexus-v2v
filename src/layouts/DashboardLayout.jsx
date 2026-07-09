import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';

export const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-luxury-cream-50 dark:bg-luxury-purple-950 transition-colors duration-500">
      {/* Sidebar - Fixed width on Desktop, Slider drawer on Mobile */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col md:pl-72 min-h-screen min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
