import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, GraduationCap, Compass, Briefcase, ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { validateEmail, checkPasswordStrength } from '../utils/validation';

export const RegisterPage = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Education Fields
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [branch, setBranch] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [careerGoal, setCareerGoal] = useState('');

  // Password strength state
  const [pwdStrength, setPwdStrength] = useState({ score: 0, label: 'Empty', color: 'bg-neutral-300', feedback: [] });

  useEffect(() => {
    setPwdStrength(checkPasswordStrength(password));
  }, [password]);

  const validateStep1 = () => {
    const errors = {};
    if (!fullName.trim()) errors.fullName = 'Full name is required.';
    if (!email) {
      errors.email = 'Email address is required.';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    } else if (pwdStrength.score < 3) {
      errors.password = 'Password is too weak. Please address requirements.';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    if (!college.trim()) errors.college = 'College name is required.';
    if (!branch.trim()) errors.branch = 'Branch/discipline is required.';
    if (!graduationYear) {
      errors.graduationYear = 'Graduation year is required.';
    } else if (isNaN(graduationYear) || graduationYear.length !== 4) {
      errors.graduationYear = 'Please enter a valid 4-digit year (e.g. 2027).';
    }
    if (!careerGoal.trim()) errors.careerGoal = 'Career goal is required.';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    setError('');
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateStep2()) return;

    setLoading(true);
    try {
      await register(email, password, {
        fullName,
        college,
        degree,
        branch,
        graduationYear,
        careerGoal,
      });
      // Redirects to profile-setup wizard immediately after registration
      navigate('/profile-setup');
    } catch (err) {
      console.error(err);
      if (err.message === 'auth/email-already-in-use') {
        setError('This email address is already in use by another account.');
        setStep(1); // send back to fix email
      } else {
        setError('Registration failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
      setError('Google Sign-Up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const degreesList = [
    'B.Tech',
    'B.E',
    'B.Sc',
    'M.Tech',
    'M.Sc',
    'Ph.D',
    'MCA',
    'BCA',
    'Other'
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-4xl bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[600px] transition-colors duration-500">
        
        {/* Left Side: Elegant branding vector */}
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-luxury-purple-950 via-luxury-purple-700 to-luxury-purple-500 dark:from-luxury-purple-950 dark:via-luxury-purple-900 dark:to-luxury-purple-800 p-10 flex-col justify-between relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-36 h-36 bg-luxury-peach/10 rounded-full blur-2xl animate-pulse-slow"></div>
          
          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-sm border border-white/20">
                SR
              </div>
              <span className="font-serif text-base font-bold text-white">SheRise AI</span>
            </Link>
          </div>

          <div className="relative z-10 my-10 flex flex-col gap-5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-luxury-peach">
              Step {step} of 2
            </span>
            <h3 className="font-serif text-2xl font-bold text-white leading-snug">
              {step === 1 
                ? "Begin your journey with career-focused intelligence." 
                : "Tell us about your educational background in STEM."
              }
            </h3>
            <p className="text-xs font-semibold leading-relaxed text-luxury-cream-100/70">
              {step === 1
                ? "Setup your account credentials. We protect your privacy and security at every level."
                : "This helps our AI system personalize roadmaps, match skill-gaps, and curate scholarships specifically for you."
              }
            </p>
          </div>

          {/* Stepper graphics */}
          <div className="relative z-10 flex items-center gap-2 mt-4">
            <div className={`w-8 h-1.5 rounded-full ${step === 1 ? 'bg-luxury-peach' : 'bg-white/30'} transition-colors duration-300`}></div>
            <div className={`w-8 h-1.5 rounded-full ${step === 2 ? 'bg-luxury-peach' : 'bg-white/30'} transition-colors duration-300`}></div>
          </div>
        </div>

        {/* Right Side: Account Details Wizard */}
        <div className="w-full md:w-3/5 p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto text-left">
            
            {/* Header */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-luxury-purple-950 dark:text-white">
                  Create Account
                </h2>
                <p className="text-xs font-semibold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 mt-1">
                  Empowering your career growth in technology.
                </p>
              </div>
              <span className="text-xs font-extrabold text-luxury-purple-400 dark:text-luxury-purple-500 tracking-wider md:hidden">
                Step {step}/2
              </span>
            </div>

            {/* Error alerts */}
            {error && (
              <div className="mb-6 flex gap-2.5 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs font-semibold">
                <span className="shrink-0">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Multi-step Forms with Framer Motion */}
            <form onSubmit={handleFormSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4"
                  >
                    <Input
                      label="Full Name"
                      id="fullName"
                      placeholder="Ananya Sharma"
                      icon={User}
                      error={fieldErrors.fullName}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={loading}
                    />

                    <Input
                      label="Email Address"
                      id="email"
                      type="email"
                      placeholder="ananya@stem.edu"
                      icon={Mail}
                      error={fieldErrors.email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      
                      <Input
                        label="Confirm Password"
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        icon={Lock}
                        error={fieldErrors.confirmPassword}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    {/* Password Strength Meter */}
                    {password && (
                      <div className="p-3 bg-luxury-cream-50 dark:bg-luxury-purple-900/20 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-xl mt-1 text-xs">
                        <div className="flex justify-between items-center mb-1.5 font-bold">
                          <span className="text-luxury-purple-800 dark:text-luxury-cream-100">Password Strength:</span>
                          <span className={pwdStrength.score >= 3 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}>
                            {pwdStrength.label}
                          </span>
                        </div>
                        {/* Bars */}
                        <div className="flex gap-1 h-1.5 w-full rounded bg-luxury-cream-200 dark:bg-luxury-purple-900 overflow-hidden mb-2">
                          {[1, 2, 3, 4, 5].map((idx) => (
                            <div
                              key={idx}
                              className={`h-full flex-grow transition-all duration-300 ${
                                idx <= pwdStrength.score ? pwdStrength.color : 'bg-transparent'
                              }`}
                            />
                          ))}
                        </div>
                        {/* Feedbacks */}
                        {pwdStrength.feedback.length > 0 && (
                          <ul className="list-disc pl-3.5 space-y-0.5 text-luxury-purple-800/60 dark:text-luxury-cream-100/50">
                            {pwdStrength.feedback.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    <Button
                      variant="primary"
                      onClick={handleNextStep}
                      icon={ArrowRight}
                      className="w-full mt-2"
                    >
                      Next Step
                    </Button>

                    {/* Google Signup */}
                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-luxury-cream-200 dark:border-luxury-purple-900"></div>
                      <span className="flex-shrink mx-4 text-xs font-bold text-luxury-purple-400 dark:text-luxury-purple-500 uppercase tracking-widest">Or</span>
                      <div className="flex-grow border-t border-luxury-cream-200 dark:border-luxury-purple-900"></div>
                    </div>

                    <Button
                      variant="google"
                      onClick={handleGoogleSignUp}
                      disabled={loading}
                      className="w-full justify-center"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                      Sign Up with Google
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-4"
                  >
                    <Input
                      label="College/University Name"
                      id="college"
                      placeholder="e.g. National Institute of Technology (NIT)"
                      icon={GraduationCap}
                      error={fieldErrors.college}
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      disabled={loading}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Degree Selection */}
                      <div className="flex flex-col gap-1.5 w-full text-left">
                        <label className="text-xs font-semibold tracking-wider uppercase text-luxury-purple-600/80 dark:text-luxury-purple-300/80 font-sans">
                          Degree Path
                        </label>
                        <select
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          disabled={loading}
                          className="w-full font-sans text-sm rounded-xl py-3 px-4 bg-luxury-cream-50/70 border text-luxury-purple-950 border-luxury-cream-200 dark:bg-luxury-purple-900/30 dark:border-luxury-purple-800/80 dark:text-luxury-cream-50 focus:outline-none focus:border-luxury-purple-400 dark:focus:border-luxury-purple-500 focus:bg-white dark:focus:bg-luxury-purple-900/60 focus:ring-4 focus:ring-luxury-purple-100 dark:focus:ring-luxury-purple-950/50"
                        >
                          {degreesList.map((deg) => (
                            <option key={deg} value={deg} className="dark:bg-luxury-purple-950">
                              {deg}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Input
                        label="Graduation Year"
                        id="graduationYear"
                        placeholder="e.g. 2027"
                        icon={Compass}
                        error={fieldErrors.graduationYear}
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        disabled={loading}
                      />
                    </div>

                    <Input
                      label="Branch / Major Field of Study"
                      id="branch"
                      placeholder="e.g. Information Technology, Electronics"
                      icon={GraduationCap}
                      error={fieldErrors.branch}
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      disabled={loading}
                    />

                    <Input
                      label="What is your Dream Career Goal?"
                      id="careerGoal"
                      placeholder="e.g. AI Ethics Lead, Quantitative Developer"
                      icon={Briefcase}
                      error={fieldErrors.careerGoal}
                      value={careerGoal}
                      onChange={(e) => setCareerGoal(e.target.value)}
                      disabled={loading}
                    />

                    <div className="flex gap-4 mt-2">
                      <Button
                        variant="outline"
                        onClick={() => setStep(1)}
                        icon={ArrowLeft}
                        className="w-1/3"
                        disabled={loading}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        icon={Check}
                        className="w-2/3"
                      >
                        Register
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Login Link */}
            <p className="text-center text-xs font-semibold text-luxury-purple-800/80 dark:text-luxury-cream-100/70 mt-6">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-luxury-purple-700 hover:text-luxury-purple-600 dark:text-luxury-peach dark:hover:text-luxury-peach-dark underline decoration-2 underline-offset-4"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
