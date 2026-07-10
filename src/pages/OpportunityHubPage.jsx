import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  Bookmark,
  ExternalLink,
  Calendar,
  Filter,
  AlertCircle,
  Users
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getOpportunityRecommendations } from '../services/gemini';
import { Button } from '../components/common/Button';

export const OpportunityHubPage = () => {
  const { userProfile } = useAuth();

  // Core filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('match'); // 'match', 'deadline', 'newest'
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  // Data fetching states
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedIds, setSavedIds] = useState([]);

  // Category Catalog List
  const categories = [
    'All',
    'Internships',
    'Hackathons',
    'Scholarships',
    'Open Source',
    'Competitions',
    'Women Communities',
    'Mentorship Programs',
    'Remote Jobs',
    'Certifications',
    'Conferences'
  ];

  // Load bookmarked item IDs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sherise_saved_opportunities');
    if (saved) {
      try {
        setSavedIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookmarked opportunities:", e);
      }
    }
  }, []);

  // Sync bookmark updates to localStorage
  const handleToggleBookmark = (id) => {
    let updated;
    if (savedIds.includes(id)) {
      updated = savedIds.filter(savedId => savedId !== id);
    } else {
      updated = [...savedIds, id];
    }
    setSavedIds(updated);
    localStorage.setItem('sherise_saved_opportunities', JSON.stringify(updated));
  };

  // Fetch opportunities on load or when user profile updates
  const fetchOpportunities = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const targetGoal = userProfile?.careerGoal || 'AI Engineer';
      const targetSkills = userProfile?.skills || ['Python', 'React', 'Git'];
      const targetReadiness = userProfile?.careerReadinessScore || 65;

      const data = await getOpportunityRecommendations(targetGoal, targetSkills, targetReadiness);
      setOpportunities(data);
    } catch (err) {
      console.error(err);
      setError("Unable to retrieve personalized opportunities. Please check your network and retry.");
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  // Handle Search, Filters, and Sorting logic locally
  const filteredOpportunities = opportunities
    .filter(opp => {
      // Keyword match
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = 
        opp.title.toLowerCase().includes(query) ||
        opp.organization.toLowerCase().includes(query) ||
        opp.description.toLowerCase().includes(query) ||
        opp.eligibility.toLowerCase().includes(query);
      
      // Category match
      const matchCategory = selectedCategory === 'All' || opp.category === selectedCategory;

      // Location match
      const matchLocation = selectedLocation === 'All' || opp.locationType === selectedLocation;

      // Difficulty match
      const matchDifficulty = selectedDifficulty === 'All' || opp.difficulty === selectedDifficulty;

      // Saved only match
      const matchSaved = !showSavedOnly || savedIds.includes(opp.id);

      return matchQuery && matchCategory && matchLocation && matchDifficulty && matchSaved;
    })
    .sort((a, b) => {
      if (sortBy === 'match') {
        return b.matchScore - a.matchScore;
      }
      if (sortBy === 'deadline') {
        return a.deadlineDays - b.deadlineDays;
      }
      if (sortBy === 'newest') {
        // Mock newest sort: higher IDs or reverse order
        return b.id.localeCompare(a.id);
      }
      return 0;
    });

  // Top recommendation banner opportunity (highest match score)
  const topRecommendation = opportunities.length > 0 
    ? [...opportunities].sort((a, b) => b.matchScore - a.matchScore)[0] 
    : null;

  // Render SVG branding logos dynamically based on company names
  const renderOrgLogo = (orgName) => {
    const letter = orgName ? orgName.charAt(0).toUpperCase() : 'S';
    let bgColor = 'bg-luxury-purple-700 text-white';
    
    if (orgName.toLowerCase().includes('google')) {
      bgColor = 'bg-blue-600 text-white dark:bg-blue-700';
    } else if (orgName.toLowerCase().includes('microsoft')) {
      bgColor = 'bg-teal-600 text-white dark:bg-teal-700';
    } else if (orgName.toLowerCase().includes('adobe')) {
      bgColor = 'bg-red-600 text-white dark:bg-red-700';
    } else if (orgName.toLowerCase().includes('aws') || orgName.toLowerCase().includes('amazon')) {
      bgColor = 'bg-orange-500 text-white dark:bg-orange-650';
    } else if (orgName.toLowerCase().includes('india') || orgName.toLowerCase().includes('govt')) {
      bgColor = 'bg-emerald-600 text-white dark:bg-emerald-700';
    }

    return (
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-sm shadow-md shrink-0 transition-transform group-hover:scale-105 ${bgColor}`}>
        {letter}
      </div>
    );
  };

  // Motion animation parameters
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const cardVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <div className="font-sans text-left">
      
      {/* Header Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-luxury-cream-100 dark:bg-luxury-purple-900 border border-luxury-cream-250 dark:border-luxury-purple-800 text-xs font-bold text-luxury-purple-700 dark:text-luxury-peach mb-3 uppercase tracking-widest">
            <Sparkles size={12} className="text-luxury-purple-500 dark:text-luxury-peach" />
            <span>Module 3 - Opportunity Hub</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-luxury-purple-950 dark:text-white leading-tight">
            STEM Opportunity Finder
          </h1>
          <p className="text-sm font-medium text-luxury-purple-800/60 dark:text-luxury-cream-100/50 mt-1">
            Discover internships, scholarships, hackathons, and certifications tailored to your skills.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={fetchOpportunities}
          disabled={loading}
          icon={Sparkles}
          className="bg-white/50 border-luxury-cream-300 dark:border-luxury-purple-800 text-luxury-purple-950 dark:text-white"
        >
          {loading ? 'Re-optimizing...' : 'Refresh AI Matches'}
        </Button>
      </div>

      {/* AI Recommendation Banner */}
      {topRecommendation && !loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative p-[1.5px] rounded-[24px] bg-gradient-to-tr from-luxury-purple-700 via-luxury-cream-300 to-luxury-peach shadow-lg overflow-hidden mb-8"
        >
          <div className="glass dark:bg-luxury-purple-950/85 p-6 sm:p-8 rounded-[24px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 text-left">
            <div className="flex-grow flex flex-col gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-purple-100 dark:bg-luxury-purple-900 text-luxury-purple-850 dark:text-luxury-peach text-[10px] font-bold uppercase tracking-wider w-fit">
                <Sparkles size={11} className="text-luxury-purple-700 dark:text-luxury-peach animate-pulse" />
                <span>AI Recommended Match ({topRecommendation.matchScore}%)</span>
              </div>
              <div className="flex items-center gap-3">
                {renderOrgLogo(topRecommendation.organization)}
                <div>
                  <h3 className="text-base font-extrabold text-luxury-purple-950 dark:text-white">
                    {topRecommendation.title}
                  </h3>
                  <p className="text-xs font-bold text-luxury-purple-800/80 dark:text-luxury-cream-100/60">
                    {topRecommendation.organization} • {topRecommendation.category}
                  </p>
                </div>
              </div>
              <p className="text-xs font-semibold leading-relaxed text-luxury-purple-900/90 dark:text-luxury-cream-100/80 font-sans max-w-3xl">
                <strong>Why Recommended:</strong> {topRecommendation.reason}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
              <button
                onClick={() => handleToggleBookmark(topRecommendation.id)}
                className={`p-3 rounded-2xl border transition-colors flex items-center justify-center cursor-pointer ${
                  savedIds.includes(topRecommendation.id)
                    ? 'bg-luxury-purple-100 text-luxury-purple-700 border-luxury-purple-300 dark:bg-luxury-purple-900 dark:text-luxury-peach dark:border-luxury-purple-800'
                    : 'bg-white border-luxury-cream-300 text-luxury-purple-950 hover:bg-luxury-cream-50 dark:bg-luxury-purple-900/60 dark:border-luxury-purple-850 dark:text-white'
                }`}
                title="Bookmark Opportunity"
              >
                <Bookmark size={18} fill={savedIds.includes(topRecommendation.id) ? "currentColor" : "none"} />
              </button>
              <a
                href={topRecommendation.applyLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" icon={ExternalLink}>
                  Apply Now
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search & Filters Controls */}
      <div className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[22px] p-5 shadow-sm mb-8 flex flex-col gap-5 text-left">
        
        {/* Search row & Saved Filter */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-luxury-purple-400 dark:text-luxury-purple-500" size={18} />
            <input
              type="text"
              placeholder="Search opportunity keyword, tech stack, or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full font-sans text-sm rounded-xl py-3 pl-11 pr-4 bg-luxury-cream-50/70 border text-luxury-purple-950 border-luxury-cream-250 dark:bg-luxury-purple-900/30 dark:border-luxury-purple-800/80 dark:text-luxury-cream-50 placeholder-luxury-purple-400/60 dark:placeholder-luxury-purple-500/50 focus:outline-none focus:border-luxury-purple-400 dark:focus:border-luxury-purple-500 focus:bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Bookmarked items toggle */}
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                showSavedOnly
                  ? 'bg-luxury-purple-750 text-white border-luxury-purple-750'
                  : 'bg-white text-luxury-purple-950 border-luxury-cream-300 dark:bg-luxury-purple-900/60 dark:border-luxury-purple-800 dark:text-white hover:bg-luxury-cream-50'
              }`}
            >
              <Bookmark size={14} fill={showSavedOnly ? "currentColor" : "none"} />
              <span>Saved Opportunities ({savedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Dropdowns filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-luxury-cream-100 dark:border-luxury-purple-900/75 pt-4">
          
          {/* Location type */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-luxury-purple-600/80 dark:text-luxury-purple-300/80">
              Work Location
            </span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full font-sans text-xs rounded-xl py-2.5 px-3 bg-luxury-cream-50/70 border text-luxury-purple-950 border-luxury-cream-200 dark:bg-luxury-purple-900/30 dark:border-luxury-purple-800/80 dark:text-luxury-cream-50 focus:outline-none focus:border-luxury-purple-400 dark:focus:border-luxury-purple-500"
            >
              <option value="All">All Locations</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* Difficulty level */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-luxury-purple-650/80 dark:text-luxury-purple-350/80">
              Experience Level
            </span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full font-sans text-xs rounded-xl py-2.5 px-3 bg-luxury-cream-50/70 border text-luxury-purple-950 border-luxury-cream-200 dark:bg-luxury-purple-900/30 dark:border-luxury-purple-800/80 dark:text-luxury-cream-50 focus:outline-none focus:border-luxury-purple-400 dark:focus:border-luxury-purple-500"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner (Entry)</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced (Senior)</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-luxury-purple-650/80 dark:text-luxury-purple-350/80">
              Sort Sequence
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full font-sans text-xs rounded-xl py-2.5 px-3 bg-luxury-cream-50/70 border text-luxury-purple-950 border-luxury-cream-200 dark:bg-luxury-purple-900/30 dark:border-luxury-purple-800/80 dark:text-luxury-cream-50 focus:outline-none focus:border-luxury-purple-400 dark:focus:border-luxury-purple-500"
            >
              <option value="match">Highest AI Match</option>
              <option value="deadline">Approaching Deadline</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>

          {/* Active stats */}
          <div className="flex items-center justify-between p-3.5 bg-luxury-cream-50/50 dark:bg-luxury-purple-900/20 border border-luxury-cream-250 dark:border-luxury-purple-900 rounded-xl">
            <div className="text-left">
              <span className="text-[9px] font-extrabold uppercase text-luxury-purple-400 tracking-wider block">Found Results</span>
              <span className="text-sm font-extrabold text-luxury-purple-950 dark:text-white">
                {filteredOpportunities.length} Listings
              </span>
            </div>
            <Filter size={16} className="text-luxury-purple-400" />
          </div>

        </div>

        {/* Category Horizontal Filter Tags */}
        <div className="border-t border-luxury-cream-100 dark:border-luxury-purple-900/75 pt-4">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-luxury-purple-600/80 dark:text-luxury-purple-300/80 block mb-2.5">
            Filter by STEM Category
          </span>
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10.5px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-luxury-purple-700 text-white border-luxury-purple-700 dark:bg-luxury-peach dark:text-luxury-purple-950 dark:border-luxury-peach'
                    : 'bg-luxury-cream-50/50 text-luxury-purple-800 border-luxury-cream-200 dark:bg-luxury-purple-900/40 dark:text-luxury-cream-100/80 dark:border-luxury-purple-850 dark:hover:bg-luxury-purple-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="mb-8 flex gap-2.5 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-750 dark:text-red-400 text-xs font-semibold text-left">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div className="flex-grow">
            <span>{error}</span>
          </div>
          <button onClick={fetchOpportunities} className="underline text-red-800 dark:text-red-300 font-bold ml-2">
            Retry Loading
          </button>
        </div>
      )}

      {/* Loading Skeleton state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 flex flex-col justify-between gap-5 relative overflow-hidden animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-luxury-cream-100 dark:bg-luxury-purple-900"></div>
                <div className="flex-grow space-y-2">
                  <div className="h-4 bg-luxury-cream-100 dark:bg-luxury-purple-900 rounded w-3/4"></div>
                  <div className="h-3 bg-luxury-cream-100 dark:bg-luxury-purple-900 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-luxury-cream-100 dark:bg-luxury-purple-900 rounded w-full"></div>
                <div className="h-3 bg-luxury-cream-100 dark:bg-luxury-purple-900 rounded w-5/6"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-luxury-cream-100 dark:bg-luxury-purple-900 rounded w-1/4"></div>
                <div className="h-6 bg-luxury-cream-100 dark:bg-luxury-purple-900 rounded w-1/4"></div>
              </div>
              <div className="h-9 bg-luxury-cream-100 dark:bg-luxury-purple-900 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
      )}

      {/* Opportunity Grid Output */}
      <AnimatePresence mode="wait">
        {!loading && !error && (
          <motion.div
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredOpportunities.map((opp) => (
              <motion.div
                key={opp.id}
                variants={cardVariants}
                className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 shadow-sm flex flex-col justify-between gap-5 relative overflow-hidden group hover:border-luxury-purple-300 dark:hover:border-luxury-purple-800 transition-all text-left"
              >
                
                {/* Trending and deadline badges */}
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex gap-1.5">
                    {opp.trendingBadge && (
                      <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                        opp.trendingBadge === 'Closing Today'
                          ? 'bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-400'
                          : opp.trendingBadge === 'Trending'
                          ? 'bg-amber-50 text-amber-750 dark:bg-amber-950/20 dark:text-amber-400'
                          : 'bg-green-50 text-green-750 dark:bg-green-950/20 dark:text-green-400'
                      }`}>
                        {opp.trendingBadge}
                      </span>
                    )}
                  </div>
                  
                  {/* Deadline countdown indicator */}
                  <span className="text-[9px] font-extrabold text-luxury-purple-400 dark:text-luxury-purple-500 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={10} />
                    <span>{opp.deadlineDays} days left</span>
                  </span>
                </div>

                {/* Main Card Header */}
                <div className="flex items-start gap-3 relative z-10">
                  {renderOrgLogo(opp.organization)}
                  <div className="min-w-0">
                    <h3 className="text-sm font-extrabold text-luxury-purple-950 dark:text-white leading-tight truncate group-hover:text-luxury-purple-700 dark:group-hover:text-luxury-peach transition-colors">
                      {opp.title}
                    </h3>
                    <p className="text-xs font-bold text-luxury-purple-800/80 dark:text-luxury-cream-100/60 truncate mt-0.5">
                      {opp.organization}
                    </p>
                  </div>
                </div>

                {/* Sub Badges and Match Progress Indicator */}
                <div className="flex flex-wrap gap-1.5 relative z-10">
                  <span className="text-[8px] font-extrabold bg-luxury-cream-100 text-luxury-purple-800 border border-luxury-cream-250 dark:bg-luxury-purple-900/60 dark:text-luxury-cream-100 dark:border-luxury-purple-800 py-0.5 px-2 rounded">
                    {opp.category}
                  </span>
                  <span className="text-[8px] font-extrabold bg-luxury-purple-50 text-luxury-purple-700 border border-luxury-purple-100 dark:bg-luxury-purple-900/30 dark:text-luxury-peach dark:border-luxury-purple-800 py-0.5 px-2 rounded">
                    {opp.difficulty}
                  </span>
                  <span className="text-[8px] font-extrabold bg-green-50 text-green-700 border border-green-100 dark:bg-green-950/20 dark:text-green-400 py-0.5 px-2 rounded">
                    {opp.locationType}
                  </span>
                </div>

                {/* Brief description */}
                <p className="text-xs font-semibold leading-relaxed text-luxury-purple-800 dark:text-luxury-cream-150/65 line-clamp-3 font-sans relative z-10">
                  {opp.description}
                </p>

                {/* Match Score Bar */}
                <div className="p-3 bg-luxury-cream-50/30 dark:bg-luxury-purple-900/10 border border-luxury-cream-200/50 dark:border-luxury-purple-900 rounded-xl relative z-10">
                  <div className="flex justify-between items-center text-[10px] font-extrabold mb-1">
                    <span className="text-luxury-purple-650 dark:text-luxury-purple-300">AI Match Rating</span>
                    <span className="text-green-600 dark:text-green-400">{opp.matchScore}%</span>
                  </div>
                  <div className="h-1.5 bg-luxury-cream-100 dark:bg-luxury-purple-900 rounded-full overflow-hidden w-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${opp.matchScore}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-luxury-purple-700 to-luxury-purple-500 dark:from-luxury-peach dark:to-luxury-peach-dark"
                    />
                  </div>
                  <p className="text-[9.5px] font-bold text-luxury-purple-800/80 dark:text-luxury-cream-100/50 mt-1.5 text-left leading-snug">
                    {opp.reason}
                  </p>
                </div>

                {/* Apply Button & Bookmark control */}
                <div className="flex gap-2.5 items-center mt-2 relative z-10">
                  <button
                    onClick={() => handleToggleBookmark(opp.id)}
                    className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center cursor-pointer shrink-0 ${
                      savedIds.includes(opp.id)
                        ? 'bg-luxury-purple-100 text-luxury-purple-700 border-luxury-purple-300 dark:bg-luxury-purple-900 dark:text-luxury-peach dark:border-luxury-purple-800'
                        : 'bg-white border-luxury-cream-300 text-luxury-purple-950 hover:bg-luxury-cream-50 dark:bg-luxury-purple-900/60 dark:border-luxury-purple-800 dark:text-white'
                    }`}
                    title={savedIds.includes(opp.id) ? 'Remove Bookmark' : 'Bookmark Opportunity'}
                  >
                    <Bookmark size={15} fill={savedIds.includes(opp.id) ? "currentColor" : "none"} />
                  </button>
                  <a
                    href={opp.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-grow"
                  >
                    <button className="w-full text-xs font-bold py-2.5 px-4 rounded-xl bg-luxury-purple-700 text-white hover:bg-luxury-purple-650 dark:bg-luxury-peach dark:text-luxury-purple-950 dark:hover:bg-luxury-peach-dark transition-all flex items-center justify-center gap-1 cursor-pointer">
                      <span>Apply Now</span>
                      <ExternalLink size={12} />
                    </button>
                  </a>
                </div>

              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State Illustration when filters yield nothing */}
      {!loading && !error && filteredOpportunities.length === 0 && (
        <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-luxury-cream-50 dark:bg-luxury-purple-900/30 text-luxury-purple-400 dark:text-luxury-purple-500 flex items-center justify-center border border-luxury-cream-200 dark:border-luxury-purple-850">
            <Users size={24} />
          </div>
          <div className="text-center max-w-sm">
            <h3 className="font-serif text-lg font-bold text-luxury-purple-950 dark:text-white">
              No Opportunities Found
            </h3>
            <p className="text-xs font-medium text-luxury-purple-800/60 dark:text-luxury-cream-100/50 mt-1 leading-relaxed">
              We couldn't find any opportunities matching your active search keywords or filter criteria. Try adjusting your filters or resetting the search text.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default OpportunityHubPage;
