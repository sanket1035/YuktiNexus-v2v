import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Save, GraduationCap, Laptop, Target, Plus, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileSetupPage = () => {
  const { userProfile, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Setup Form States
  const [selectedAvatar, setSelectedAvatar] = useState(
    userProfile?.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=Priya`
  );
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState(userProfile?.skills || []);
  const [dreamCareer, setDreamCareer] = useState(userProfile?.dreamCareer || '');
  
  // Editable fields (originally filled at registration)
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [college, setCollege] = useState(userProfile?.college || '');
  const [degree, setDegree] = useState(userProfile?.degree || 'B.Tech');
  const [branch, setBranch] = useState(userProfile?.branch || '');
  const [graduationYear, setGraduationYear] = useState(userProfile?.graduationYear || '');
  const [careerGoal, setCareerGoal] = useState(userProfile?.careerGoal || '');

  const avatarsList = [
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Priya',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Anya',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Maya',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Neha',
    'https://api.dicebear.com/7.x/adventurer/svg?seed=Sophia',
  ];

  const handleAddSkill = (e) => {
    e.preventDefault();
    const cleanInput = skillInput.trim();
    if (cleanInput && !skills.includes(cleanInput)) {
      setSkills([...skills, cleanInput]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (skills.length === 0) {
      setError('Please add at least one core tech skill to continue.');
      setActiveStep(2);
      return;
    }
    if (!dreamCareer.trim()) {
      setError('Please enter your dream career job role.');
      setActiveStep(3);
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        fullName,
        photoURL: selectedAvatar,
        skills,
        dreamCareer,
        college,
        degree,
        branch,
        graduationYear,
        careerGoal,
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to update your career profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stepsInfo = [
    { title: 'STEM Avatar', desc: 'Choose your profile representation' },
    { title: 'Skills & Tech Stack', desc: 'Detail your core technical capabilities' },
    { title: 'Dream Target', desc: 'Outline your professional aspiration' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Platform Welcome Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-luxury-cream-100 dark:bg-luxury-purple-900 border border-luxury-cream-250 dark:border-luxury-purple-800 text-xs font-bold text-luxury-purple-700 dark:text-luxury-peach mb-4 uppercase tracking-widest">
          <Sparkles size={13} className="animate-pulse" />
          <span>Profile Personalization Wizard</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-luxury-purple-950 dark:text-white leading-tight">
          Complete Your Career Profile
        </h1>
        <p className="text-sm font-medium text-luxury-purple-800/60 dark:text-luxury-cream-100/50 max-w-lg mx-auto leading-relaxed mt-1 font-sans">
          Let's tailor SheRise AI to your exact career goals and educational paths.
        </p>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-6 flex gap-2.5 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs font-semibold text-left">
          <span className="shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Stepper Wizard Progress Indicators */}
      <div className="flex justify-between items-center mb-10 relative px-4">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-luxury-cream-200 dark:bg-luxury-purple-900 -translate-y-1/2 z-0"></div>
        {stepsInfo.map((st, idx) => {
          const stepNum = idx + 1;
          const isCompleted = activeStep > stepNum;
          const isActive = activeStep === stepNum;
          return (
            <div key={st.title} className="flex flex-col items-center relative z-10 text-center">
              <button
                onClick={() => setActiveStep(stepNum)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white shadow-sm shadow-green-500/20'
                    : isActive
                    ? 'bg-luxury-purple-700 border-luxury-purple-700 text-white shadow-md dark:bg-luxury-purple-500 dark:border-luxury-purple-500'
                    : 'bg-white border-luxury-cream-250 text-luxury-purple-400 dark:bg-luxury-purple-950 dark:border-luxury-purple-800 dark:text-luxury-purple-500'
                }`}
              >
                {stepNum}
              </button>
              <span className="text-[10px] font-bold text-luxury-purple-850 dark:text-luxury-cream-150/70 mt-2 hidden sm:block">
                {st.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Interactive Form Panel */}
      <div className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-3xl p-8 shadow-xl text-left transition-colors duration-500">
        <AnimatePresence mode="wait">
          {activeStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h3 className="font-serif text-lg font-bold text-luxury-purple-950 dark:text-white flex items-center gap-2">
                  <GraduationCap className="text-luxury-purple-700 dark:text-luxury-peach" size={20} />
                  Select Avatar & Confirm Identity
                </h3>
                <p className="text-xs font-semibold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 mt-1">
                  Choose a luxury cartoon representation or edit your registered profile name.
                </p>
              </div>

              {/* Avatar Selector Grid */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-luxury-purple-600/80 dark:text-luxury-purple-300/80 font-sans">
                  STEM Avatar Preset
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {avatarsList.map((avatar) => (
                    <button
                      key={avatar}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`relative rounded-2xl bg-luxury-cream-50 hover:bg-luxury-cream-100 dark:bg-luxury-purple-900/30 dark:hover:bg-luxury-purple-900/60 border-2 overflow-hidden cursor-pointer transition-all duration-300 p-1 flex items-center justify-center aspect-square ${
                        selectedAvatar === avatar
                          ? 'border-luxury-purple-700 dark:border-luxury-peach scale-105 shadow-md'
                          : 'border-transparent'
                      }`}
                    >
                      <img src={avatar} alt="Avatar Preset" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Edit full name */}
              <Input
                label="Full Profile Name"
                id="fullName"
                placeholder="Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <div className="flex justify-end gap-3 mt-4 border-t border-luxury-cream-100 dark:border-luxury-purple-900 pt-6">
                <Button variant="primary" onClick={() => setActiveStep(2)} icon={ArrowRight}>
                  Continue to Skills
                </Button>
              </div>
            </motion.div>
          )}

          {activeStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h3 className="font-serif text-lg font-bold text-luxury-purple-950 dark:text-white flex items-center gap-2">
                  <Laptop className="text-luxury-purple-700 dark:text-luxury-peach" size={20} />
                  Add Technical Skills & Capabilities
                </h3>
                <p className="text-xs font-semibold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 mt-1">
                  Type in your capabilities (e.g., Python, Figma, React, SQL) and press add to attach tags.
                </p>
              </div>

              <form onSubmit={handleAddSkill} className="flex gap-3">
                <Input
                  id="skillInput"
                  placeholder="e.g. JavaScript"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  className="flex-grow"
                />
                <Button variant="outline" type="submit" icon={Plus} className="shrink-0 px-4">
                  Add Tag
                </Button>
              </form>

              {/* Skill Tag Box */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-luxury-purple-600/80 dark:text-luxury-purple-300/80 font-sans">
                  Selected Skills ({skills.length})
                </span>
                
                {skills.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-luxury-cream-250 dark:border-luxury-purple-900 rounded-2xl text-xs font-bold text-luxury-purple-400 dark:text-luxury-purple-500">
                    No skills added yet. Use the field above to register your skills.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2.5 p-4 bg-luxury-cream-50/50 dark:bg-luxury-purple-900/10 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-2xl min-h-[80px]">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-luxury-purple-100 text-luxury-purple-800 dark:bg-luxury-purple-900 dark:text-luxury-peach border border-luxury-purple-200/50 dark:border-luxury-purple-850 text-xs font-bold"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-luxury-purple-600/60 hover:text-red-500 dark:text-luxury-peach/60 dark:hover:text-red-400 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-4 border-t border-luxury-cream-100 dark:border-luxury-purple-900 pt-6">
                <Button variant="outline" onClick={() => setActiveStep(1)} icon={ArrowLeft}>
                  Back
                </Button>
                <Button variant="primary" onClick={() => setActiveStep(3)} icon={ArrowRight}>
                  Continue to Dream Role
                </Button>
              </div>
            </motion.div>
          )}

          {activeStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div>
                <h3 className="font-serif text-lg font-bold text-luxury-purple-950 dark:text-white flex items-center gap-2">
                  <Target className="text-luxury-purple-700 dark:text-luxury-peach" size={20} />
                  Select Dream Role Target
                </h3>
                <p className="text-xs font-semibold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 mt-1">
                  Specify the specific role you want to target (e.g. AI Engineer, UI/UX Designer, Data Analyst).
                </p>
              </div>

              <Input
                label="Target Professional Role"
                id="dreamCareer"
                placeholder="e.g. Frontend Engineer, Product Architect"
                value={dreamCareer}
                onChange={(e) => setDreamCareer(e.target.value)}
              />

              {/* Collapsible details preview */}
              <div className="p-4 bg-luxury-cream-50 dark:bg-luxury-purple-900/30 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-2xl text-xs flex flex-col gap-2.5">
                <span className="font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider text-[10px]">
                  Confirm Details Summary:
                </span>
                <div className="grid grid-cols-2 gap-y-1.5 text-luxury-purple-800/80 dark:text-luxury-cream-150/70 font-semibold">
                  <div>Name: <span className="text-luxury-purple-950 dark:text-white">{fullName}</span></div>
                  <div>College: <span className="text-luxury-purple-950 dark:text-white">{college}</span></div>
                  <div>Branch: <span className="text-luxury-purple-950 dark:text-white">{branch}</span></div>
                  <div>Goal: <span className="text-luxury-purple-950 dark:text-white">{careerGoal}</span></div>
                  <div className="col-span-2">Skills: <span className="text-luxury-purple-950 dark:text-white">{skills.join(', ') || 'None'}</span></div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 border-t border-luxury-cream-100 dark:border-luxury-purple-900 pt-6">
                <Button variant="outline" onClick={() => setActiveStep(2)} icon={ArrowLeft} disabled={loading}>
                  Back
                </Button>
                <Button variant="primary" onClick={() => handleSaveProfile()} loading={loading} icon={Save}>
                  Complete Setup
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default ProfileSetupPage;
