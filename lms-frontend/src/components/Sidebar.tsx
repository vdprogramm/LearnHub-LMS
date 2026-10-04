import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Award, 
  Users, 
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const menuItems = {
    student: [
      { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
      { name: 'My Courses', path: '/student/my-courses', icon: BookOpen },
      { name: 'Course Catalog', path: '/courses', icon: GraduationCap },
      { name: 'Certificates', path: '/student/certificates', icon: Award },
    ],
    instructor: [
      { name: 'Dashboard', path: '/instructor/dashboard', icon: LayoutDashboard },
      { name: 'My Courses', path: '/instructor/courses', icon: BookOpen },
    ],
    admin: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Users', path: '/admin/users', icon: Users },
      { name: 'Courses', path: '/admin/courses', icon: BookOpen },
      { name: 'Enrollments', path: '/admin/enrollments', icon: GraduationCap },
      { name: 'Certificates', path: '/admin/certificates', icon: Award },
    ]
  };

  const currentMenu = menuItems[role] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-16 flex items-center justify-between px-6 lg:hidden border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900">LMS SaaS</span>
          <button onClick={closeSidebar} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
            Main Menu
          </div>
          {currentMenu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                onClick={() => {
                  if (window.innerWidth < 1024) closeSidebar();
                }}
              >
                <Icon size={20} className={({ isActive }: any) => isActive ? 'text-primary' : 'text-gray-500'} />
                {item.name}
              </NavLink>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <NavLink
            to={`/${role}/settings`}
            className="flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all"
          >
            <Settings size={20} />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
};
