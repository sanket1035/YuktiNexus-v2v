import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Award,
  BookOpen,
  ArrowUpRight,
  Lock,
  Compass,
  Briefcase,
  Mic,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


export const DashboardPage = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const quickStats = [
    { title: 'Profile Status', value: 'Complete', desc: 'Step 1 verification active', icon: Layers, color: 'text-green-500 bg-green-500/10' },
    { title: 'STEM Career Points', value: '150 XP', desc: '+50 XP for profile setup', icon: Award, color: 'text-luxury-purple-700 bg-luxury-purple-500/10 dark:text-luxury-peach dark:bg-luxury-purple-900/40' },
    { title: 'Modules Complete', value: '1 / 5', desc: 'Module 1 Active', icon: BookOpen, color: 'text-amber-500 bg-amber-500/10' },
    { title: 'Target Readiness', value: '25%', desc: 'Pending Module 2 Audit', icon: TrendingUp, color: 'text-blue-500 bg-blue-500/10' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8 text-left"
    >
      {/* Welcome Banner Banner */}
      <motion.div
        variants={cardVariants}
        className="p-8 sm:p-10 rounded-3xl bg-gradient-to-tr from-luxury-purple-950 via-luxury-purple-700 to-luxury-purple-600 dark:from-luxury-purple-950 dark:via-luxury-purple-900 dark:to-luxury-purple-800 border border-transparent shadow-xl relative overflow-hidden text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-peach/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-luxury-purple-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-luxury-peach mb-4">
            <Sparkles size={11} className="animate-pulse" />
            <span>Welcome to SheRise Portal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">
            Welcome, {userProfile?.fullName || 'STEM Student'}!
          </h1>
          <p className="text-sm text-luxury-cream-50/80 leading-relaxed font-sans max-w-xl">
            You are officially registered. Your target career is set to <span className="font-bold text-luxury-peach">{userProfile?.dreamCareer || 'Tech Architect'}</span>. Ready to audit your path?
          </p>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {quickStats.map((stat, idx) => (
          <motion.div
            key={stat.title}
            variants={cardVariants}
            whileHover={{ y: -4 }}
            className="p-6 bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 uppercase tracking-wider">
                {stat.title}
              </span>
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <stat.icon size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-luxury-purple-950 dark:text-white font-sans">
              {stat.value}
            </h3>
            <p className="text-[11px] font-semibold text-luxury-purple-800/55 dark:text-luxury-cream-150/40 mt-1 leading-snug">
              {stat.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Grid: Future Module Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Double Column: Roadmap & Opportunities */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Module 2: AI Roadmap Preview */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            onClick={() => navigate('/roadmap')}
            className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 p-6 rounded-3xl shadow-sm relative overflow-hidden cursor-pointer group transition-all"
          >
            <div className="flex justify-between items-center pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-5">
              <div className="flex items-center gap-2">
                <Compass className="text-luxury-purple-700 dark:text-luxury-peach group-hover:rotate-12 transition-transform" size={18} />
                <h3 className="font-sans text-sm font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider">
                  AI Career Roadmap
                </h3>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-luxury-purple-100 text-luxury-purple-700 dark:bg-luxury-purple-900 dark:text-luxury-peach px-2 py-0.5 rounded">
                Active Module 2
              </span>
            </div>

            {/* Stepper Timeline Graphic */}
            <div className="space-y-6">
              {[
                { title: 'Core Skill Gap Audit', desc: 'Parsing target fields and identifying missing tools', status: 'active' },
                { title: 'STEM Roadmap Generation', desc: 'Custom 6-month timeline mapped to career roles', status: 'active' },
                { title: 'Portfolio Project Suggestions', desc: 'Structured projects with estimated timeframes', status: 'active' }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start text-left">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-luxury-purple-100 dark:bg-luxury-purple-900 text-luxury-purple-700 dark:text-luxury-peach flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    {idx < 2 && <div className="w-0.5 h-10 bg-luxury-cream-200 dark:bg-luxury-purple-900 mt-2"></div>}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-luxury-purple-950 dark:text-white">{item.title}</h4>
                    <p className="text-[10px] text-luxury-purple-850/80 dark:text-luxury-cream-150/60 leading-normal mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-luxury-purple-700 dark:text-luxury-peach group-hover:translate-x-0.5 transition-transform">
                Open Career Intelligence <ArrowUpRight size={12} />
              </span>
            </div>
          </motion.div>

          {/* Module 3: Opportunity Matcher Preview */}
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 p-6 rounded-3xl shadow-sm relative overflow-hidden"
          >
            {/* Locked Cover */}
            <div className="absolute inset-0 bg-white/40 dark:bg-luxury-purple-950/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-2xl bg-luxury-cream-100 dark:bg-luxury-purple-900/80 text-luxury-purple-750 dark:text-luxury-peach flex items-center justify-center border border-luxury-cream-200 dark:border-luxury-purple-850 shadow-md mb-3">
                <Lock size={20} />
              </div>
              <h4 className="text-sm font-bold text-luxury-purple-950 dark:text-white">
                Module 3 Integration Point
              </h4>
              <p className="text-[11px] font-semibold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 max-w-sm mt-1 leading-relaxed">
                Aggregates active STEM internships, global hackathons, and scholarships.
              </p>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-5 relative z-0">
              <div className="flex items-center gap-2">
                <Briefcase className="text-luxury-purple-700 dark:text-luxury-peach" size={18} />
                <h3 className="font-sans text-sm font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider">
                  Matched STEM Opportunities
                </h3>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-luxury-cream-100 text-luxury-purple-800 px-2 py-0.5 rounded">
                Module 3
              </span>
            </div>

            {/* List dummy graphic */}
            <div className="flex flex-col gap-4 relative z-0 opacity-40">
              {[
                { title: 'STEP Internship 2026', type: 'Google', tags: ['Software Eng', 'Summer 2026'] },
                { title: 'Women Techmakers Scholarship', type: 'Adobe', tags: ['Scholarship', '₹2,00,000 Grant'] }
              ].map((opp, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-luxury-cream-50 dark:bg-luxury-purple-900/20 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-2xl">
                  <div>
                    <h4 className="text-xs font-bold text-luxury-purple-950 dark:text-luxury-cream-100">{opp.title}</h4>
                    <span className="text-[10px] text-luxury-purple-500 font-bold dark:text-luxury-peach">{opp.type}</span>
                  </div>
                  <div className="flex gap-2">
                    {opp.tags.map((t, i) => (
                      <span key={i} className="text-[8px] font-bold bg-white text-luxury-purple-800 border border-luxury-cream-250 dark:bg-luxury-purple-900 dark:text-luxury-cream-100 py-0.5 px-2 rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Single Column: AI Interview Coach & Activity */}
        <div className="flex flex-col gap-8">
          
          {/* Module 4: AI Interview Coach */}
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 p-6 rounded-3xl shadow-sm relative overflow-hidden"
          >
            {/* Locked Cover */}
            <div className="absolute inset-0 bg-white/40 dark:bg-luxury-purple-950/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-2xl bg-luxury-cream-100 dark:bg-luxury-purple-900/80 text-luxury-purple-750 dark:text-luxury-peach flex items-center justify-center border border-luxury-cream-200 dark:border-luxury-purple-850 shadow-md mb-3">
                <Lock size={20} />
              </div>
              <h4 className="text-sm font-bold text-luxury-purple-950 dark:text-white">
                Module 4 Integration Point
              </h4>
              <p className="text-[11px] font-semibold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 max-w-xs mt-1 leading-relaxed">
                Custom voice-based mock interviews with feedback & confidence evaluation.
              </p>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-5 relative z-0">
              <div className="flex items-center gap-2">
                <Mic className="text-luxury-purple-700 dark:text-luxury-peach" size={18} />
                <h3 className="font-sans text-sm font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider">
                  AI Interview Coach
                </h3>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-luxury-cream-100 text-luxury-purple-800 px-2 py-0.5 rounded">
                Module 4
              </span>
            </div>

            <div className="flex flex-col gap-4 relative z-0 opacity-40">
              <div className="flex justify-around items-center py-2">
                <div className="text-center">
                  <span className="text-[10px] text-luxury-purple-400 font-bold uppercase block">Technical</span>
                  <span className="text-xl font-bold text-luxury-purple-950 dark:text-white">--</span>
                </div>
                <div className="w-px h-8 bg-luxury-cream-200 dark:bg-luxury-purple-900"></div>
                <div className="text-center">
                  <span className="text-[10px] text-luxury-purple-400 font-bold uppercase block">Confidence</span>
                  <span className="text-xl font-bold text-luxury-purple-950 dark:text-white">--</span>
                </div>
              </div>
              <button disabled className="w-full py-2.5 rounded-xl bg-luxury-cream-100 border border-luxury-cream-250 text-xs font-bold text-luxury-purple-400 cursor-not-allowed">
                Launch Audio Simulator
              </button>
            </div>
          </motion.div>

          {/* Module 5: Activity Feed & Milestones */}
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 p-6 rounded-3xl shadow-sm relative overflow-hidden"
          >
            {/* Locked Cover */}
            <div className="absolute inset-0 bg-white/40 dark:bg-luxury-purple-950/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
              <div className="w-12 h-12 rounded-2xl bg-luxury-cream-100 dark:bg-luxury-purple-900/80 text-luxury-purple-750 dark:text-luxury-peach flex items-center justify-center border border-luxury-cream-200 dark:border-luxury-purple-850 shadow-md mb-3">
                <Lock size={20} />
              </div>
              <h4 className="text-sm font-bold text-luxury-purple-950 dark:text-white">
                Module 5 Integration Point
              </h4>
              <p className="text-[11px] font-semibold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 max-w-xs mt-1 leading-relaxed">
                Aggregates learning timelines, analytics graphs, and performance metrics.
              </p>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-5 relative z-0">
              <div className="flex items-center gap-2">
                <Calendar className="text-luxury-purple-700 dark:text-luxury-peach" size={18} />
                <h3 className="font-sans text-sm font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider">
                  Timeline & Milestones
                </h3>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest bg-luxury-cream-100 text-luxury-purple-800 px-2 py-0.5 rounded">
                Module 5
              </span>
            </div>

            {/* Timelines Dummy */}
            <div className="relative z-0 opacity-40 text-xs">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Registered & profile personalized</span>
                </div>
                <div className="flex gap-2 text-luxury-purple-400">
                  <span>○</span>
                  <span>Resume upload benchmark</span>
                </div>
                <div className="flex gap-2 text-luxury-purple-400">
                  <span>○</span>
                  <span>Complete Python roadmap modules</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
export default DashboardPage;
