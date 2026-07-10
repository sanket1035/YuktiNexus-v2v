// SheRise AI - Career Intelligence Page (Module 2 Enhanced)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  UploadCloud,
  FileText,
  Trash2,
  Plus,
  X,
  Compass,
  Award,
  BookOpen,
  Briefcase,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Download,
  Info,
  DollarSign,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { analyzeCareerProfile } from '../services/gemini';
import { Button } from '../components/common/Button';

// Recharts imports for the radar breakdown chart and horizontal comparison
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

export const CareerIntelligencePage = () => {
  const { userProfile, updateProfile } = useAuth();

  // Core Form States initialized from Profile Setup (Module 1)
  const [careerGoal, setCareerGoal] = useState(userProfile?.careerGoal || 'AI Engineer');
  const [skills, setSkills] = useState(userProfile?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  
  // File Upload States
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  
  // Analysis States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  // Interactive Checklist State
  const [resumeChecklist, setResumeChecklist] = useState([]);

  // Suggestions for skill autocompletion
  const skillSuggestions = [
    'Python', 'React', 'JavaScript', 'HTML', 'CSS', 'Git', 'Docker', 'AWS',
    'TensorFlow', 'PyTorch', 'SQL', 'TypeScript', 'Next.js', 'Java', 'C++',
    'NoSQL', 'System Design', 'Node.js', 'Figma', 'MLOps', 'FastAPI', 'Pandas'
  ];

  // Auto initialize state when userProfile loads
  useEffect(() => {
    if (userProfile) {
      if (userProfile.careerGoal) setCareerGoal(userProfile.careerGoal);
      if (userProfile.skills && userProfile.skills.length > 0) setSkills(userProfile.skills);
    }
  }, [userProfile]);

  // Sync interactive checklist from analysis response
  useEffect(() => {
    if (analysisResult?.resumeChecklist) {
      setResumeChecklist(analysisResult.resumeChecklist);
    }
  }, [analysisResult]);

  // Drag and Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        setUploadedFile(file);
        setError('');
      } else {
        setError("Only PDF files are supported for resume scanning.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "application/pdf") {
        setUploadedFile(file);
        setError('');
      } else {
        setError("Only PDF files are supported for resume scanning.");
      }
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  // Skill Handlers
  const handleAddSkill = (skillToAdd) => {
    const clean = skillToAdd.trim();
    if (clean && !skills.includes(clean)) {
      setSkills([...skills, clean]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Checklist Checkbox Toggler
  const handleToggleChecklistItem = (index) => {
    setResumeChecklist(prev =>
      prev.map((item, idx) =>
        idx === index ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Submit Analysis
  const handleTriggerAnalysis = async () => {
    setError('');
    setLoading(true);
    setAnalysisResult(null);

    try {
      // Call Gemini Service
      const result = await analyzeCareerProfile(
        careerGoal,
        skills,
        uploadedFile ? uploadedFile.name : ''
      );
      
      setAnalysisResult(result);

      // Silently sync updated skills/goals back to the user's profile database
      if (userProfile) {
        await updateProfile({
          skills,
          careerGoal
        });
      }
    } catch (err) {
      console.error(err);
      setError("AI Analysis failed. Please check your network connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Download PDF Exporter utilizing browser printing APIs
  const handleDownloadReport = () => {
    if (!analysisResult) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>SheRise AI - Professional Career Assessment Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #120b24; background: #fff; line-height: 1.5; }
            .header { text-align: center; border-bottom: 2px solid #5b4b8a; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 26px; font-weight: bold; color: #5b4b8a; letter-spacing: -0.5px; }
            .title { font-size: 20px; font-weight: bold; margin-top: 10px; color: #120b24; }
            .meta-info { font-size: 12px; color: #6b7280; margin-top: 5px; }
            .section { margin-bottom: 35px; page-break-inside: avoid; }
            .section-title { font-size: 15px; font-weight: 800; border-bottom: 1.5px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 15px; color: #5b4b8a; text-transform: uppercase; letter-spacing: 1px; }
            .grid-2 { display: grid; grid-template-cols: 1fr 1fr; gap: 24px; }
            .grid-3 { display: grid; grid-template-cols: 1fr 1fr 1fr; gap: 20px; }
            .score-card { border: 1px solid #e5e7eb; border-radius: 14px; padding: 18px; text-align: center; background: #faf8f5; }
            .score-val { font-size: 32px; font-weight: 800; color: #5b4b8a; margin: 10px 0; }
            .summary-para { font-size: 13px; color: #374151; text-align: justify; }
            .list-item { font-size: 12.5px; margin-bottom: 8px; color: #4b5563; }
            .bold { font-weight: bold; color: #120b24; }
            .badge { display: inline-block; padding: 4px 10px; font-size: 10px; font-weight: bold; border-radius: 20px; text-transform: uppercase; }
            .badge-purple { background: #ebdff7; color: #5b4b8a; }
            .timeline { border-left: 2px solid #ebdff7; padding-left: 20px; margin-left: 10px; }
            .timeline-item { margin-bottom: 22px; position: relative; }
            .timeline-dot { position: absolute; left: -27px; top: 3px; width: 12px; height: 12px; border-radius: 50%; background: #5b4b8a; }
            .project-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; margin-bottom: 12px; background: #faf8f5; }
            .disclaimer { font-size: 10px; color: #9ca3af; text-align: center; margin-top: 50px; border-top: 1px solid #e5e7eb; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SheRise AI</div>
            <div class="title">Career Assessment & Readiness Report</div>
            <div class="meta-info">Generated on ${new Date().toLocaleDateString()} for ${userProfile?.fullName || 'STEM Student'}</div>
          </div>

          <div class="section">
            <div class="section-title">Readiness Metrics</div>
            <div class="grid-3">
              <div class="score-card">
                <div style="font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Readiness Score</div>
                <div class="score-val">${analysisResult.careerReadinessScore}%</div>
                <div class="badge badge-purple">${careerGoal}</div>
              </div>
              <div class="score-card">
                <div style="font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Confidence Score</div>
                <div class="score-val">${analysisResult.careerConfidenceScore}%</div>
                <div class="badge badge-purple">Self Alignment</div>
              </div>
              <div class="score-card">
                <div style="font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase;">ATS Compatibility</div>
                <div class="score-val">${analysisResult.atsResumeScore}%</div>
                <div style="font-size: 10px; color: #6b7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${uploadedFile ? uploadedFile.name : 'No file scanned'}
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">AI Summary & Projections</div>
            <p class="summary-para">${analysisResult.aiSummary}</p>
            <div style="margin-top: 15px; font-size: 13px;">
              <strong>Salary Projection:</strong> Current estimated base: <span style="color:#5b4b8a; font-weight:bold;">${analysisResult.salaryProjection.currentRange}</span> ➔ Estimated roadmap package: <span style="color:#22c55e; font-weight:bold;">${analysisResult.salaryProjection.projectedRange}</span>
            </div>
          </div>

          <div class="section">
            <div class="grid-2">
              <div>
                <div class="section-title">Core Strengths</div>
                <ul>
                  ${analysisResult.strengths.map(s => `<li class="list-item"><span class="bold">${s}</span></li>`).join('')}
                </ul>
              </div>
              <div>
                <div class="section-title">Gaps & Missing Skills</div>
                <ul>
                  ${analysisResult.skillGapAnalysis.missingSkills.map(m => `<li class="list-item"><span class="bold">${m.name}</span>: ${m.whyImportant}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>

          <div class="section" style="page-break-before: always;">
            <div class="section-title">6-Month Career Roadmap</div>
            <div class="timeline">
              ${analysisResult.personalizedRoadmap.map(r => `
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div style="font-size: 11px; font-weight: bold; color: #5b4b8a; text-transform: uppercase;">${r.month}</div>
                  <div style="font-size: 13px; font-weight: bold; margin: 2px 0;">${r.task}</div>
                  <div style="font-size: 11.5px; color: #4b5563;">${r.details}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section">
            <div class="section-title">4-Week Action Plan</div>
            <ul>
              ${analysisResult.weeklyActionPlan.map(w => `
                <li class="list-item"><span class="bold">${w.week} - ${w.task}</span>: ${w.details}</li>
              `).join('')}
            </ul>
          </div>

          <div class="section">
            <div class="section-title">Recommended STEM Projects</div>
            ${analysisResult.recommendedProjects.map(p => `
              <div class="project-card">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; color: #120b24;">
                  <span>${p.title}</span>
                  <span style="color: #5b4b8a;">${p.difficulty} • ${p.time}</span>
                </div>
                <p style="font-size: 11px; color: #4b5563; margin: 5px 0;">${p.outcome}</p>
                <div style="font-size: 10px; color: #9ca3af;">Tech Stack: ${p.technologies.join(', ')}</div>
              </div>
            `).join('')}
          </div>

          <div class="disclaimer">
            <p>${analysisResult.salaryProjection.disclaimer}</p>
            <p>© ${new Date().getFullYear()} SheRise AI. Powered by Google Gemini API.</p>
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

  const careerGoalsList = [
    'AI Engineer',
    'Data Scientist',
    'ML Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Cloud Engineer',
    'Cyber Security',
    'Product Manager',
    'Other'
  ];

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
    <div className="font-sans text-left">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-luxury-cream-100 dark:bg-luxury-purple-900 border border-luxury-cream-250 dark:border-luxury-purple-800 text-xs font-bold text-luxury-purple-700 dark:text-luxury-peach mb-3 uppercase tracking-widest">
            <Sparkles size={12} className="text-luxury-purple-500 dark:text-luxury-peach" />
            <span>Module 2 - Career Intelligence Assessment</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-luxury-purple-950 dark:text-white leading-tight">
            AI Career Intelligence
          </h1>
          <p className="text-sm font-medium text-luxury-purple-800/60 dark:text-luxury-cream-100/50 mt-1">
            Discover your career potential with AI, scan resumes, and map STEM skill gaps.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {analysisResult && (
            <Button
              variant="outline"
              onClick={handleDownloadReport}
              icon={Download}
              className="bg-white/50 border-luxury-cream-300 dark:border-luxury-purple-800 text-luxury-purple-950 dark:text-white hover:bg-luxury-cream-100"
            >
              Download PDF Report
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => document.getElementById('resume-picker').click()}
            icon={UploadCloud}
          >
            Upload Resume
          </Button>
          <Button
            variant="primary"
            onClick={handleTriggerAnalysis}
            disabled={loading || skills.length === 0}
            icon={Sparkles}
          >
            {loading ? 'Analyzing...' : 'Analyze Profile'}
          </Button>
        </div>
      </div>

      {/* Config Panel Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* Left Side: Career track dropdown and tags */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 sm:p-8 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900">
              <Compass className="text-luxury-purple-700 dark:text-luxury-peach" size={20} />
              <h3 className="text-base font-bold text-luxury-purple-950 dark:text-white font-sans uppercase tracking-wider">
                Career Goal & Technical Skills
              </h3>
            </div>

            {/* Career dropdown selection */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold tracking-wider uppercase text-luxury-purple-600/80 dark:text-luxury-purple-300/80">
                Target Career Goal
              </label>
              <select
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                className="w-full font-sans text-sm rounded-xl py-3.5 px-4 bg-luxury-cream-50/70 border text-luxury-purple-950 border-luxury-cream-200 dark:bg-luxury-purple-900/30 dark:border-luxury-purple-800/80 dark:text-luxury-cream-50 focus:outline-none focus:border-luxury-purple-400 dark:focus:border-luxury-purple-500 focus:bg-white dark:focus:bg-luxury-purple-900/60 focus:ring-4 focus:ring-luxury-purple-100 dark:focus:ring-luxury-purple-950/50"
              >
                {careerGoalsList.map((g) => (
                  <option key={g} value={g} className="dark:bg-luxury-purple-950">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills tag input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold tracking-wider uppercase text-luxury-purple-600/80 dark:text-luxury-purple-300/80">
                Add Core Technical Skills
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Python, Docker, TensorFlow"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(skillInput)}
                  className="flex-grow font-sans text-sm rounded-xl py-3 px-4 bg-luxury-cream-50/70 border text-luxury-purple-950 border-luxury-cream-200 dark:bg-luxury-purple-900/30 dark:border-luxury-purple-800/80 dark:text-luxury-cream-50 placeholder-luxury-purple-400/60 dark:placeholder-luxury-purple-500/50 focus:outline-none focus:border-luxury-purple-400 dark:focus:border-luxury-purple-500 focus:bg-white dark:focus:bg-luxury-purple-900/60"
                />
                <Button
                  variant="outline"
                  onClick={() => handleAddSkill(skillInput)}
                  icon={Plus}
                  className="px-4 shrink-0"
                >
                  Add
                </Button>
              </div>

              {/* Autocomplete list */}
              {skillInput.trim().length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 bg-luxury-cream-50/50 dark:bg-luxury-purple-900/10 border border-luxury-cream-200 dark:border-luxury-purple-900/60 p-2.5 rounded-xl">
                  {skillSuggestions
                    .filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !skills.includes(s))
                    .slice(0, 5)
                    .map(suggest => (
                      <button
                        key={suggest}
                        type="button"
                        onClick={() => handleAddSkill(suggest)}
                        className="text-[10px] font-bold bg-white text-luxury-purple-700 border border-luxury-cream-250 hover:bg-luxury-cream-100 dark:bg-luxury-purple-900 dark:text-luxury-peach dark:border-luxury-purple-800 dark:hover:bg-luxury-purple-800 py-1 px-2.5 rounded-lg transition-colors cursor-pointer"
                      >
                        + {suggest}
                      </button>
                    ))}
                </div>
              )}

              {/* Skill chips */}
              <div className="flex flex-col gap-2.5 mt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-purple-650/60 dark:text-luxury-cream-100/50">
                  Currently Listed Skills ({skills.length})
                </span>
                
                {skills.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-luxury-cream-250 dark:border-luxury-purple-900/80 rounded-2xl text-xs font-semibold text-luxury-purple-400 dark:text-luxury-purple-500">
                    No skills registered. Type above or check suggestions to start.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 p-3 bg-luxury-cream-50/20 dark:bg-luxury-purple-900/10 border border-luxury-cream-200 dark:border-luxury-purple-900/60 rounded-2xl min-h-[70px]">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-luxury-purple-100 text-luxury-purple-800 dark:bg-luxury-purple-900 dark:text-luxury-peach border border-luxury-purple-200/50 dark:border-luxury-purple-850 text-xs font-bold transition-all"
                      >
                        <span>{s}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(s)}
                          className="text-luxury-purple-500 hover:text-red-500 dark:text-luxury-peach/60 dark:hover:text-red-400 cursor-pointer"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Resume Drop Card */}
        <div className="flex flex-col">
          <div
            className={`flex-grow bg-white dark:bg-luxury-purple-950 border-[2px] rounded-[20px] p-6 sm:p-8 shadow-sm flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
              dragActive 
                ? 'border-dashed border-luxury-purple-700 bg-luxury-cream-100/30 dark:border-luxury-peach dark:bg-luxury-purple-900/20' 
                : 'border-luxury-cream-200 dark:border-luxury-purple-900'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              id="resume-picker"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-6">
                <UploadCloud className="text-luxury-purple-700 dark:text-luxury-peach" size={20} />
                <h3 className="text-base font-bold text-luxury-purple-950 dark:text-white font-sans uppercase tracking-wider">
                  Resume Scanner
                </h3>
              </div>

              {!uploadedFile ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3 border border-dashed border-luxury-cream-250 dark:border-luxury-purple-900 rounded-2xl bg-luxury-cream-50/30 dark:bg-luxury-purple-900/10">
                  <div className="w-12 h-12 rounded-full bg-luxury-cream-100 dark:bg-luxury-purple-900/60 text-luxury-purple-700 dark:text-luxury-peach flex items-center justify-center shadow-inner">
                    <UploadCloud size={20} className="animate-pulse" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-luxury-purple-950 dark:text-white">
                      Drag & drop your PDF resume here
                    </p>
                    <p className="text-[10px] text-luxury-purple-800/60 dark:text-luxury-cream-100/50 mt-1 font-semibold">
                      Or click browse to select a file
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => document.getElementById('resume-picker').click()}
                    className="text-xs font-bold text-luxury-purple-700 hover:text-luxury-purple-650 dark:text-luxury-peach dark:hover:text-luxury-peach-dark underline decoration-2 underline-offset-4 cursor-pointer"
                  >
                    Browse Files
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 p-4 rounded-2xl bg-luxury-cream-50 dark:bg-luxury-purple-900/30 border border-luxury-cream-200 dark:border-luxury-purple-900">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 shrink-0">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-xs font-bold text-luxury-purple-950 dark:text-white truncate">
                          {uploadedFile.name}
                        </span>
                        <span className="text-[10px] font-semibold text-luxury-purple-400 dark:text-luxury-purple-500 mt-0.5">
                          {(uploadedFile.size / 1024).toFixed(1)} KB • PDF Document
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-2 rounded-xl hover:bg-red-50 text-red-500 dark:hover:bg-red-950/30 dark:text-red-400 cursor-pointer transition-colors"
                      title="Remove file"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex gap-2 items-center text-[10px] font-semibold text-green-600 dark:text-green-400 p-2 bg-green-50/50 dark:bg-green-950/20 rounded-lg">
                    <CheckCircle size={12} className="shrink-0" />
                    <span>File attached. Ready for career intelligence scan.</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-[10px] font-semibold text-luxury-purple-800/50 dark:text-luxury-cream-100/40 text-center mt-6">
              Security: Resumes are read temporarily in sandbox memory to extract skill keywords.
            </div>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-8 flex gap-2.5 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs font-semibold">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <div className="flex-grow">
            <span>{error}</span>
          </div>
          <button onClick={handleTriggerAnalysis} className="underline text-red-800 dark:text-red-300 font-bold ml-2">
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center gap-6 bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-8 shadow-sm">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-24 h-24 rounded-full bg-luxury-peach/15 blur-xl animate-pulse-slow"></div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="w-14 h-14 rounded-full border-[3px] border-luxury-cream-200 border-t-luxury-purple-700 dark:border-luxury-purple-850 dark:border-t-luxury-peach"
            ></motion.div>
            <div className="absolute text-[10px] font-extrabold text-luxury-purple-700 dark:text-luxury-peach">AI</div>
          </div>
          <div className="text-center max-w-sm">
            <h3 className="font-serif text-lg font-bold text-luxury-purple-950 dark:text-white">
              Consulting SheRise AI
            </h3>
            <p className="text-xs font-medium text-luxury-purple-800/60 dark:text-luxury-cream-100/50 mt-1 leading-relaxed">
              Analyzing your skills, reading uploaded resume parameters, and mapping gap outcomes using Gemini intelligence...
            </p>
          </div>
        </div>
      )}

      {/* Analysis Result Output Dashboard */}
      <AnimatePresence>
        {analysisResult && !loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8"
          >
            
            {/* GRID 1: CORE ASSESSMENT METRICS (Circular readiness gauges & ATS scores) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Card 1: Readiness Score + Explainable AI */}
              <motion.div
                variants={cardVariants}
                className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 shadow-sm flex flex-col justify-between"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <span className="text-xs font-bold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 uppercase tracking-wider">
                    Career Readiness Score
                  </span>
                  
                  {/* Readiness radial progress */}
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="54"
                        stroke="#f4efe6"
                        strokeWidth="9"
                        fill="transparent"
                        className="dark:stroke-luxury-purple-900"
                      />
                      <motion.circle
                        cx="64"
                        cy="64"
                        r="54"
                        stroke="#5B4B8A"
                        strokeWidth="9"
                        fill="transparent"
                        strokeDasharray={339.3}
                        initial={{ strokeDashoffset: 339.3 }}
                        animate={{ strokeDashoffset: 339.3 - (339.3 * analysisResult.careerReadinessScore) / 100 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="dark:stroke-luxury-peach"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-extrabold text-luxury-purple-950 dark:text-white font-sans">
                        {analysisResult.careerReadinessScore}%
                      </span>
                      <span className="text-[9px] font-bold text-luxury-purple-500 dark:text-luxury-peach uppercase tracking-widest mt-0.5">
                        {careerGoal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Explainable AI block ("Why this score?") */}
                <div className="mt-6 border-t border-luxury-cream-100 dark:border-luxury-purple-900 pt-4 flex flex-col gap-3 text-left">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-luxury-purple-950 dark:text-white">
                    <Info size={14} className="text-luxury-purple-700 dark:text-luxury-peach" />
                    <span>Why this score?</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {/* Strengths */}
                    {analysisResult.whyScore?.strengths.map((str, idx) => (
                      <div key={`s-${idx}`} className="flex gap-2 items-start text-[11px] font-semibold text-green-700 dark:text-green-400">
                        <CheckCircle size={12} className="shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </div>
                    ))}
                    {/* Improvements */}
                    {analysisResult.whyScore?.improvements.map((imp, idx) => (
                      <div key={`i-${idx}`} className="flex gap-2 items-start text-[11px] font-semibold text-amber-700 dark:text-luxury-peach">
                        <AlertCircle size={12} className="shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Career Confidence & ATS Resume score */}
              <motion.div
                variants={cardVariants}
                className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 shadow-sm flex flex-col justify-between"
              >
                <div className="flex flex-col gap-5">
                  <div className="flex justify-between items-center pb-3 border-b border-luxury-cream-100 dark:border-luxury-purple-900">
                    <span className="text-xs font-bold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 uppercase tracking-wider">
                      Confidence & Resume Scores
                    </span>
                    <Award size={16} className="text-luxury-purple-700 dark:text-luxury-peach" />
                  </div>

                  {/* Dual Score metrics */}
                  <div className="grid grid-cols-2 gap-4 py-2">
                    {/* Confidence score circular meter */}
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="38"
                            stroke="#f4efe6"
                            strokeWidth="7"
                            fill="transparent"
                            className="dark:stroke-luxury-purple-900"
                          />
                          <motion.circle
                            cx="48"
                            cy="48"
                            r="38"
                            stroke="#835eb0"
                            strokeWidth="7"
                            fill="transparent"
                            strokeDasharray={238.7}
                            initial={{ strokeDashoffset: 238.7 }}
                            animate={{ strokeDashoffset: 238.7 - (238.7 * analysisResult.careerConfidenceScore) / 100 }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className="dark:stroke-luxury-peach"
                          />
                        </svg>
                        <span className="absolute text-lg font-extrabold text-luxury-purple-950 dark:text-white">
                          {analysisResult.careerConfidenceScore}%
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-luxury-purple-905 dark:text-luxury-cream-100">
                        Career Confidence
                      </span>
                    </div>

                    {/* ATS Resume score circular meter */}
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="38"
                            stroke="#f4efe6"
                            strokeWidth="7"
                            fill="transparent"
                            className="dark:stroke-luxury-purple-900"
                          />
                          <motion.circle
                            cx="48"
                            cy="48"
                            r="38"
                            stroke="#22c55e"
                            strokeWidth="7"
                            fill="transparent"
                            strokeDasharray={238.7}
                            initial={{ strokeDashoffset: 238.7 }}
                            animate={{ strokeDashoffset: 238.7 - (238.7 * analysisResult.atsResumeScore) / 100 }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className="dark:stroke-green-400"
                          />
                        </svg>
                        <span className="absolute text-lg font-extrabold text-luxury-purple-950 dark:text-white">
                          {analysisResult.atsResumeScore}%
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-luxury-purple-905 dark:text-luxury-cream-100">
                        ATS Resume Match
                      </span>
                    </div>
                  </div>
                </div>

                {/* ATS Resume Feedback suggestions */}
                <div className="mt-4 border-t border-luxury-cream-100 dark:border-luxury-purple-900 pt-4 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-purple-600/80 dark:text-luxury-purple-300/80">
                    ATS Audit Suggestions
                  </span>
                  <div className="flex flex-col gap-1.5 mt-2">
                    {analysisResult.atsSuggestions?.map((sug, idx) => (
                      <div key={idx} className="flex gap-2 items-start text-[10.5px] font-semibold text-luxury-purple-800/85 dark:text-luxury-cream-150/70">
                        <Zap size={10} className="text-luxury-purple-500 dark:text-luxury-peach mt-1 shrink-0" />
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Card 3: Salary Projection & Interactive checklist */}
              <motion.div
                variants={cardVariants}
                className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 shadow-sm flex flex-col justify-between"
              >
                {/* Salary Projection Block */}
                <div>
                  <div className="flex justify-between items-center pb-3 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-4">
                    <span className="text-xs font-bold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 uppercase tracking-wider">
                      Salary Projection
                    </span>
                    <DollarSign size={16} className="text-green-500" />
                  </div>
                  
                  <div className="flex justify-around items-center p-3.5 bg-green-50/15 dark:bg-green-950/10 border border-green-100/30 rounded-2xl text-left">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase text-luxury-purple-400 tracking-wider block">Current Base</span>
                      <span className="text-sm font-extrabold text-luxury-purple-950 dark:text-white">{analysisResult.salaryProjection.currentRange}</span>
                    </div>
                    <ChevronRight size={18} className="text-luxury-purple-300" />
                    <div>
                      <span className="text-[9px] font-extrabold uppercase text-green-500 tracking-wider block">Roadmap Target</span>
                      <span className="text-sm font-extrabold text-green-600 dark:text-green-400">{analysisResult.salaryProjection.projectedRange}</span>
                    </div>
                  </div>
                  <span className="text-[8px] font-semibold text-luxury-purple-400 dark:text-luxury-purple-500 italic block mt-1.5 text-center">
                    * {analysisResult.salaryProjection.disclaimer}
                  </span>
                </div>

                {/* Interactive checklist */}
                <div className="mt-4 border-t border-luxury-cream-100 dark:border-luxury-purple-900 pt-4 text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-purple-650/80 dark:text-luxury-purple-350/80">
                    Interactive Resume Checklist
                  </span>
                  
                  <div className="flex flex-col gap-2 mt-2.5 max-h-[110px] overflow-y-auto pr-1">
                    {resumeChecklist.map((item, idx) => (
                      <label key={idx} className="flex items-start gap-2 text-[10.5px] font-semibold text-luxury-purple-850 dark:text-luxury-cream-100 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleToggleChecklistItem(idx)}
                          className="rounded border-luxury-cream-300 dark:border-luxury-purple-800 text-luxury-purple-700 focus:ring-luxury-purple-300 bg-transparent cursor-pointer mt-0.5"
                        />
                        <span className={item.completed ? 'line-through opacity-50' : ''}>{item.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Career Comparison Engine Section */}
            <motion.div
              variants={cardVariants}
              className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 sm:p-8 shadow-sm text-left"
            >
              <div className="pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-6">
                <div className="flex items-center gap-2">
                  <Target className="text-luxury-purple-700 dark:text-luxury-peach" size={20} />
                  <h3 className="text-base font-bold text-luxury-purple-950 dark:text-white font-sans uppercase tracking-wider">
                    STEM Career Alignment Engine
                  </h3>
                </div>
              </div>

              {/* Best match recommendation alert */}
              <div className="p-4 bg-luxury-purple-50/40 dark:bg-luxury-purple-900/20 border border-luxury-purple-100 dark:border-luxury-purple-900 rounded-2xl flex items-start gap-3 mb-6">
                <div className="p-2 rounded-xl bg-luxury-purple-700 text-white shrink-0 shadow-sm dark:bg-luxury-purple-500">
                  <Sparkles size={16} className="animate-pulse" />
                </div>
                <div className="text-xs font-semibold text-luxury-purple-900 dark:text-luxury-cream-100 leading-relaxed">
                  <span className="font-extrabold text-luxury-purple-950 dark:text-white uppercase tracking-wider text-[10px] block mb-0.5">
                    Best AI Career Path Recommendation:
                  </span>
                  {analysisResult.careerComparison.bestMatchRecommendation}
                </div>
              </div>

              {/* Horizontal Comparison Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                {analysisResult.careerComparison.tracks.map((track) => {
                  const isActive = track.career === careerGoal;
                  return (
                    <div key={track.career} className="flex flex-col gap-1.5 p-3 rounded-xl hover:bg-luxury-cream-50/50 dark:hover:bg-luxury-purple-900/30 transition-all">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-luxury-purple-950 dark:text-white flex items-center gap-1.5">
                          {track.career}
                          {isActive && (
                            <span className="text-[9px] font-bold bg-luxury-purple-150 text-luxury-purple-700 dark:bg-luxury-purple-900 dark:text-luxury-peach px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Target
                            </span>
                          )}
                        </span>
                        <span className="text-luxury-purple-800 dark:text-luxury-peach">{track.score}%</span>
                      </div>
                      {/* Match bar */}
                      <div className="h-2 bg-luxury-cream-100 dark:bg-luxury-purple-900 rounded-full overflow-hidden w-full border border-luxury-cream-200/50 dark:border-transparent">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${track.score}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className={`h-full rounded-full ${
                            isActive 
                              ? 'bg-gradient-to-r from-luxury-purple-700 to-luxury-purple-500 dark:from-luxury-peach dark:to-luxury-peach-dark' 
                              : 'bg-luxury-purple-300 dark:bg-luxury-purple-800'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* AI Career Summary Glass Card */}
            <motion.div
              variants={cardVariants}
              className="relative p-[1px] rounded-[20px] bg-gradient-to-tr from-luxury-purple-700 via-luxury-cream-300 to-luxury-peach shadow-xl overflow-hidden"
            >
              <div className="glass dark:bg-luxury-purple-950/80 p-8 rounded-[20px] flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-left">
                <div className="flex flex-col gap-3.5 max-w-3xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-purple-100 dark:bg-luxury-purple-900 text-luxury-purple-800/80 dark:text-luxury-peach text-[10px] font-bold uppercase tracking-wider w-fit">
                    <Sparkles size={11} className="text-luxury-purple-700 dark:text-luxury-peach" />
                    <span>Executive Summary & Projections</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-luxury-purple-950 dark:text-white">
                    Core Profile Readiness Audit
                  </h3>
                  <p className="text-sm font-medium leading-relaxed text-luxury-purple-850 dark:text-luxury-cream-100/90 font-sans">
                    {analysisResult.aiSummary}
                  </p>
                </div>

                {/* Timeline badge */}
                <div className="p-5 rounded-2xl bg-white dark:bg-luxury-purple-900 border border-luxury-cream-200 dark:border-luxury-purple-850 flex flex-col items-center justify-center shadow-inner text-center shrink-0 w-36">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-luxury-purple-400 mb-1">
                    Readiness
                  </span>
                  <span className="text-xl font-bold text-luxury-purple-950 dark:text-white font-sans">
                    4-6 Months
                  </span>
                  <span className="text-[9px] font-bold text-luxury-purple-500 dark:text-luxury-peach uppercase mt-1 leading-snug">
                    To Internship Match
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Split Grid: Gaps vs Radar Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Skill Gap Cards list (Double column size) */}
              <motion.div
                variants={cardVariants}
                className="lg:col-span-2 bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 sm:p-8 shadow-sm"
              >
                <div className="flex justify-between items-center pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-luxury-purple-700 dark:text-luxury-peach" size={20} />
                    <h3 className="text-base font-bold text-luxury-purple-950 dark:text-white font-sans uppercase tracking-wider">
                      Skill Gap Audit
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/20 dark:text-red-400 py-1 px-2.5 rounded-lg border border-red-100 dark:border-transparent">
                    {analysisResult.skillGapAnalysis.missingSkills.length} Missing Categories
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Current Skills list */}
                  <div className="flex flex-col gap-3 p-4 bg-green-50/15 dark:bg-green-950/5 border border-green-100 dark:border-green-950/30 rounded-2xl">
                    <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle size={14} />
                      Current Assets
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {analysisResult.skillGapAnalysis.currentSkills.map((c) => (
                        <span key={c} className="text-[11px] font-bold px-2.5 py-1 bg-green-50 dark:bg-green-900/20 border border-green-150 dark:border-green-800 text-green-750 dark:text-green-400 rounded-lg">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills list */}
                  <div className="flex flex-col gap-3 p-4 bg-red-50/15 dark:bg-red-950/5 border border-red-100 dark:border-red-950/30 rounded-2xl">
                    <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle size={14} />
                      Target Missing Gaps
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {analysisResult.skillGapAnalysis.missingSkills.map((m) => (
                        <span key={m.name} className="text-[11px] font-bold px-2.5 py-1 bg-red-50 dark:bg-red-900/20 border border-red-150 dark:border-red-800 text-red-750 dark:text-red-400 rounded-lg">
                          {m.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Explanation WHY each is important */}
                <div className="flex flex-col gap-3 mt-6 border-t border-luxury-cream-100 dark:border-luxury-purple-900 pt-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-purple-800/60 dark:text-luxury-cream-100/50">
                    Understanding Missing Skill Gaps:
                  </span>
                  <div className="flex flex-col gap-4">
                    {analysisResult.skillGapAnalysis.missingSkills.map((m, idx) => (
                      <div key={idx} className="flex gap-3 text-left bg-luxury-cream-50/30 dark:bg-luxury-purple-900/10 p-3.5 rounded-xl border border-luxury-cream-200/50 dark:border-luxury-purple-900">
                        <div className="w-5 h-5 rounded-full bg-luxury-purple-100 dark:bg-luxury-purple-900 text-luxury-purple-700 dark:text-luxury-peach flex items-center justify-center font-bold text-[10px] shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <h4 className="text-xs font-bold text-luxury-purple-950 dark:text-white">
                            {m.name}
                          </h4>
                          <p className="text-[11px] font-medium text-luxury-purple-850/80 dark:text-luxury-cream-100/60 leading-normal">
                            {m.whyImportant}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Recharts Radar Chart */}
              <motion.div
                variants={cardVariants}
                className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 sm:p-8 shadow-sm flex flex-col justify-between"
              >
                <div className="pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="text-luxury-purple-700 dark:text-luxury-peach" size={20} />
                    <h3 className="text-base font-bold text-luxury-purple-950 dark:text-white font-sans uppercase tracking-wider">
                      Readiness Radar
                    </h3>
                  </div>
                </div>

                {/* Recharts Container */}
                <div className="h-64 w-full flex items-center justify-center font-sans">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" r="80%" data={analysisResult.readinessBreakdown}>
                      <PolarGrid stroke="#e5e7eb" className="dark:stroke-luxury-purple-900" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: '#9ca3af', fontSize: 8 }}
                      />
                      <Radar
                        name="STEM Readiness"
                        dataKey="value"
                        stroke="#5B4B8A"
                        fill="#D6C5F2"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="text-[10px] font-bold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 text-center leading-relaxed mt-2 p-3 bg-luxury-cream-50 dark:bg-luxury-purple-900/30 border border-luxury-cream-200/50 dark:border-luxury-purple-900 rounded-xl">
                  Score audits programming skills, vector model knowledge, open source logs, and resume details.
                </div>
              </motion.div>
            </div>

            {/* Dynamic Strengths & Weaknesses Grids with hover animations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Strength Card */}
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-gradient-to-br from-white to-green-50/20 dark:from-luxury-purple-950 dark:to-green-950/5 border border-luxury-cream-200 dark:border-luxury-purple-900 p-6 rounded-[20px] shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-xl"></div>
                <div className="flex items-center gap-2 pb-3 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-4">
                  <ShieldCheck className="text-green-500" size={20} />
                  <h3 className="text-sm font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider font-sans">
                    Identified Strengths
                  </h3>
                </div>
                <div className="flex flex-col gap-3">
                  {analysisResult.strengths.map((str, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-xs font-semibold text-luxury-purple-850 dark:text-luxury-cream-100 text-left">
                      <span className="w-5 h-5 rounded-full bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                        ✓
                      </span>
                      <span className="mt-0.5">{str}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Weakness Card */}
              <motion.div
                variants={cardVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                className="bg-gradient-to-br from-white to-amber-50/20 dark:from-luxury-purple-950 dark:to-amber-950/5 border border-luxury-cream-200 dark:border-luxury-purple-900 p-6 rounded-[20px] shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl"></div>
                <div className="flex items-center gap-2 pb-3 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-4">
                  <AlertCircle className="text-amber-500" size={20} />
                  <h3 className="text-sm font-bold text-luxury-purple-950 dark:text-white uppercase tracking-wider font-sans">
                    Identified Vulnerabilities
                  </h3>
                </div>
                <div className="flex flex-col gap-3">
                  {analysisResult.weaknesses.map((weak, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start text-xs font-semibold text-luxury-purple-850 dark:text-luxury-cream-100 text-left">
                      <span className="w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                        !
                      </span>
                      <span className="mt-0.5">{weak}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Timeline Row: 6-Month Roadmap & 4-Week Action Plan */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Column 1 & 2: 6-Month Roadmap */}
              <div className="lg:col-span-2 flex flex-col">
                <motion.div
                  variants={cardVariants}
                  className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 sm:p-8 shadow-sm flex-grow"
                >
                  <div className="flex justify-between items-center pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-6">
                    <div className="flex items-center gap-2">
                      <Compass className="text-luxury-purple-700 dark:text-luxury-peach" size={20} />
                      <h3 className="text-base font-bold text-luxury-purple-950 dark:text-white font-sans uppercase tracking-wider">
                        Personalized 6-Month Roadmap
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold bg-luxury-purple-100 text-luxury-purple-700 dark:bg-luxury-purple-900 dark:text-luxury-peach py-1 px-3 rounded-lg uppercase tracking-wider">
                      Timeline
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                    {analysisResult.personalizedRoadmap.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-luxury-cream-50/20 dark:bg-luxury-purple-900/10 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-2xl flex flex-col justify-between gap-3 text-left hover:border-luxury-purple-300 dark:hover:border-luxury-purple-800 transition-all group"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-extrabold text-luxury-purple-700 dark:text-luxury-peach uppercase tracking-widest">
                              {item.month}
                            </span>
                            <div className="w-5 h-5 rounded-full bg-luxury-cream-100 dark:bg-luxury-purple-900 text-luxury-purple-700 dark:text-luxury-peach flex items-center justify-center font-bold text-[9px]">
                              {idx + 1}
                            </div>
                          </div>
                          <h4 className="text-xs font-bold text-luxury-purple-950 dark:text-white mb-1.5 leading-tight group-hover:text-luxury-purple-700 dark:group-hover:text-luxury-peach">
                            {item.task}
                          </h4>
                          <p className="text-[11px] font-medium leading-relaxed text-luxury-purple-850/80 dark:text-luxury-cream-150/60 font-sans">
                            {item.details}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Column 3: 4-Week Action Plan */}
              <div className="flex flex-col">
                <motion.div
                  variants={cardVariants}
                  className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 sm:p-8 shadow-sm flex-grow flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-6">
                      <div className="flex items-center gap-2">
                        <Zap className="text-luxury-purple-700 dark:text-luxury-peach" size={20} />
                        <h3 className="text-base font-bold text-luxury-purple-950 dark:text-white font-sans uppercase tracking-wider">
                          Weekly Action Plan
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400 py-1 px-3 rounded-lg uppercase tracking-wider">
                        Next 30 Days
                      </span>
                    </div>

                    <div className="flex flex-col gap-4">
                      {analysisResult.weeklyActionPlan?.map((w, idx) => (
                        <div key={idx} className="flex gap-3 text-left">
                          <div className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full bg-luxury-purple-700 text-white dark:bg-luxury-purple-500 flex items-center justify-center font-bold text-[9px] shrink-0">
                              W{idx + 1}
                            </div>
                            {idx < 3 && <div className="w-0.5 h-10 bg-luxury-cream-200 dark:bg-luxury-purple-900 mt-2"></div>}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <h4 className="text-xs font-bold text-luxury-purple-950 dark:text-white">
                              {w.task}
                            </h4>
                            <p className="text-[10.5px] font-medium text-luxury-purple-800/80 dark:text-luxury-cream-100/60 leading-normal">
                              {w.details}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Recommended Projects & Resources Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Suggested Projects */}
              <motion.div
                variants={cardVariants}
                className="lg:col-span-2 bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 sm:p-8 shadow-sm flex flex-col gap-6"
              >
                <div className="pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900">
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-luxury-purple-700 dark:text-luxury-peach" size={20} />
                    <h3 className="text-base font-bold text-luxury-purple-950 dark:text-white font-sans uppercase tracking-wider">
                      Recommended STEM Portfolio Projects
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {analysisResult.recommendedProjects.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-luxury-cream-50/20 dark:bg-luxury-purple-900/10 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-2xl flex flex-col gap-3 text-left hover:border-luxury-purple-300 dark:hover:border-luxury-purple-800 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="text-xs font-bold text-luxury-purple-950 dark:text-white leading-snug">
                          {p.title}
                        </h4>
                        
                        <div className="flex gap-2 shrink-0">
                          <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                            p.difficulty === 'Easy' 
                              ? 'bg-green-50 text-green-750 border border-green-100 dark:bg-green-950/20 dark:text-green-400' 
                              : p.difficulty === 'Medium'
                              ? 'bg-amber-50 text-amber-750 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400'
                              : 'bg-red-50 text-red-750 border border-red-100 dark:bg-red-950/20 dark:text-red-400'
                          }`}>
                            {p.difficulty}
                          </span>
                          <span className="text-[8px] font-extrabold bg-luxury-cream-100 text-luxury-purple-800 border border-luxury-cream-250 dark:bg-luxury-purple-900 dark:text-luxury-cream-100 py-0.5 px-2 rounded">
                            {p.time}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] font-semibold text-luxury-purple-800/80 dark:text-luxury-cream-100/60 leading-relaxed font-sans">
                        {p.outcome}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {p.technologies.map((t) => (
                          <span key={t} className="text-[8px] font-bold bg-white text-luxury-purple-700 border border-luxury-cream-250 dark:bg-luxury-purple-900/60 dark:text-luxury-peach dark:border-luxury-purple-800 py-0.5 px-2 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Resources */}
              <motion.div
                variants={cardVariants}
                className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 sm:p-8 shadow-sm flex flex-col gap-6"
              >
                <div className="pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900">
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-luxury-purple-700 dark:text-luxury-peach" size={20} />
                    <h3 className="text-base font-bold text-luxury-purple-950 dark:text-white font-sans uppercase tracking-wider">
                      Learning Resources
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {analysisResult.learningResources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 bg-luxury-cream-50/20 dark:bg-luxury-purple-900/10 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-2xl text-left hover:bg-luxury-cream-50 dark:hover:bg-luxury-purple-900/30 transition-all flex flex-col gap-2 group cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] font-extrabold uppercase tracking-wider text-luxury-purple-500 dark:text-luxury-peach bg-luxury-cream-100 dark:bg-luxury-purple-900 py-0.5 px-2 rounded">
                          {res.type}
                        </span>
                        <ExternalLink size={11} className="text-luxury-purple-400 dark:text-luxury-purple-500 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      
                      <h4 className="text-xs font-bold text-luxury-purple-950 dark:text-white leading-tight group-hover:text-luxury-purple-700 dark:group-hover:text-luxury-peach">
                        {res.name}
                      </h4>
                      
                      <p className="text-[10px] font-medium text-luxury-purple-800/70 dark:text-luxury-cream-150/50 leading-relaxed font-sans">
                        {res.description}
                      </p>
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* AI Tips & Actionable Advice */}
            <motion.div
              variants={cardVariants}
              className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 sm:p-8 shadow-sm"
            >
              <div className="pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-6">
                <div className="flex items-center gap-2">
                  <Lightbulb className="text-luxury-purple-700 dark:text-luxury-peach" size={20} />
                  <h3 className="text-base font-bold text-luxury-purple-950 dark:text-white font-sans uppercase tracking-wider">
                    Personalized SheRise AI Tips
                  </h3>
                </div>
              </div>

              {/* Grid of Tip Notification Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Daily Tip */}
                <div className="p-5 bg-amber-50/15 dark:bg-amber-950/5 border border-amber-100 dark:border-amber-900/40 rounded-2xl flex flex-col gap-2.5 text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                    Daily Tip
                  </span>
                  <p className="text-xs font-semibold text-luxury-purple-900/85 dark:text-luxury-cream-100/80 leading-relaxed font-sans">
                    {analysisResult.personalizedTips.dailyTip}
                  </p>
                </div>

                {/* Weekly Goal */}
                <div className="p-5 bg-luxury-purple-50/20 dark:bg-luxury-purple-900/10 border border-luxury-purple-100 dark:border-luxury-purple-900 rounded-2xl flex flex-col gap-2.5 text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-luxury-purple-700 dark:text-luxury-peach">
                    Weekly Goal
                  </span>
                  <p className="text-xs font-semibold text-luxury-purple-900/85 dark:text-luxury-cream-100/80 leading-relaxed font-sans">
                    {analysisResult.personalizedTips.weeklyGoal}
                  </p>
                </div>

                {/* Monthly Goal */}
                <div className="p-5 bg-green-50/15 dark:bg-green-950/5 border border-green-100 dark:border-green-900/40 rounded-2xl flex flex-col gap-2.5 text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-700 dark:text-green-400">
                    Monthly Goal
                  </span>
                  <p className="text-xs font-semibold text-luxury-purple-900/85 dark:text-luxury-cream-100/80 leading-relaxed font-sans">
                    {analysisResult.personalizedTips.monthlyGoal}
                  </p>
                </div>

                {/* Career Advice */}
                <div className="p-5 bg-red-50/15 dark:bg-red-950/5 border border-red-100 dark:border-red-900/40 rounded-2xl flex flex-col gap-2.5 text-left">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-700 dark:text-red-400">
                    Career Advice
                  </span>
                  <p className="text-xs font-semibold text-luxury-purple-900/85 dark:text-luxury-cream-100/80 leading-relaxed font-sans">
                    {analysisResult.personalizedTips.careerAdvice}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State before Analysis triggers */}
      {!analysisResult && !loading && (
        <div className="py-20 flex flex-col items-center justify-center gap-4 bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-luxury-cream-50 dark:bg-luxury-purple-900/30 text-luxury-purple-400 dark:text-luxury-purple-500 flex items-center justify-center border border-luxury-cream-200 dark:border-luxury-purple-850">
            <Compass size={24} />
          </div>
          <div className="text-center max-w-sm">
            <h3 className="font-serif text-lg font-bold text-luxury-purple-950 dark:text-white">
              No Profile Analysis Yet
            </h3>
            <p className="text-xs font-medium text-luxury-purple-800/60 dark:text-luxury-cream-100/50 mt-1 leading-relaxed">
              Verify your target career and technical skills, upload your PDF resume, and click the analyze button above to consult the AI.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerIntelligencePage;
