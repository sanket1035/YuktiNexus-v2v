import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Map,
  Briefcase,
  Mic,
  BarChart2,
  ChevronRight,
  TrendingUp,
  Users,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';

export const LandingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const modules = [
    {
      title: 'Authentication & User Management',
      desc: 'Secure registration, educational profiles, STEM field selection, and avatar customization.',
      icon: Users,
      badge: '✓ Module 1 — Live',
      route: '/register',
      cta: 'Get Started',
      color: 'from-luxury-purple-700 to-luxury-purple-500'
    },
    {
      title: 'AI Career Intelligence',
      desc: 'Gemini-powered resume parsing, skill-gap analysis, and personalized career roadmaps.',
      icon: Map,
      badge: '✓ Module 2 — Live',
      route: '/register',
      cta: 'Generate Roadmap',
      color: 'from-fuchsia-600 to-purple-600'
    },
    {
      title: 'Opportunity Hub',
      desc: 'AI-matched internships, hackathons, and global scholarships curated for women in STEM.',
      icon: Briefcase,
      badge: '✓ Module 3 — Live',
      route: '/register',
      cta: 'Explore Opportunities',
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'AI Interview Coach',
      desc: 'Real-time mock interview sessions with Gemini evaluation, confidence scores, and report cards.',
      icon: Mic,
      badge: '✓ Module 4 — Live',
      route: '/register',
      cta: 'Start Practice',
      color: 'from-violet-600 to-indigo-600'
    },
    {
      title: 'Career Readiness Dashboard',
      desc: 'Track progress metrics, earn STEM milestone badges, and visualize your full career timeline.',
      icon: BarChart2,
      badge: '✓ Module 5 — Live',
      route: '/register',
      cta: 'View Dashboard',
      color: 'from-luxury-peach to-luxury-purple-300'
    }
  ];

  return (
    <div className="overflow-hidden font-sans">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-6 md:px-12 bg-radial from-luxury-cream-100/50 via-luxury-cream-50 to-transparent dark:from-luxury-purple-900/30 dark:via-luxury-purple-950 dark:to-transparent">
        {/* Decorative Luxury Glows */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-luxury-peach/10 dark:bg-luxury-peach/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-luxury-purple-300/20 dark:bg-luxury-purple-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-cream-100 dark:bg-luxury-purple-900 border border-luxury-cream-250 dark:border-luxury-purple-800 text-xs font-semibold uppercase tracking-widest text-luxury-purple-700 dark:text-luxury-peach mb-8"
          >
            <Sparkles size={12} className="animate-spin" style={{ animationDuration: '4s' }} />
            <span>ElevateHer Track - Vibe2Vision 2026</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-luxury-purple-950 dark:text-white leading-[1.1] mb-6"
          >
            The AI Career Mentor for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-luxury-purple-700 via-luxury-purple-500 to-luxury-peach dark:from-luxury-cream-100 dark:via-luxury-purple-300 dark:to-luxury-peach italic font-medium">
              Women in STEM
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-luxury-purple-850/80 dark:text-luxury-cream-100/70 max-w-2xl mx-auto leading-relaxed mb-10 font-sans"
          >
            SheRise AI bridges the gap between ambition and opportunity. Discover personalized career roadmaps, analyze skills gaps, prepare for mock interviews, and unlock your true potential.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {currentUser ? (
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard')}
                icon={ArrowRight}
                className="w-full sm:w-auto px-8"
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  onClick={() => navigate('/register')}
                  icon={Sparkles}
                  className="w-full sm:w-auto px-8 py-3.5 shadow-lg shadow-luxury-purple-700/25"
                >
                  Start Your Journey
                </Button>
                <a href="#features">
                  <Button variant="outline" className="w-full sm:w-auto px-8 py-3.5">
                    Explore Modules
                  </Button>
                </a>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features / Modules Grid */}
      <section id="features" className="py-24 px-6 md:px-12 bg-white dark:bg-luxury-purple-950/40 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4">
              <CheckCircle2 size={11} />
              All 5 Modules Live
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-purple-950 dark:text-white mb-4">
              A Complete Career Intelligence Platform
            </h2>
            <p className="text-sm font-medium text-luxury-purple-800/70 dark:text-luxury-cream-100/60 leading-relaxed font-sans">
              SheRise AI is a fully shipped, modular ecosystem — every feature is live and ready for you to use today.
            </p>
          </div>

          {/* Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {modules.map((mod, idx) => (
              <motion.div
                key={mod.title}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-8 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden bg-gradient-to-b from-white to-luxury-cream-50/50 border-luxury-cream-200 shadow-sm hover:shadow-xl hover:border-luxury-purple-200 dark:from-luxury-purple-900/60 dark:to-luxury-purple-900/20 dark:border-luxury-purple-800/60 dark:hover:border-luxury-purple-700 group cursor-default"
              >
                {/* Ambient glow behind icon */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-luxury-peach/8 dark:bg-luxury-purple-600/10 rounded-full blur-3xl -z-10 group-hover:opacity-100 opacity-60 transition-opacity" />

                <div>
                  {/* Icon + Badge row */}
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${mod.color} text-white shadow-md`}>
                      <mod.icon size={20} />
                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/40">
                      {mod.badge}
                    </span>
                  </div>

                  {/* Title + desc */}
                  <h3 className="font-sans text-lg font-bold text-luxury-purple-950 dark:text-white mb-3">
                    {mod.title}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed text-luxury-purple-800/70 dark:text-luxury-cream-100/60 mb-6">
                    {mod.desc}
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => navigate(mod.route)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-luxury-purple-700 hover:text-luxury-purple-500 dark:text-luxury-peach dark:hover:text-luxury-peach-dark group/btn"
                >
                  <span>{mod.cta}</span>
                  <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 bg-luxury-cream-50 dark:bg-luxury-purple-950/70 relative">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-20">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-purple-950 dark:text-white mb-4">
              How SheRise Empowers
            </h2>
            <p className="text-sm font-medium text-luxury-purple-800/70 dark:text-luxury-cream-100/60 leading-relaxed">
              Step-by-step roadmap designed to guide users from profile creation to career placement.
            </p>
          </div>

          {/* Stepper visual */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-luxury-cream-250 dark:bg-luxury-purple-900 -translate-y-1/2 hidden md:block z-0"></div>
            
            {[
              { step: '01', title: 'Create Profile', desc: 'Secure register and setup with your educational stream, skills, and dream career path.', icon: Users },
              { step: '02', title: 'Upload Resume', desc: 'Our AI analyzes your skills, experiences, and assigns a benchmark career readiness score.', icon: TrendingUp },
              { step: '03', title: 'Skill Gap & Roadmap', desc: 'Receive a personalized, step-by-step learning journey to bridge core missing gaps.', icon: Map },
              { step: '04', title: 'Mock Interviews', desc: 'Prepare with AI-driven voice feedback, confidence grading, and customized HR prompts.', icon: Mic },
            ].map((item) => (
              <div key={item.step} className="bg-white dark:bg-luxury-purple-900 border border-luxury-cream-200 dark:border-luxury-purple-850 p-6 rounded-2xl text-left relative z-10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-serif text-2xl font-bold text-luxury-purple-400 dark:text-luxury-purple-500">{item.step}</span>
                    <div className="p-2.5 rounded-xl bg-luxury-cream-50 dark:bg-luxury-purple-950 text-luxury-purple-700 dark:text-luxury-peach">
                      <item.icon size={18} />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-luxury-purple-950 dark:text-white mb-2 font-sans">{item.title}</h4>
                  <p className="text-xs font-semibold leading-relaxed text-luxury-purple-800/70 dark:text-luxury-cream-100/60">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 md:px-12 bg-white dark:bg-luxury-purple-950/40">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-luxury-purple-950 dark:text-white mb-4">
              Empowered Journeys
            </h2>
            <p className="text-sm font-medium text-luxury-purple-800/70 dark:text-luxury-cream-100/60 leading-relaxed font-sans">
              See what aspiring women in technology say about our career intelligence concept.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "SheRise AI is exactly what I needed. Having a dedicated roadmap that points out my exact skill-gaps and guides me with recommendations is a game-changer.",
                name: "Riya Sen",
                role: "Computer Science Graduate, IIT",
                img: "https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=Riya&backgroundColor=b6e3f4"
              },
              {
                quote: "Mock interviews are usually stressful, but the friendly, constructive AI coach makes it easy to practice, evaluate body language, and track confidence levels.",
                name: "Sanya Roy",
                role: "Software Engineering Intern",
                img: "https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=Sanya&backgroundColor=c0aede"
              },
              {
                quote: "The opportunity finder aggregates STEM scholarships and hackathons that I didn't even know existed. It saves me hours of manual tracking.",
                name: "Meera Nair",
                role: "Bio-Technology Researcher",
                img: "https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=Meera&backgroundColor=ffd5dc"
              }
            ].map((test) => (
              <div key={test.name} className="p-8 rounded-3xl border border-luxury-cream-200 dark:border-luxury-purple-900 bg-luxury-cream-50/20 dark:bg-luxury-purple-900/10 text-left flex flex-col justify-between">
                <p className="text-sm font-medium italic leading-relaxed text-luxury-purple-850 dark:text-luxury-cream-100/80 mb-6">
                  "{test.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img src={test.img} alt={test.name} className="w-10 h-10 rounded-xl bg-luxury-purple-100 object-cover" />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-luxury-purple-950 dark:text-white">{test.name}</span>
                    <span className="text-[10px] text-luxury-purple-800/60 dark:text-luxury-cream-100/50 font-medium">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-radial from-luxury-purple-700/10 to-transparent dark:from-luxury-purple-900/40 dark:to-transparent border-t border-luxury-cream-200 dark:border-luxury-purple-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-luxury-purple-950 dark:text-white mb-6">
            Ready to Accelerate Your STEM Career?
          </h2>
          <p className="text-sm sm:text-base text-luxury-purple-850/80 dark:text-luxury-cream-100/70 max-w-xl mx-auto mb-10 font-sans leading-relaxed">
            Join thousands of women taking control of their careers with automated intelligence. Create your profile today.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate('/register')}
            icon={Sparkles}
            className="px-10 py-4 shadow-lg shadow-luxury-purple-700/20"
          >
            Create Your Account
          </Button>
        </div>
      </section>
    </div>
  );
};
export default LandingPage;
