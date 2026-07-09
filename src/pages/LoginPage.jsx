import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { validateEmail } from '../utils/validation';

export const LoginPage = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleValidation = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!handleValidation()) return;

    setLoading(true);
    try {
      await login(email, password);
      // Saved remember-me locally if toggled (simple mock representation)
      if (rememberMe) {
        localStorage.setItem('sherise_remember_email', email);
      } else {
        localStorage.removeItem('sherise_remember_email');
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.message === 'auth/invalid-credential') {
        setError('Invalid email address or password. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const { isNew } = await loginWithGoogle();
      if (isNew) {
        navigate('/profile-setup');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 md:p-12 relative">
      <div className="w-full max-w-5xl bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px] transition-colors duration-500">
        
        {/* Left Side: Premium Illustration Section */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-luxury-purple-950 via-luxury-purple-700 to-luxury-purple-500 dark:from-luxury-purple-950 dark:via-luxury-purple-900 dark:to-luxury-purple-800 p-12 flex-col justify-between relative overflow-hidden text-left">
          {/* Waves / Gradients */}
          <div className="absolute inset-0 z-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,80 C30,90 40,40 70,60 C90,70 100,20 100,20 L100,100 L0,100 Z" fill="white" />
            </svg>
          </div>

          <div className="absolute top-20 right-10 w-44 h-44 bg-luxury-peach/10 rounded-full blur-2xl z-0 animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-luxury-purple-300/10 rounded-full blur-2xl z-0 animate-float"></div>

          {/* Top Info */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-luxury-peach uppercase tracking-widest">
              <Sparkles size={12} className="animate-pulse" />
              <span>ElevateHer STEM Platform</span>
            </div>
          </div>

          {/* Illustration content */}
          <div className="relative z-10 py-12 flex flex-col gap-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight text-white">
              Unlock Your Potential <br />
              <span className="italic font-medium text-luxury-peach">With SheRise AI</span>
            </h2>
            <p className="text-sm font-medium leading-relaxed text-luxury-cream-100/80">
              Access custom analytics, track learning milestones, find top opportunities, and practice live mock interviews.
            </p>

            {/* floating card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="mt-4 p-4 rounded-2xl glass border-white/15 text-left max-w-xs self-start shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-luxury-peach flex items-center justify-center text-luxury-purple-950 font-bold text-xs">
                  AI
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white">Career Readiness Score</span>
                  <span className="text-[10px] text-luxury-peach font-semibold tracking-wider uppercase">
                    Level Up +12% this week
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom attribution */}
          <div className="relative z-10 text-xs font-medium text-luxury-cream-200/50">
            &copy; {new Date().getFullYear()} SheRise AI. Powered by Gemini.
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 md:p-14 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto text-left flex flex-col gap-8">
            {/* Header */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-luxury-purple-950 dark:text-white">
                Welcome Back
              </h2>
              <p className="text-sm font-medium text-luxury-purple-800/60 dark:text-luxury-cream-100/50 mt-1 font-sans">
                Sign in to continue your career development.
              </p>
            </div>

            {/* Top error alert */}
            {error && (
              <div className="flex gap-2.5 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs font-semibold">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
              <Input
                label="Email Address"
                id="email"
                type="email"
                placeholder="you@stem.edu"
                icon={Mail}
                error={fieldErrors.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <div className="flex flex-col gap-1.5">
                <Input
                  label="Password"
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  error={fieldErrors.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                
                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-xs font-bold mt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-luxury-purple-800/80 dark:text-luxury-cream-100/80">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-luxury-cream-300 dark:border-luxury-purple-800 text-luxury-purple-700 focus:ring-luxury-purple-300 bg-transparent cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-luxury-purple-700 hover:text-luxury-purple-600 dark:text-luxury-peach dark:hover:text-luxury-peach-dark"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon={LogIn}
                className="w-full mt-2"
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-luxury-cream-200 dark:border-luxury-purple-900"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-luxury-purple-400 dark:text-luxury-purple-500 uppercase tracking-widest">
                Or
              </span>
              <div className="flex-grow border-t border-luxury-cream-200 dark:border-luxury-purple-900"></div>
            </div>

            {/* Google Login */}
            <Button
              variant="google"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full justify-center"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>

            {/* Footer register link */}
            <p className="text-center text-xs font-semibold text-luxury-purple-800/80 dark:text-luxury-cream-100/70">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                className="font-bold text-luxury-purple-700 hover:text-luxury-purple-600 dark:text-luxury-peach dark:hover:text-luxury-peach-dark underline decoration-2 underline-offset-4"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
