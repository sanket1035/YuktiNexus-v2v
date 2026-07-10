import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Briefcase,
  Mic,
  BarChart2,
  LogOut,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ isOpen, setIsOpen }) => {
  const { userProfile, logout, dbMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const activeClass = "flex items-center gap-3.5 px-4 py-3 rounded-xl bg-luxury-purple-700 text-white font-semibold transition-all duration-300 dark:bg-luxury-purple-500 shadow-md shadow-luxury-purple-900/10 dark:shadow-none";
  const inactiveClass = "flex items-center justify-between px-4 py-3 rounded-xl text-luxury-purple-800 hover:bg-luxury-cream-100 dark:text-luxury-cream-100/80 dark:hover:bg-luxury-purple-900/40 hover:translate-x-1 transition-all duration-300";

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, enabled: true },
    { name: 'AI Career Roadmap', path: '/roadmap', icon: Map, enabled: true, module: 2 },
    { name: 'Opportunity Hub', path: '/opportunities', icon: Briefcase, enabled: false, module: 3 },
    { name: 'AI Interview Coach', path: '/interview', icon: Mic, enabled: false, module: 4 },
    { name: 'Career Analytics', path: '/analytics', icon: BarChart2, enabled: false, module: 5 },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-luxury-purple-950/40 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-30 w-72 bg-white dark:bg-luxury-purple-950 border-r border-luxury-cream-200 dark:border-luxury-purple-900 flex flex-col justify-between p-6 transition-all duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-luxury-purple-700 flex items-center justify-center text-white font-bold text-base shadow-sm">
              SR
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-luxury-purple-950 dark:text-white">
                SheRise<span className="text-luxury-purple-500 font-sans font-bold">.AI</span>
              </span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-3 bg-luxury-cream-50 dark:bg-luxury-purple-900/40 rounded-2xl border border-luxury-cream-200/50 dark:border-luxury-purple-900">
            <img
              src={userProfile?.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=user`}
              alt="Avatar"
              className="w-11 h-11 rounded-xl bg-luxury-purple-100 object-cover border border-luxury-purple-300 dark:border-luxury-purple-800"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-luxury-purple-950 dark:text-luxury-cream-50 truncate">
                {userProfile?.fullName || 'STEM Student'}
              </span>
              <span className="text-[10px] font-semibold text-luxury-purple-500/80 dark:text-luxury-peach/80 uppercase tracking-widest truncate">
                {userProfile?.degree || 'STEM Dreamer'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navigation.map((item) => (
              <React.Fragment key={item.name}>
                {item.enabled ? (
                  <NavLink
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  </NavLink>
                ) : (
                  <div
                    className={`${inactiveClass} opacity-50 cursor-not-allowed`}
                    title={`Module ${item.module} - Locked`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-bold bg-luxury-cream-200 text-luxury-purple-900 dark:bg-luxury-purple-900 dark:text-luxury-cream-300 py-0.5 px-1.5 rounded">
                      <Lock size={9} />
                      <span>M{item.module}</span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col gap-4">
          {/* Database Mode Card */}
          <div className="p-3.5 rounded-xl text-center bg-luxury-cream-50 dark:bg-luxury-purple-900/30 border border-luxury-cream-200/50 dark:border-luxury-purple-900 text-xs">
            <div className="flex items-center justify-center gap-1.5 font-bold mb-1">
              <Sparkles size={13} className="text-luxury-purple-700 dark:text-luxury-peach" />
              <span className="text-luxury-purple-950 dark:text-luxury-cream-50 uppercase tracking-wider text-[10px]">
                Database Connection
              </span>
            </div>
            {dbMode === 'firebase' ? (
              <span className="font-semibold text-green-600 dark:text-green-400">
                Firebase Connected
              </span>
            ) : (
              <span className="font-semibold text-amber-600 dark:text-luxury-peach">
                Mock Local Sandbox
              </span>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 font-semibold text-sm cursor-pointer transition-colors duration-300 w-full text-left"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
