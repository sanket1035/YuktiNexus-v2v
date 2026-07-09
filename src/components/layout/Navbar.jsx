import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';
import { ThemeToggle } from '../common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-luxury-cream-50/80 dark:bg-luxury-purple-950/80 backdrop-blur-md border-b border-luxury-cream-200/50 dark:border-luxury-purple-900/50 py-3 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-luxury-purple-700 to-luxury-purple-500 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:scale-105 transition-transform duration-300">
            SR
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-luxury-purple-950 dark:text-white">
              SheRise<span className="text-luxury-purple-500 font-sans font-bold">.AI</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-luxury-purple-800/80 hover:text-luxury-purple-600 dark:text-luxury-cream-100/80 dark:hover:text-luxury-peach transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          
          {currentUser ? (
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard')}
              icon={Sparkles}
            >
              Dashboard
            </Button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-luxury-purple-700 hover:text-luxury-purple-600 dark:text-luxury-cream-100 dark:hover:text-luxury-peach transition-colors px-2 py-1"
              >
                Sign In
              </button>
              <Button
                variant="primary"
                onClick={() => navigate('/register')}
                icon={ArrowRight}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-luxury-purple-800 dark:text-luxury-cream-100 hover:bg-luxury-cream-100 dark:hover:bg-luxury-purple-900/60"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-luxury-cream-50 dark:bg-luxury-purple-950 border-b border-luxury-cream-200 dark:border-luxury-purple-900 px-6 py-6 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-luxury-purple-800 dark:text-luxury-cream-100/90 hover:text-luxury-purple-600 dark:hover:text-luxury-peach transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>

            <hr className="border-luxury-cream-200 dark:border-luxury-purple-900" />

            <div className="flex flex-col gap-3">
              {currentUser ? (
                <Button
                  variant="primary"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/login');
                    }}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/register');
                    }}
                    className="w-full animate-pulse-slow"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
