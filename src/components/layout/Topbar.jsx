import React, { useState } from 'react';
import { Menu, Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatProfileName } from '../../utils/validation';

export const Topbar = ({ onMenuClick }) => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      title: 'Welcome to SheRise AI! 🎉',
      body: 'Your profile has been created successfully. Explore your future in STEM.',
      time: 'Just now',
    },
    {
      id: 2,
      title: 'Database Sandbox Mode',
      body: 'You are using the Local Sandbox. Add credentials to connect to Firebase.',
      time: '1m ago',
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/70 dark:bg-luxury-purple-950/75 backdrop-blur-md border-b border-luxury-cream-200 dark:border-luxury-purple-900 py-3.5 px-6 md:px-8 flex items-center justify-between">
      {/* Left Title / Hamburger */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl text-luxury-purple-800 dark:text-luxury-cream-100 hover:bg-luxury-cream-100 dark:hover:bg-luxury-purple-900/60 md:hidden"
        >
          <Menu size={22} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-luxury-purple-950 dark:text-white mb-0 md:text-xl font-sans">
            Dashboard
          </h2>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileDropdown(false);
            }}
            className="p-2.5 rounded-xl bg-luxury-cream-50 hover:bg-luxury-cream-100 text-luxury-purple-800 dark:bg-luxury-purple-900/40 dark:hover:bg-luxury-purple-900/80 dark:text-luxury-cream-200 border border-luxury-cream-250 dark:border-luxury-purple-900 cursor-pointer flex items-center justify-center relative focus:outline-none"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-luxury-purple-500 rounded-full animate-pulse"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-80 bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-2xl shadow-xl overflow-hidden z-40 p-4"
                >
                  <div className="flex justify-between items-center pb-3 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-2">
                    <span className="text-xs font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider">
                      Notifications
                    </span>
                    <span className="text-[10px] font-bold text-luxury-purple-500 dark:text-luxury-peach uppercase">
                      2 Unread
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {mockNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-2.5 rounded-xl bg-luxury-cream-50 dark:bg-luxury-purple-900/30 text-left border border-transparent hover:border-luxury-cream-200 dark:hover:border-luxury-purple-900 transition-colors"
                      >
                        <h4 className="text-xs font-bold text-luxury-purple-950 dark:text-luxury-cream-100">
                          {notif.title}
                        </h4>
                        <p className="text-[11px] text-luxury-purple-800/80 dark:text-luxury-cream-150/60 leading-normal mt-0.5">
                          {notif.body}
                        </p>
                        <span className="text-[9px] font-semibold text-luxury-purple-400 dark:text-luxury-purple-500 mt-1 block">
                          {notif.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileDropdown(!showProfileDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 p-1 pr-3 rounded-full hover:bg-luxury-cream-50 dark:hover:bg-luxury-purple-900/40 border border-transparent hover:border-luxury-cream-200 dark:hover:border-luxury-purple-900 cursor-pointer transition-all duration-350 focus:outline-none"
          >
            <img
              src={userProfile?.photoURL || `https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=user&backgroundColor=b6e3f4`}
              alt="Avatar"
              className="w-8 h-8 rounded-full bg-luxury-purple-100 object-cover border border-luxury-purple-300 dark:border-luxury-purple-800"
            />
            <ChevronDown size={14} className="text-luxury-purple-800 dark:text-luxury-cream-200" />
          </button>

          <AnimatePresence>
            {showProfileDropdown && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setShowProfileDropdown(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-56 bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-2xl shadow-xl overflow-hidden z-40 p-2"
                >
                  <div className="px-3.5 py-3 border-b border-luxury-cream-100 dark:border-luxury-purple-900 text-left mb-1.5">
                    <p className="text-xs font-bold text-luxury-purple-950 dark:text-white truncate">
                      {formatProfileName(userProfile?.fullName) || 'STEM Student'}
                    </p>
                    <p className="text-[10px] text-luxury-purple-800/60 dark:text-luxury-cream-100/50 truncate mt-0.5">
                      {userProfile?.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      navigate('/profile-setup');
                    }}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-luxury-purple-800 hover:bg-luxury-cream-50 dark:text-luxury-cream-100 dark:hover:bg-luxury-purple-900/40 rounded-xl text-left cursor-pointer transition-colors"
                  >
                    <User size={14} />
                    <span>Edit Profile Settings</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 rounded-xl text-left cursor-pointer transition-colors mt-1"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
