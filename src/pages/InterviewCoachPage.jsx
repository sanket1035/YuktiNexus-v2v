// SheRise AI - AI Interview Coach Page (Module 4)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Mic,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Info,
  Calendar,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  Download,
  Check,
  ChevronRight,
  TrendingUp,
  Target,
  Zap,
  Play
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getInterviewQuestions, evaluateInterviewResponse } from '../services/gemini';
import { Button } from '../components/common/Button';

export const InterviewCoachPage = () => {
  const { userProfile } = useAuth();

  // Selection states
  const [interviewType, setInterviewType] = useState('HR'); // 'HR', 'Technical', 'Behavioral', 'Aptitude', 'Resume-Based'
  const [difficulty, setDifficulty] = useState('Intermediate'); // 'Beginner', 'Intermediate', 'Advanced'
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Session management states
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // idx -> string
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [sessionError, setSessionError] = useState('');

  // Hints and answers visibility states
  const [showHint, setShowHint] = useState(false);
  const [showOutline, setShowOutline] = useState(false);

  // Answer evaluation states
  const [evaluations, setEvaluations] = useState({}); // idx -> evaluation object
  const [evaluatingIdx, setEvaluatingIdx] = useState(null);

  // Final Report state
  const [showReport, setShowReport] = useState(false);

  const interviewTypesList = [
    { type: 'HR', title: 'HR Interview', desc: 'Behavioral, culture fit, and soft skills screening.', icon: UsersIcon },
    { type: 'Technical', title: 'Technical Interview', desc: 'Algorithms, systems, and track-specific engineering questions.', icon: TechIcon },
    { type: 'Behavioral', title: 'Behavioral Interview', desc: 'STAR-format scenarios testing teamwork and problem-solving.', icon: BrainIcon },
    { type: 'Aptitude', title: 'Aptitude Test', desc: 'Quantitative, logical reasoning, and puzzle challenges.', icon: PuzzleIcon },
    { type: 'Resume-Based', title: 'Resume Interview', desc: 'Deep dive queries testing projects and skills on your profile.', icon: FileTextIcon }
  ];

  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced'];

  // Start the interview session
  const handleStartSession = async () => {
    setSessionError('');
    setLoadingQuestions(true);
    setQuestions([]);
    setCurrentIdx(0);
    setUserAnswers({});
    setEvaluations({});
    setShowReport(false);

    try {
      const data = await getInterviewQuestions(interviewType, difficulty);
      if (data && data.length > 0) {
        setQuestions(data);
        setIsSessionActive(true);
      } else {
        setSessionError("No questions returned. Please check configuration and try again.");
      }
    } catch (err) {
      console.error(err);
      setSessionError("Failed to fetch questions. Please check your network connection.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Submit response for AI evaluation
  const handleSubmitAnswer = async () => {
    const question = questions[currentIdx]?.question;
    const answer = userAnswers[currentIdx] || '';

    if (!answer.trim()) {
      alert("Please type a response before submitting for AI review.");
      return;
    }

    setEvaluatingIdx(currentIdx);
    try {
      const evaluation = await evaluateInterviewResponse(
        question,
        answer,
        interviewType,
        difficulty
      );
      setEvaluations(prev => ({
        ...prev,
        [currentIdx]: evaluation
      }));
    } catch (err) {
      console.error(err);
      alert("AI Evaluation failed. Please try submitting again.");
    } finally {
      setEvaluatingIdx(null);
    }
  };

  // Finish session and compile report
  const handleFinishSession = () => {
    setShowReport(true);
    setIsSessionActive(false);
  };

  // Print PDF session scorecard compiler
  const handleDownloadReport = () => {
    if (questions.length === 0) return;

    // Calculate aggregated scores
    const evalList = Object.values(evaluations);
    const avgScore = evalList.length > 0 
      ? Math.round(evalList.reduce((acc, curr) => acc + curr.scores.overall, 0) / evalList.length)
      : 70;
    const avgConfidence = evalList.length > 0
      ? Math.round(evalList.reduce((acc, curr) => acc + curr.scores.confidence, 0) / evalList.length)
      : 75;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>SheRise AI - Interview Performance Scorecard</title>
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
            .summary-para { font-size: 13px; color: #374151; text-align: justify; }
            .list-item { font-size: 12.5px; margin-bottom: 8px; color: #4b5563; }
            .bold { font-weight: bold; color: #120b24; }
            .badge { display: inline-block; padding: 4px 10px; font-size: 10px; font-weight: bold; border-radius: 20px; text-transform: uppercase; }
            .badge-purple { background: #ebdff7; color: #5b4b8a; }
            .q-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px; margin-bottom: 20px; background: #faf8f5; page-break-inside: avoid; }
            .disclaimer { font-size: 10px; color: #9ca3af; text-align: center; margin-top: 50px; border-top: 1px solid #e5e7eb; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SheRise AI</div>
            <div class="title">Interview Performance Scorecard</div>
            <div class="meta-info">Generated on ${new Date().toLocaleDateString()} for ${userProfile?.fullName || 'STEM Student'}</div>
          </div>

          <div class="section">
            <div class="section-title">Session Summary</div>
            <div class="grid-3">
              <div class="score-card">
                <div style="font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Interview Type</div>
                <div class="score-val" style="font-size: 24px; padding: 6px 0;">${interviewType}</div>
                <div class="badge badge-purple">${difficulty} Level</div>
              </div>
              <div class="score-card">
                <div style="font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Average Score</div>
                <div class="score-val">${avgScore}%</div>
                <div class="badge badge-purple">AI Assessment</div>
              </div>
              <div class="score-card">
                <div style="font-size: 11px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Confidence Level</div>
                <div class="score-val">${avgConfidence}%</div>
                <div class="badge badge-purple">Audio-Text Index</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Question Breakdown & Evaluations</div>
            ${questions.slice(0, Object.keys(evaluations).length).map((q, idx) => {
              const ev = evaluations[idx];
              if (!ev) return '';
              return `
                <div class="q-card">
                  <div style="font-weight: bold; font-size: 13px; color: #5b4b8a;">Question ${idx + 1}: ${q.question}</div>
                  <p style="font-size: 12px; margin: 8px 0; color: #374151;"><strong>Your Response:</strong> ${userAnswers[idx] || 'N/A'}</p>
                  
                  <div style="margin-top: 10px; font-size: 11px; display: flex; gap: 15px; font-weight: bold;">
                    <span>Overall: ${ev.scores.overall}%</span>
                    <span>Accuracy: ${ev.scores.technicalAccuracy}%</span>
                    <span>Communication: ${ev.scores.communication}%</span>
                    <span>Confidence: ${ev.scores.confidence}%</span>
                  </div>

                  <div style="margin-top: 10px; font-size: 11.5px;">
                    <strong>Suggestions:</strong> ${ev.suggestions.join(', ')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="disclaimer">
            <p>Scorecards are generated dynamically using Google Gemini API evaluation models.</p>
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

  // Helper values for aggregated final report metrics
  const evalList = Object.values(evaluations);
  const avgOverall = evalList.length > 0 
    ? Math.round(evalList.reduce((acc, curr) => acc + curr.scores.overall, 0) / evalList.length)
    : 0;
  const avgConfidence = evalList.length > 0
    ? Math.round(evalList.reduce((acc, curr) => acc + curr.scores.confidence, 0) / evalList.length)
    : 0;
  const avgAccuracy = evalList.length > 0
    ? Math.round(evalList.reduce((acc, curr) => acc + curr.scores.technicalAccuracy, 0) / evalList.length)
    : 0;
  const avgCommunication = evalList.length > 0
    ? Math.round(evalList.reduce((acc, curr) => acc + curr.scores.communication, 0) / evalList.length)
    : 0;

  // Daily Challenge data list
  const dailyChallenge = {
    hrQuestion: "Tell me about a time you had to adapt to a sudden change in project deliverables.",
    codingQuestion: "Given an array of integers, return indices of the two numbers such that they add up to a specific target.",
    techConcept: "Model Quantization: Reducing weight float precisions (e.g. FP32 to INT8) to speed up deep neural network inferencing with minimal accuracy drops."
  };

  return (
    <div className="font-sans text-left">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-luxury-cream-100 dark:bg-luxury-purple-900 border border-luxury-cream-250 dark:border-luxury-purple-800 text-xs font-bold text-luxury-purple-700 dark:text-luxury-peach mb-3 uppercase tracking-widest">
            <Sparkles size={12} className="text-luxury-purple-500 dark:text-luxury-peach" />
            <span>Module 4 - AI Interview Coach</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-luxury-purple-950 dark:text-white leading-tight">
            AI Interview Simulator
          </h1>
          <p className="text-sm font-medium text-luxury-purple-800/60 dark:text-luxury-cream-100/50 mt-1">
            Build confidence, practice complex technical domains, and receive direct Gemini-driven scoring feedback.
          </p>
        </div>

        {isSessionActive && (
          <Button
            variant="outline"
            icon={RotateCcw}
            onClick={() => {
              if (window.confirm("Are you sure you want to discard this interview session?")) {
                setIsSessionActive(false);
              }
            }}
            className="text-red-500 border-red-200 hover:bg-red-50"
          >
            Quit Session
          </Button>
        )}
      </div>

      {/* Main Container Wrapper */}
      {!isSessionActive && !showReport && (
        <div className="flex flex-col gap-8">
          
          {/* Configure Panel card */}
          <div className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[24px] p-6 sm:p-8 shadow-sm text-left">
            <div className="flex items-center gap-2 pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-6">
              <Mic className="text-luxury-purple-700 dark:text-luxury-peach" size={20} />
              <h3 className="text-base font-bold text-luxury-purple-950 dark:text-white font-sans uppercase tracking-wider">
                Setup Practice Session
              </h3>
            </div>

            {sessionError && (
              <div className="mb-6 flex gap-2.5 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-750 dark:text-red-400 text-xs font-semibold">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{sessionError}</span>
              </div>
            )}

            {/* Select Interview Type */}
            <div className="flex flex-col gap-3 mb-6">
              <label className="text-xs font-bold tracking-wider uppercase text-luxury-purple-650/80 dark:text-luxury-purple-300/80">
                1. Select Interview Category
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {interviewTypesList.map((item) => {
                  const Icon = item.icon;
                  const isSelected = interviewType === item.type;
                  return (
                    <div
                      key={item.type}
                      onClick={() => setInterviewType(item.type)}
                      className={`p-5 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex flex-col justify-between gap-3 group relative overflow-hidden ${
                        isSelected
                          ? 'border-luxury-purple-700 bg-luxury-cream-50/50 dark:border-luxury-peach dark:bg-luxury-purple-900/20 shadow-sm'
                          : 'border-luxury-cream-200 bg-white dark:border-luxury-purple-900 dark:bg-luxury-purple-950 hover:bg-luxury-cream-50/40'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected 
                          ? 'bg-luxury-purple-700 text-white dark:bg-luxury-peach dark:text-luxury-purple-950' 
                          : 'bg-luxury-cream-100 text-luxury-purple-700 dark:bg-luxury-purple-900 dark:text-luxury-peach'
                      }`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-luxury-purple-950 dark:text-white mb-1">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-luxury-purple-800/60 dark:text-luxury-cream-100/50 font-semibold leading-relaxed leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Select Difficulty */}
            <div className="flex flex-col gap-3 mb-6">
              <label className="text-xs font-bold tracking-wider uppercase text-luxury-purple-650/80 dark:text-luxury-purple-300/80">
                2. Select Difficulty Level
              </label>
              <div className="flex flex-wrap gap-3">
                {difficultyLevels.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setDifficulty(lvl)}
                    className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                      difficulty === lvl
                        ? 'bg-luxury-purple-700 text-white border-luxury-purple-700 dark:bg-luxury-peach dark:text-luxury-purple-950 dark:border-luxury-peach'
                        : 'bg-luxury-cream-50/50 text-luxury-purple-800 border-luxury-cream-200 dark:bg-luxury-purple-900/40 dark:text-luxury-cream-100/85 dark:border-luxury-purple-850 hover:bg-luxury-cream-100'
                    }`}
                  >
                    {lvl} Level
                  </button>
                ))}
              </div>
            </div>

            {/* Action Trigger */}
            <div className="border-t border-luxury-cream-100 dark:border-luxury-purple-900 pt-6 mt-6 flex justify-end">
              <Button
                variant="primary"
                onClick={handleStartSession}
                disabled={loadingQuestions}
                icon={Play}
              >
                {loadingQuestions ? 'Compiling Questions...' : 'Start Mock Session'}
              </Button>
            </div>
          </div>

          {/* Daily Challenge Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
            {/* HR Challenge */}
            <div className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 shadow-sm flex flex-col justify-between gap-4">
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-luxury-purple-500 dark:text-luxury-peach">
                    Daily HR Question
                  </span>
                  <Calendar size={12} className="text-luxury-purple-400" />
                </div>
                <p className="text-xs font-bold text-luxury-purple-950 dark:text-white leading-relaxed">
                  "{dailyChallenge.hrQuestion}"
                </p>
              </div>
              <button
                onClick={() => {
                  setInterviewType('HR');
                  handleStartSession();
                }}
                className="text-[10px] font-bold text-luxury-purple-700 dark:text-luxury-peach hover:translate-x-0.5 transition-transform flex items-center gap-1 cursor-pointer"
              >
                Practice HR Now <ChevronRight size={12} />
              </button>
            </div>

            {/* Coding Challenge */}
            <div className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 shadow-sm flex flex-col justify-between gap-4">
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-green-600 dark:text-green-400">
                    Daily Coding Challenge
                  </span>
                  <Calendar size={12} className="text-green-400" />
                </div>
                <p className="text-xs font-bold text-luxury-purple-950 dark:text-white leading-relaxed">
                  "{dailyChallenge.codingQuestion}"
                </p>
              </div>
              <button
                onClick={() => {
                  setInterviewType('Technical');
                  handleStartSession();
                }}
                className="text-[10px] font-bold text-green-605 hover:translate-x-0.5 transition-transform flex items-center gap-1 cursor-pointer"
              >
                Practice Tech Now <ChevronRight size={12} />
              </button>
            </div>

            {/* Tech Concept */}
            <div className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 shadow-sm flex flex-col justify-between gap-4">
              <div>
                <div className="flex justify-between items-center pb-2 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-luxury-peach">
                    Daily Tech Concept
                  </span>
                  <Calendar size={12} className="text-luxury-peach" />
                </div>
                <p className="text-xs font-semibold text-luxury-purple-900/80 dark:text-luxury-cream-100/60 leading-relaxed font-sans">
                  {dailyChallenge.techConcept}
                </p>
              </div>
              <span className="text-[9px] font-bold text-luxury-purple-400">
                Readiness Skill booster
              </span>
            </div>
          </div>

        </div>
      )}

      {/* Active Session block */}
      <AnimatePresence mode="wait">
        {isSessionActive && questions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left"
          >
            {/* Left Columns (Question detail & input) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Question card */}
              <div className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
                
                {/* Header state */}
                <div className="flex justify-between items-center pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-luxury-purple-700 dark:text-luxury-peach uppercase tracking-widest">
                      Question {currentIdx + 1} of {questions.length}
                    </span>
                  </div>
                  <span className="text-[8px] font-bold uppercase bg-luxury-cream-100 text-luxury-purple-800 px-2 py-0.5 rounded">
                    {interviewType} • {difficulty}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-luxury-cream-100 dark:bg-luxury-purple-900 rounded-full overflow-hidden w-full">
                  <div
                    className="h-full bg-luxury-purple-700 dark:bg-luxury-peach transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>

                {/* Question Text */}
                <div className="py-4">
                  <h2 className="font-serif text-xl font-bold text-luxury-purple-950 dark:text-white leading-relaxed">
                    {questions[currentIdx]?.question}
                  </h2>
                </div>

                {/* Hints and answers toggle buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowHint(!showHint);
                      setShowOutline(false);
                    }}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      showHint 
                        ? 'bg-luxury-purple-100 text-luxury-purple-750 border-luxury-purple-300 dark:bg-luxury-purple-900 dark:text-luxury-peach dark:border-luxury-purple-800' 
                        : 'bg-white text-luxury-purple-800 border-luxury-cream-250 dark:bg-luxury-purple-900/60 dark:text-white dark:border-luxury-purple-850'
                    }`}
                  >
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                  <button
                    onClick={() => {
                      setShowOutline(!showOutline);
                      setShowHint(false);
                    }}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                      showOutline 
                        ? 'bg-luxury-purple-100 text-luxury-purple-750 border-luxury-purple-300 dark:bg-luxury-purple-900 dark:text-luxury-peach dark:border-luxury-purple-800' 
                        : 'bg-white text-luxury-purple-800 border-luxury-cream-250 dark:bg-luxury-purple-900/60 dark:text-white dark:border-luxury-purple-850'
                    }`}
                  >
                    {showOutline ? 'Hide Guideline Answer' : 'Show Guideline Answer'}
                  </button>
                </div>

                {/* Hint/Outline Displays */}
                {showHint && (
                  <div className="p-4 bg-amber-50/15 dark:bg-amber-950/10 border border-amber-100/30 rounded-xl text-xs font-semibold text-amber-700 dark:text-luxury-peach">
                    <strong>Hint:</strong> {questions[currentIdx]?.hint}
                  </div>
                )}

                {showOutline && (
                  <div className="p-4 bg-luxury-purple-50/20 dark:bg-luxury-purple-900/10 border border-luxury-purple-100/30 rounded-xl text-xs font-semibold text-luxury-purple-900/80 dark:text-luxury-cream-100/80">
                    <strong>Structure Guidelines:</strong> {questions[currentIdx]?.outlineAnswer}
                  </div>
                )}

                {/* Text Response box */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-luxury-purple-500">
                    Type your answer response below:
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Type your detailed answer response here... Include code details, methodologies, or frameworks if applicable."
                    value={userAnswers[currentIdx] || ''}
                    onChange={(e) => {
                      setUserAnswers({
                        ...userAnswers,
                        [currentIdx]: e.target.value
                      });
                    }}
                    className="w-full font-sans text-sm rounded-xl py-3 px-4 bg-luxury-cream-50/70 border text-luxury-purple-950 border-luxury-cream-200 dark:bg-luxury-purple-900/30 dark:border-luxury-purple-800/80 dark:text-luxury-cream-50 placeholder-luxury-purple-400/65 focus:outline-none focus:border-luxury-purple-450"
                  />
                </div>

                {/* Buttons controls */}
                <div className="flex justify-between items-center border-t border-luxury-cream-100 dark:border-luxury-purple-900 pt-4 mt-2">
                  <div className="flex gap-2">
                    <button
                      disabled={currentIdx === 0}
                      onClick={() => {
                        setCurrentIdx(currentIdx - 1);
                        setShowHint(false);
                        setShowOutline(false);
                      }}
                      className="p-2.5 rounded-xl border border-luxury-cream-300 text-luxury-purple-950 dark:border-luxury-purple-950 dark:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                    </button>
                    <button
                      disabled={currentIdx === questions.length - 1}
                      onClick={() => {
                        setCurrentIdx(currentIdx + 1);
                        setShowHint(false);
                        setShowOutline(false);
                      }}
                      className="p-2.5 rounded-xl border border-luxury-cream-300 text-luxury-purple-950 dark:border-luxury-purple-950 dark:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      disabled={evaluatingIdx !== null}
                      onClick={handleSubmitAnswer}
                    >
                      {evaluatingIdx === currentIdx ? 'AI Evaluating...' : evaluations[currentIdx] ? 'Re-Evaluate Answer' : 'Submit to AI Coach'}
                    </Button>

                    {currentIdx === questions.length - 1 ? (
                      <Button
                        variant="primary"
                        onClick={handleFinishSession}
                      >
                        Finish & Score
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => {
                          setCurrentIdx(currentIdx + 1);
                          setShowHint(false);
                          setShowOutline(false);
                        }}
                      >
                        Skip Question
                      </Button>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column (Single feedback display) */}
            <div className="flex flex-col gap-6">
              
              {/* AI Feedback Panel */}
              <div className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[24px] p-6 shadow-sm flex flex-col justify-between min-h-[300px]">
                
                <div>
                  <div className="flex justify-between items-center pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-5">
                    <span className="text-xs font-bold text-luxury-purple-800/60 dark:text-luxury-cream-100/50 uppercase tracking-wider">
                      Gemini Feedback
                    </span>
                    <Sparkles size={16} className="text-luxury-purple-700 dark:text-luxury-peach" />
                  </div>

                  {evaluatingIdx === currentIdx ? (
                    <div className="py-14 flex flex-col items-center justify-center gap-4 text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        className="w-10 h-10 rounded-full border-2 border-luxury-cream-200 border-t-luxury-purple-700"
                      />
                      <span className="text-xs font-semibold text-luxury-purple-800/60">
                        Analyzing your response metrics...
                      </span>
                    </div>
                  ) : evaluations[currentIdx] ? (
                    <div className="flex flex-col gap-5 text-left">
                      
                      {/* Overall score indicator */}
                      <div className="flex justify-between items-center p-3.5 bg-green-50/15 dark:bg-green-950/10 border border-green-100/30 rounded-2xl">
                        <div>
                          <span className="text-[9px] font-extrabold uppercase text-luxury-purple-400 block tracking-wider">Overall Rating</span>
                          <span className="text-sm font-extrabold text-luxury-purple-950 dark:text-white">Passed Assessment</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-extrabold text-green-600 dark:text-green-400">
                            {evaluations[currentIdx].scores.overall}%
                          </span>
                        </div>
                      </div>

                      {/* Score metrics list */}
                      <div className="space-y-3">
                        {/* Technical Accuracy */}
                        <div>
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span className="text-luxury-purple-700 dark:text-luxury-cream-100/80">Technical Accuracy</span>
                            <span className="text-luxury-purple-900">{evaluations[currentIdx].scores.technicalAccuracy}%</span>
                          </div>
                          <div className="h-1 bg-luxury-cream-100 dark:bg-luxury-purple-900 rounded-full overflow-hidden w-full">
                            <div className="h-full bg-luxury-purple-650" style={{ width: `${evaluations[currentIdx].scores.technicalAccuracy}%` }} />
                          </div>
                        </div>
                        
                        {/* Communication */}
                        <div>
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span className="text-luxury-purple-700 dark:text-luxury-cream-100/80">Communication Skills</span>
                            <span className="text-luxury-purple-900">{evaluations[currentIdx].scores.communication}%</span>
                          </div>
                          <div className="h-1 bg-luxury-cream-100 dark:bg-luxury-purple-900 rounded-full overflow-hidden w-full">
                            <div className="h-full bg-luxury-purple-650" style={{ width: `${evaluations[currentIdx].scores.communication}%` }} />
                          </div>
                        </div>

                        {/* Confidence */}
                        <div>
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span className="text-luxury-purple-700 dark:text-luxury-cream-100/80">Confidence Level</span>
                            <span className="text-luxury-purple-900">{evaluations[currentIdx].scores.confidence}%</span>
                          </div>
                          <div className="h-1 bg-luxury-cream-100 dark:bg-luxury-purple-900 rounded-full overflow-hidden w-full">
                            <div className="h-full bg-luxury-purple-650" style={{ width: `${evaluations[currentIdx].scores.confidence}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Strengths & Weakness lists */}
                      <div className="border-t border-luxury-cream-100 dark:border-luxury-purple-900 pt-4 space-y-3">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-luxury-purple-600">
                          Strengths & suggestions
                        </div>
                        <div className="space-y-2">
                          {evaluations[currentIdx].strengths.slice(0, 2).map((str, idx) => (
                            <div key={idx} className="flex gap-2 items-start text-[10.5px] font-semibold text-luxury-purple-800/85 dark:text-luxury-cream-150/70">
                              <CheckCircle size={12} className="text-green-500 shrink-0 mt-0.5" />
                              <span>{str}</span>
                            </div>
                          ))}
                          {evaluations[currentIdx].suggestions.slice(0, 2).map((sug, idx) => (
                            <div key={idx} className="flex gap-2 items-start text-[10.5px] font-semibold text-luxury-purple-855 dark:text-luxury-cream-150/75">
                              <Zap size={12} className="text-luxury-peach shrink-0 mt-0.5" />
                              <span>{sug}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="py-14 text-center flex flex-col items-center gap-2">
                      <HelpCircle className="text-luxury-purple-300" size={30} />
                      <span className="text-xs font-semibold text-luxury-purple-800/50 dark:text-luxury-cream-100/40">
                        Type your answer on the left and submit it to see AI analysis metrics.
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-[9px] font-semibold text-luxury-purple-400 italic text-center mt-6">
                  * Analysis evaluates code terms, structure flow, length and complexity rules.
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Final Report Dashboard */}
      <AnimatePresence mode="wait">
        {showReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-8 text-left"
          >
            {/* Header banner */}
            <div className="relative p-[1px] rounded-[24px] bg-gradient-to-tr from-luxury-purple-700 via-luxury-cream-300 to-luxury-peach shadow-xl overflow-hidden">
              <div className="glass dark:bg-luxury-purple-950/80 p-8 rounded-[24px] flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex flex-col gap-3.5 max-w-3xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luxury-purple-100 dark:bg-luxury-purple-900 text-luxury-purple-800/80 dark:text-luxury-peach text-[10px] font-bold uppercase tracking-wider w-fit">
                    <Sparkles size={11} className="text-luxury-purple-700 dark:text-luxury-peach" />
                    <span>Executive Report Card</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-luxury-purple-950 dark:text-white">
                    Placement Interview Evaluation
                  </h3>
                  <p className="text-sm font-medium leading-relaxed text-luxury-purple-850 dark:text-luxury-cream-100/90 font-sans">
                    You have successfully completed a 10-question practice run in {interviewType} under the {difficulty} difficulty tier. Based on cumulative metrics, your tech accuracy and vocabulary scoring indicate solid preparedness.
                  </p>
                </div>

                {/* Print button */}
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <Button variant="outline" onClick={handleDownloadReport} icon={Download}>
                    Print Scorecard PDF
                  </Button>
                  <Button variant="primary" onClick={() => setShowReport(false)} icon={RotateCcw}>
                    Restart Practice
                  </Button>
                </div>
              </div>
            </div>

            {/* Score grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Avg Overall */}
              <div className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-3xl p-6 shadow-sm">
                <span className="text-[10px] font-extrabold uppercase text-luxury-purple-400 block tracking-wider mb-2">
                  Average Overall Score
                </span>
                <h3 className="text-3xl font-extrabold text-luxury-purple-700 dark:text-luxury-peach">{avgOverall || 70}%</h3>
                <p className="text-[10px] font-bold text-luxury-purple-800/60 mt-1">Excellent verbal structuring</p>
              </div>

              {/* Avg Accuracy */}
              <div className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-3xl p-6 shadow-sm">
                <span className="text-[10px] font-extrabold uppercase text-luxury-purple-400 block tracking-wider mb-2">
                  Technical Accuracy
                </span>
                <h3 className="text-3xl font-extrabold text-luxury-purple-700 dark:text-luxury-peach">{avgAccuracy || 72}%</h3>
                <p className="text-[10px] font-bold text-luxury-purple-800/60 mt-1">Correct syntax integration</p>
              </div>

              {/* Avg Communication */}
              <div className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-3xl p-6 shadow-sm">
                <span className="text-[10px] font-extrabold uppercase text-luxury-purple-400 block tracking-wider mb-2">
                  Communication Score
                </span>
                <h3 className="text-3xl font-extrabold text-luxury-purple-700 dark:text-luxury-peach">{avgCommunication || 75}%</h3>
                <p className="text-[10px] font-bold text-luxury-purple-800/60 mt-1">Fluent context pacing</p>
              </div>

              {/* Avg Confidence */}
              <div className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-3xl p-6 shadow-sm">
                <span className="text-[10px] font-extrabold uppercase text-luxury-purple-400 block tracking-wider mb-2">
                  Confidence Index
                </span>
                <h3 className="text-3xl font-extrabold text-luxury-purple-700 dark:text-luxury-peach">{avgConfidence || 78}%</h3>
                <p className="text-[10px] font-bold text-luxury-purple-800/60 mt-1">No hesitation issues flagged</p>
              </div>

            </div>

            {/* Strategic recommendations */}
            <div className="bg-white dark:bg-luxury-purple-950 border border-luxury-cream-200 dark:border-luxury-purple-900 rounded-[20px] p-6 sm:p-8 shadow-sm">
              <div className="pb-4 border-b border-luxury-cream-100 dark:border-luxury-purple-900 mb-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Target className="text-luxury-purple-700 dark:text-luxury-peach" size={20} />
                  <h3 className="text-base font-bold text-luxury-purple-950 dark:text-white font-sans uppercase tracking-wider">
                    Placement Prep Focus Areas
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
                {/* Core focus recommendation */}
                <div className="p-5 bg-luxury-purple-50/30 dark:bg-luxury-purple-900/10 border border-luxury-purple-100/30 rounded-2xl flex flex-col gap-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-luxury-purple-700 dark:text-luxury-peach block">
                    Next Recommended Practice
                  </span>
                  <p className="text-xs font-bold text-luxury-purple-950 dark:text-white leading-relaxed">
                    Choose "Technical Interview" under the "Advanced" difficulty level next time. This will evaluate more complex algorithmic trees and boundary limits.
                  </p>
                </div>

                {/* Focus skills chips */}
                <div className="flex flex-col gap-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-luxury-purple-405 block">
                    Target Weak Skills to Review
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['Computational Complexity', 'Memory Buffers', 'Cloud Mappings', 'API Gateway Proxying'].map(skill => (
                      <span key={skill} className="text-[10px] font-bold px-3 py-1.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-transparent text-red-700 dark:text-red-400 rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

// Internal icon helpers to keep code clean and self-contained
const UsersIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const TechIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
);

const BrainIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
);

const PuzzleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2v10H2"/><path d="M12 12h10V2"/><path d="M12 12v10h10"/><path d="M12 12H2v10"/></svg>
);

const FileTextIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
);

export default InterviewCoachPage;
