// SheRise AI - Career Dashboard Page (Module 5)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Award,
  BookOpen,
  Compass,
  Briefcase,
  Mic,
  Calendar,
  Clock,
  Target,
  FileText,
  User,
  ExternalLink,
  Flame,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDashboardInsights } from '../services/gemini';
import { Button } from '../components/common/Button';
import { formatProfileName } from '../utils/validation';

// Recharts visualization imports
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const DashboardPage = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  // AI insights states
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(true);

  // Saved Opportunities from localStorage
  const [savedOpportunities, setSavedOpportunities] = useState([]);

  // Fetch AI insights from Gemini/mock service
  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      try {
        const goal = userProfile?.careerGoal || 'AI Engineer';
        const skills = userProfile?.skills || ['Python', 'React', 'Git'];
        const score = userProfile?.careerReadinessScore || 75;
        
        const data = await getDashboardInsights(goal, skills, score);
        setInsights(data);
      } catch (e) {
        console.error("Failed to load dashboard insights:", e);
      } finally {
        setLoadingInsights(false);
      }
    };

    fetchInsights();
  }, [userProfile]);

  // Load saved opportunities from localStorage
  useEffect(() => {
    const savedIdsString = localStorage.getItem('sherise_saved_opportunities');
    if (savedIdsString) {
      try {
        const savedIds = JSON.parse(savedIdsString);
        // Load mock opportunity details to display
        const allOpps = [
          { id: "opp-1", title: "Google STEP Internship 2026", org: "Google", category: "Internships", deadline: "8 days left" },
          { id: "opp-2", title: "Microsoft SWE Summer Intern", org: "Microsoft", category: "Internships", deadline: "15 days left" },
          { id: "opp-3", title: "Adobe Women-in-Tech Scholarship", org: "Adobe", category: "Scholarships", deadline: "20 days left" },
          { id: "opp-4", title: "Generation Google Scholarship (APAC)", org: "Google", category: "Scholarships", deadline: "14 days left" },
          { id: "opp-5", title: "Smart India Hackathon - WIE track", org: "Govt of India", category: "Hackathons", deadline: "5 days left" },
          { id: "opp-6", title: "SheBuilds Global STEM Hackathon", org: "Women Who Code", category: "Hackathons", deadline: "18 days left" },
        ];
        const matched = allOpps.filter(o => savedIds.includes(o.id));
        setSavedOpportunities(matched);
      } catch (e) {
        console.error("Failed to load saved opportunities on dashboard:", e);
      }
    }
  }, []);

  // Quick Stats config
  const quickStats = [
    { title: 'Career Readiness', value: '82%', desc: 'Module 2 Completed', icon: Target, color: 'text-luxury-purple-700 bg-luxury-purple-500/10 dark:text-luxury-peach dark:bg-luxury-purple-900/40' },
    { title: 'Resume ATS Score', value: '85%', desc: 'Upload scanned recently', icon: FileText, color: 'text-green-600 bg-green-500/10' },
    { title: 'Interview Score', value: '80%', desc: 'Module 4 Practice average', icon: Mic, color: 'text-blue-500 bg-blue-500/10' },
    { title: 'Learning Progress', value: '60%', desc: 'Roadmap timeline status', icon: BookOpen, color: 'text-amber-500 bg-amber-500/10' },
  ];

  // Recharts Chart Data
  const readinessHistory = [
    { name: 'Month 1', score: 25 },
    { name: 'Month 2', score: 48 },
    { name: 'Month 3', score: 65 },
    { name: 'Month 4', score: 82 }
  ];

  const skillGrowthData = [
    { name: 'Python', Current: 70, Target: 90 },
    { name: 'React', Current: 90, Target: 95 },
    { name: 'Docker', Current: 30, Target: 80 },
    { name: 'ML/PyTorch', Current: 40, Target: 85 },
    { name: 'Git', Current: 80, Target: 95 }
  ];

  const weeklyLearningHours = [
    { name: 'Mon', hours: 2.5 },
    { name: 'Tue', hours: 3.2 },
    { name: 'Wed', hours: 1.5 },
    { name: 'Thu', hours: 4.0 },
    { name: 'Fri', hours: 3.5 },
    { name: 'Sat', hours: 5.0 },
    { name: 'Sun', hours: 2.0 }
  ];

  // Roadmap Timeline List
  const roadmapStages = [
    { title: 'Master Python & PyTorch', desc: 'Syntax, tensor arithmetic, Pandas arrays', status: 'completed' },
    { title: 'Build local RAG & Vector Indexing', desc: 'ChromaDB, FastAPI, Gemini model prompts', status: 'current' },
    { title: 'Learn Containerization & Docker', desc: 'Write Dockerfiles, port mapping, microservice deploy', status: 'upcoming' },
    { title: 'Machine Learning Foundations', desc: 'Supervised/unsupervised algorithms', status: 'upcoming' },
    { title: 'Open-Source contributions', desc: 'Submitting PRs to STEM repositories', status: 'upcoming' }
  ];

  // Achievement badges
  const achievements = [
    { name: 'Resume Uploaded', desc: 'Benchmark completed', icon: FileText, unlocked: true },
    { name: 'Roadmap Generated', desc: 'Goal tracks configured', icon: Compass, unlocked: true },
    { name: 'First Interview Done', desc: 'Module 4 Practice session', icon: Mic, unlocked: true },
    { name: 'Streak Builder', desc: 'Active 3-day login goal', icon: Flame, unlocked: false }
  ];

  // Recent activity logs
  const activities = [
    { action: 'Completed Technical Mock Interview', time: '2 hours ago', icon: Mic, color: 'border-blue-500' },
    { action: 'Bookmarked Google STEP Internship 2026', time: 'Yesterday', icon: Briefcase, color: 'border-luxury-purple-500' },
    { action: 'Generated STEM Skill-Gap Roadmap', time: '2 days ago', icon: Compass, color: 'border-green-500' },
    { action: 'Completed profile customization', time: '3 days ago', icon: User, color: 'border-amber-500' }
  ];

  // Upcoming Deadlines list
  const deadlines = [
    { title: 'Smart India Hackathon WIE', org: 'Govt of India', days: 5, color: 'text-red-500' },
    { title: 'Google STEP Internship', org: 'Google', days: 8, color: 'text-amber-500' },
    { title: 'Generation Google Scholarship', org: 'Google', days: 14, color: 'text-green-500' }
  ];

  // Download entire career assessment report PDF
  const handleDownloadExecutiveReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>SheRise AI - Executive Career Assessment Profile</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #120b24; background: #fff; line-height: 1.5; }
            .header { text-align: center; border-bottom: 2px solid #5b4b8a; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 26px; font-weight: bold; color: #5b4b8a; letter-spacing: -0.5px; }
            .title { font-size: 20px; font-weight: bold; margin-top: 10px; color: #120b24; }
            .meta-info { font-size: 12px; color: #6b7280; margin-top: 5px; }
            .section { margin-bottom: 35px; page-break-inside: avoid; }
            .section-title { font-size: 15px; font-weight: 800; border-bottom: 1.5px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 15px; color: #5b4b8a; text-transform: uppercase; letter-spacing: 1px; }
            .grid-3 { display: grid; grid-template-cols: 1fr 1fr 1fr; gap: 20px; }
            .score-card { border: 1px solid #e5e7eb; border-radius: 14px; padding: 18px; text-align: center; background: #faf8f5; }
            .score-val { font-size: 32px; font-weight: 800; color: #5b4b8a; margin: 10px 0; }
            .disclaimer { font-size: 10px; color: #9ca3af; text-align: center; margin-top: 50px; border-top: 1px solid #e5e7eb; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SheRise AI</div>
            <div class="title">Executive Career Assessment Profile</div>
            <div class="meta-info">Generated on ${new Date().toLocaleDateString()} for ${userProfile?.fullName || 'STEM Student'}</div>
          </div>

          <div class="section">
            <div class="section-title">Core Performance Metrics</div>
            <div class="grid-3">
              <div class="score-card">
                <div style="font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Career Readiness Alignment</div>
                <div class="score-val">82%</div>
                <div style="font-size: 10px; color:#5b4b8a; font-weight:bold;">${userProfile?.careerGoal || 'AI Engineer'} Track</div>
              </div>
              <div class="score-card">
                <div style="font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase;">ATS Resume Score</div>
                <div class="score-val">85%</div>
                <div style="font-size: 10px; color:#6b7280;">Structure Verified</div>
              </div>
              <div class="score-card">
                <div style="font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Interview Practice Score</div>
                <div class="score-val">80%</div>
                <div style="font-size: 10px; color:#6b7280;">Module 4 Assessment</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Weekly AI Recommendations & Insights</div>
            <p style="font-size:13.5px; color:#374151; line-height:1.6;">
              <strong>Active Focus Recommendation:</strong> ${insights?.weeklyRecommendation || 'Implement containerization using Docker.'}
            </p>
            <p style="font-size:13.5px; color:#374151; line-height:1.6; margin-top:10px;">
              <strong>Motivational Quote:</strong> "${insights?.motivationalInsight || 'Your coding consistency is high. Take the leap and submit your first open-source PR!'}"
            </p>
          </div>

          <div class="disclaimer">
            <p>Scorecards are compiled using Google Gemini AI model configurations.</p>
            <p>© ${new Date().getFullYear()} SheRise AI. All Rights Reserved.</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8 text-left font-sans"
    >
      
      {/* Welcome Banner and Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-luxury-cream-100 dark:bg-luxury-purple-900 border border-luxury-cream-250 dark:border-luxury-purple-800 text-xs font-bold text-luxury-purple-700 dark:text-luxury-peach mb-3 uppercase tracking-widest">
            <Sparkles size={12} className="text-luxury-purple-500 dark:text-luxury-peach" />
            <span>Active Dashboard Portal</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-luxury-purple-950 dark:text-white leading-tight">
            Welcome back, {formatProfileName(userProfile?.fullName) || 'STEM Recruit'}!
          </h1>
          <p className="text-sm font-medium text-luxury-purple-800/60 dark:text-luxury-cream-100/50 mt-1">
            Tracking your placements readiness, mock interview history, and active milestones.
          </p>
        </div>

        {/* Quick Actions Panel */}
        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="outline"
            onClick={handleDownloadExecutiveReport}
            icon={Download}
            className="bg-white/50 border-luxury-cream-300 dark:border-luxury-purple-800 text-luxury-purple-950 dark:text-white"
          >
            Download Executive Report
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/interview')}
            icon={Mic}
          >
            Practice Interviews
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              className="p-6 bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[22px] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-extrabold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-luxury-purple-950 dark:text-white font-sans">
                {stat.value}
              </h3>
              <p className="text-[10px] font-bold text-luxury-purple-800/55 dark:text-luxury-cream-150/40 mt-1 leading-snug">
                {stat.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic AI Insights Banner */}
      <AnimatePresence>
        {insights && !loadingInsights && (
          <motion.div
            variants={cardVariants}
            className="relative p-[1px] rounded-[24px] bg-gradient-to-tr from-luxury-purple-700 via-luxury-cream-300 to-luxury-peach shadow-lg overflow-hidden"
          >
            <div className="glass dark:bg-luxury-purple-950/80 p-6 sm:p-8 rounded-[24px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 text-left">
              <div className="flex-grow flex flex-col gap-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-purple-100 dark:bg-luxury-purple-900 text-luxury-purple-850 dark:text-luxury-peach text-[10px] font-bold uppercase tracking-wider w-fit">
                  <Sparkles size={11} className="text-luxury-purple-700 dark:text-luxury-peach animate-pulse" />
                  <span>AI Learning Insights & Goals</span>
                </div>
                <h3 className="font-serif text-lg font-extrabold text-luxury-purple-950 dark:text-white">
                  Weekly Placement Plan Recommendation
                </h3>
                <p className="text-sm font-semibold leading-relaxed text-luxury-purple-900/90 dark:text-luxury-cream-100/80 font-sans max-w-3xl">
                  {insights.weeklyRecommendation}
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-luxury-purple-800/80 dark:text-luxury-cream-100/50 mt-1">
                  <span><strong>Next Milestone:</strong> {insights.nextMilestone}</span>
                  <span><strong>Reminder:</strong> {insights.learningReminder}</span>
                </div>
              </div>

              {/* Priority skills chips */}
              <div className="flex flex-col gap-2 shrink-0 self-start md:self-center">
                <span className="text-[10px] font-extrabold uppercase text-luxury-purple-500 tracking-wider">Priority Skill Gaps</span>
                <div className="flex gap-2">
                  {insights.prioritySkills?.map(skill => (
                    <span key={skill} className="text-[9px] font-bold bg-white text-luxury-purple-800 border border-luxury-cream-250 dark:bg-luxury-purple-900 dark:text-luxury-peach dark:border-luxury-purple-800 py-1 px-2.5 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Readiness Curve & Learning Hours (2 Columns) */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Chart 1: Area chart showing readiness progression */}
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-6 text-left">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-luxury-purple-700 dark:text-luxury-peach" size={18} />
                <h3 className="font-sans text-sm font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider">
                  Readiness Progression Curve
                </h3>
              </div>
            </div>
            
            <div className="h-64 w-full font-sans text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={readinessHistory}>
                  <defs>
                    <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#5B4B8A" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#D6C5F2" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-luxury-purple-900" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#5B4B8A" fillOpacity={1} fill="url(#readinessGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Double Column Grid: Skill Growth & Weekly Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Skill Target Gap Compare Bar Chart */}
            <motion.div
              variants={cardVariants}
              className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 shadow-sm flex flex-col justify-between"
            >
              <div className="pb-3 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-4 text-left">
                <h3 className="font-sans text-xs font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider">
                  Skill Ratings vs Goal Target
                </h3>
              </div>
              
              <div className="h-48 w-full font-sans text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillGrowthData}>
                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 8, fontWeight: 750 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 8 }} />
                    <Tooltip />
                    <Bar dataKey="Current" fill="#D6C5F2" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Target" fill="#5B4B8A" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Weekly Study hours log chart */}
            <motion.div
              variants={cardVariants}
              className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 shadow-sm flex flex-col justify-between"
            >
              <div className="pb-3 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-4 text-left">
                <h3 className="font-sans text-xs font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider">
                  Weekly Study Hours logged
                </h3>
              </div>

              <div className="h-48 w-full font-sans text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyLearningHours}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-luxury-purple-900" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 8 }} />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 8 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="hours" stroke="#22c55e" fill="#e8fcf0" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

          </div>

        </div>

        {/* Timeline Roadmap & Upcoming Deadlines (1 Column) */}
        <div className="flex flex-col gap-8">
          
          {/* Animated Roadmap Step checklist */}
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 shadow-sm text-left"
          >
            <div className="pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-5">
              <div className="flex items-center gap-2">
                <Compass className="text-luxury-purple-700 dark:text-luxury-peach" size={18} />
                <h3 className="font-sans text-sm font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider">
                  Personalized Roadmap Steps
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {roadmapStages.map((stage, idx) => (
                <div key={idx} className="flex gap-3 text-xs items-start">
                  <div className="flex flex-col items-center">
                    {stage.status === 'completed' ? (
                      <div className="w-5 h-5 rounded-full bg-green-150 text-green-700 dark:bg-green-950/20 dark:text-green-400 flex items-center justify-center font-bold text-[9px] shrink-0">
                        ✓
                      </div>
                    ) : stage.status === 'current' ? (
                      <div className="w-5 h-5 rounded-full bg-luxury-purple-700 text-white flex items-center justify-center font-bold text-[9px] shrink-0 animate-pulse">
                        ●
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-luxury-cream-100 dark:bg-luxury-purple-900 text-luxury-purple-400 flex items-center justify-center font-bold text-[9px] shrink-0">
                        {idx + 1}
                      </div>
                    )}
                    {idx < roadmapStages.length - 1 && <div className="w-0.5 h-10 bg-luxury-cream-200 dark:bg-luxury-purple-900 mt-2"></div>}
                  </div>
                  <div>
                    <h4 className="font-bold text-luxury-purple-950 dark:text-white">{stage.title}</h4>
                    <p className="text-[10px] text-luxury-purple-800/60 dark:text-luxury-cream-150/50 mt-0.5 leading-normal">{stage.desc}</p>
                    <span className={`text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded block mt-1 w-fit ${
                      stage.status === 'completed'
                        ? 'bg-green-50 text-green-700 dark:bg-green-950/20'
                        : stage.status === 'current'
                        ? 'bg-luxury-purple-100 text-luxury-purple-750 dark:bg-luxury-purple-900 dark:text-luxury-peach'
                        : 'bg-luxury-cream-100 text-luxury-purple-400 dark:bg-luxury-purple-900/60'
                    }`}>
                      {stage.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming deadlines countdown panel */}
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 shadow-sm text-left"
          >
            <div className="pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="text-luxury-purple-700 dark:text-luxury-peach" size={18} />
                <h3 className="font-sans text-sm font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider">
                  Upcoming STEM Deadlines
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {deadlines.map((dl, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-luxury-cream-50 dark:bg-luxury-purple-900/10 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-xl">
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-luxury-purple-950 dark:text-white leading-tight">{dl.title}</h4>
                    <span className="text-[10px] text-luxury-purple-500 font-semibold">{dl.org}</span>
                  </div>
                  <span className={`text-[10px] font-extrabold shrink-0 ${dl.color}`}>
                    {dl.days} days left
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bookmarked Saved Opportunities List & Unlockable Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Saved bookmarked Opportunities (2 Columns) */}
        <div className="lg:col-span-2 flex flex-col">
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 sm:p-8 shadow-sm flex-grow"
          >
            <div className="flex justify-between items-center pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-6">
              <div className="flex items-center gap-2">
                <Briefcase className="text-luxury-purple-700 dark:text-luxury-peach" size={18} />
                <h3 className="font-sans text-sm font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider">
                  Bookmarked STEM Listings
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-luxury-purple-100 text-luxury-purple-700 dark:bg-luxury-purple-900 dark:text-luxury-peach py-1 px-3 rounded-lg uppercase tracking-wider">
                Saved Listings
              </span>
            </div>

            {savedOpportunities.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-2 text-luxury-purple-400">
                <Briefcase size={28} className="stroke-1" />
                <span className="text-xs font-semibold text-luxury-purple-800/60 dark:text-luxury-cream-100/50">
                  No bookmarked listings. Save opportunities from the Opportunity Hub to view them here.
                </span>
                <Button variant="outline" className="mt-2 text-xs" onClick={() => navigate('/opportunities')}>
                  Discover Opportunities
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {savedOpportunities.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-4 bg-luxury-cream-50/20 dark:bg-luxury-purple-900/10 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-2xl flex flex-col justify-between gap-3 group hover:border-luxury-purple-300 transition-colors"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-extrabold uppercase text-luxury-purple-500 dark:text-luxury-peach">{opp.category}</span>
                        <span className="text-[9px] font-bold text-amber-500">{opp.deadline}</span>
                      </div>
                      <h4 className="text-xs font-bold text-luxury-purple-950 dark:text-white leading-tight">
                        {opp.title}
                      </h4>
                      <p className="text-[10px] text-luxury-purple-400 dark:text-luxury-purple-300 font-bold mt-0.5">{opp.org}</p>
                    </div>

                    <a href="https://careers.google.com" target="_blank" rel="noopener noreferrer" className="self-end mt-2">
                        <button className="text-[10px] font-bold py-1.5 px-3 rounded-lg bg-luxury-purple-700 text-white hover:bg-luxury-purple-600 transition-colors flex items-center gap-1 cursor-pointer">
                        <span>Quick Apply</span>
                        <ExternalLink size={10} />
                      </button>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Unlockable Achievement Badges (1 Column) */}
        <div className="flex flex-col">
          <motion.div
            variants={cardVariants}
            className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 sm:p-8 shadow-sm flex-grow text-left"
          >
            <div className="pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-6">
              <div className="flex items-center gap-2">
                <Award className="text-luxury-purple-700 dark:text-luxury-peach" size={18} />
                <h3 className="font-sans text-sm font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider">
                  Readiness Milestones
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {achievements.map((ach, idx) => {
                const Icon = ach.icon;
                return (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-2 ${
                      ach.unlocked
                        ? 'bg-luxury-cream-50/20 border-luxury-cream-200 dark:bg-luxury-purple-900/10 dark:border-luxury-purple-900'
                        : 'bg-luxury-cream-50/10 border-luxury-cream-150/40 dark:bg-luxury-purple-900/5 opacity-40'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      ach.unlocked 
                        ? 'bg-luxury-purple-100 text-luxury-purple-750 dark:bg-luxury-purple-900 dark:text-luxury-peach' 
                        : 'bg-luxury-cream-100 text-luxury-purple-400'
                    }`}>
                      <Icon size={16} />
                    </div>
                    <h4 className="text-[10px] font-bold text-luxury-purple-950 dark:text-white leading-tight">
                      {ach.name}
                    </h4>
                    <span className="text-[8px] font-semibold text-luxury-purple-500 mt-0.5 block leading-none">
                      {ach.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

      </div>

      {/* Chronological Recent Activity log */}
      <motion.div
        variants={cardVariants}
        className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 sm:p-8 shadow-sm text-left"
      >
        <div className="pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="text-luxury-purple-700 dark:text-luxury-peach" size={18} />
            <h3 className="font-sans text-sm font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider">
              Recent Placement Actions
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          {activities.map((act, idx) => {
            const Icon = act.icon;
            return (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex gap-3 items-center min-w-0">
                  <div className={`w-7.5 h-7.5 rounded-xl bg-luxury-cream-100 dark:bg-luxury-purple-900 flex items-center justify-center text-luxury-purple-700 dark:text-luxury-peach shrink-0`}>
                    <Icon size={14} />
                  </div>
                  <span className="font-bold text-luxury-purple-950 dark:text-white truncate">
                    {act.action}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-luxury-purple-400 shrink-0 italic ml-4">
                  {act.time}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

    </motion.div>
  );
};

export default DashboardPage;
