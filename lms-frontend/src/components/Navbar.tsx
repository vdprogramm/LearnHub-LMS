import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Bell, User as UserIcon, LogOut } from 'lucide-react';

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="h-16 bg-surface border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-4">
        {user && (
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
          >
            <Menu size={24} />
          </button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            L
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:block">LMS SaaS</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pr-2 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all focus:outline-none"
              >
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full bg-gray-100"
                />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <NavLink 
                    to={`/${user.role}/dashboard`} 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors mt-1"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <UserIcon size={16} /> Profile
                  </NavLink>
                  <button 
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <NavLink to="/auth/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              Log in
            </NavLink>
            <NavLink to="/auth/register" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
              Sign up
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};
