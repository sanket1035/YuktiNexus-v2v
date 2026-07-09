import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { validateEmail } from '../utils/validation';

export const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (!email) {
      setEmailError('Email address is required.');
      return;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      if (err.message === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else {
        setError('Failed to send reset link. Please check details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-3xl p-8 sm:p-10 shadow-2xl transition-colors duration-500 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-luxury-peach/10 rounded-full blur-xl"></div>
        
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="forgot-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="text-left"
            >
              {/* Back Button */}
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-1 text-xs font-bold text-luxury-purple-700 hover:text-luxury-purple-600 dark:text-luxury-peach dark:hover:text-luxury-peach-dark mb-6 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Back to Login</span>
              </button>

              <h2 className="font-serif text-2xl font-bold text-luxury-purple-950 dark:text-white">
                Reset Password
              </h2>
              <p className="text-xs font-semibold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 mt-1 mb-6">
                Enter your email address and we will send you a link to reset your password.
              </p>

              {error && (
                <div className="mb-5 flex gap-2.5 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs font-semibold">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <Input
                  label="Email Address"
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  icon={Mail}
                  error={emailError}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  icon={Send}
                  className="w-full mt-2"
                >
                  Send Reset Link
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="text-center py-6 flex flex-col items-center gap-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-950/30 text-green-500 dark:text-green-400 flex items-center justify-center border border-green-200 dark:border-green-900 shadow-sm">
                <CheckCircle size={32} />
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-luxury-purple-950 dark:text-white">
                  Reset Link Sent
                </h3>
                <p className="text-xs font-semibold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 max-w-xs mx-auto leading-relaxed mt-2">
                  We've sent a password recovery link to <span className="font-bold text-luxury-purple-950 dark:text-luxury-cream-100">{email}</span>. Please check your inbox and spam folder.
                </p>
              </div>

              <Button
                variant="primary"
                onClick={() => navigate('/login')}
                className="w-full mt-2"
              >
                Return to Login
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;
