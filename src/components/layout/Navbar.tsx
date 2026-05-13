import React from 'react';
import { Moon, Sun, User, LogOut, Menu, Building } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, isDarkMode, toggleTheme }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="h-20 px-8 flex items-center justify-between glass-card !rounded-none border-b border-slate-200 dark:border-slate-800 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden text-slate-500">
          <Menu size={24} />
        </button>
        <div>
          <h2 className="text-sm font-medium text-slate-500 dark:text-slate-400">Welcome back,</h2>
          <h1 className="text-xl font-bold dark:text-white">{user?.name || 'User'}</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white dark:border-slate-900"></span>
        </button> */}

        <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold dark:text-white leading-none">{user?.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user?.role?.replace('_', ' ')}</p>
          </div>
          <div className="relative group">
            <button className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-primary group-hover:text-white transition-all">
              <User size={20} />
            </button>
            
            <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {user?.role === 'HOTEL_OWNER' && location.pathname.startsWith('/hotel/') && (
                <button 
                  onClick={() => navigate('/owner/hotels')}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Building size={16} />
                  Switch Hotel
                </button>
              )}
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
