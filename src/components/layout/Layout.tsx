import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Toaster } from 'react-hot-toast';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const location = useLocation();
  const isHotelList = location.pathname === '/owner/hotels';

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex transition-colors duration-300">
      {!isHotelList && (
        <>
          <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={toggleSidebar}
            />
          )}
        </>
      )}
      
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] -z-10" />

        <Navbar toggleSidebar={toggleSidebar} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <Toaster position="top-right" toastOptions={{
        className: 'dark:bg-slate-800 dark:text-white',
      }} />
    </div>
  );
};
