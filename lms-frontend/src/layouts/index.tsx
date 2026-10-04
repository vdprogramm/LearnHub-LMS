import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar toggleSidebar={() => {}} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// For this implementation, all authenticated roles use the same DashboardLayout base
// But we re-export them for the folder structure requested
export const StudentLayout = DashboardLayout;
export const InstructorLayout = DashboardLayout;
export const AdminLayout = DashboardLayout;
