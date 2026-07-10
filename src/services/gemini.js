// SheRise AI - Gemini API Client & Fallback Mock Service (Upgraded for Module 2 Enhancements)
// Direct REST API integration for light payload and seamless operation

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Fetch the API Key from import.meta.env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const isGeminiConfigured = !!(apiKey && apiKey !== 'your_gemini_api_key' && apiKey.trim() !== '');

/**
 * Sends a prompt to the Gemini API and parses the JSON response.
 * Fallbacks to mock generation if key is missing or call fails.
 */
export const analyzeCareerProfile = async (careerGoal, currentSkills, resumeFileName = '') => {
  if (!isGeminiConfigured) {
    console.warn("Gemini API key is not configured. Falling back to local dynamic Sandbox Mock.");
    return await generateLocalMockAnalysis(careerGoal, currentSkills, resumeFileName);
  }

  const prompt = `
You are SheRise AI, an expert career advisor and technical recruiter specializing in empowering women in STEM.
Analyze the following user profile and return a detailed JSON object representing their career readiness, ATS resume checks, salary estimates, and gap analysis.

User Career Goal: ${careerGoal}
User Current Skills: ${currentSkills.join(', ') || 'No skills listed'}
Uploaded Resume Filename: ${resumeFileName || 'None'}

Please construct the analysis based on standard industrial tracks for the career goal.
Ensure your response is valid JSON matching EXACTLY the format below:

{
  "careerReadinessScore": 82,
  "careerConfidenceScore": 88,
  "atsResumeScore": 85,
  "aiSummary": "You possess a strong foundation in React and JavaScript. To transition successfully into an AI Engineer role, focus on expanding your knowledge in machine learning concepts, backend systems, and pipeline containerization. You are approximately 4-6 months away from being internship ready.",
  "whyScore": {
    "strengths": [
      "Strong Programming Foundation in core languages",
      "Excellent frontend interface modular design concepts",
      "Active engagement in project portfolios"
    ],
    "improvements": [
      "Cloud Deployment configuration knowledge is missing",
      "Docker and pipeline containerization is required",
      "Open-source commits in STEM repositories can be improved"
    ]
  },
  "careerComparison": {
    "bestMatchRecommendation": "Frontend Developer currently offers the highest readiness based on your active skill profile. However, AI Engineer is highly feasible within 4 months of completing the roadmap.",
    "tracks": [
      { "career": "AI Engineer", "score": 82 },
      { "career": "Frontend Developer", "score": 91 },
      { "career": "Data Scientist", "score": 74 },
      { "career": "Cloud Engineer", "score": 67 }
    ]
  },
  "atsSuggestions": [
    "Add measurable achievements and project performance metrics",
    "Include a direct hyperlink to your active GitHub profile",
    "Improve professional summary by listing specific framework integrations",
    "Add technical keywords like Vector Embeddings and RAG models"
  ],
  "strengths": [
    "Python scripting syntax",
    "React state management",
    "Firebase Firestore databases",
    "STEM project structuring",
    "Effective collaborative team communication"
  ],
  "weaknesses": [
    "Docker container orchestration",
    "AWS cloud deployment scaling",
    "TensorFlow layer training parameters",
    "Server network configuration",
    "Real-time technical interview confidence under timing constraints"
  ],
  "weeklyActionPlan": [
    { "week": "Week 1", "task": "Complete Docker Basics", "details": "Learn container terminology, write basic Dockerfiles, and package a local React web application." },
    { "week": "Week 2", "task": "Deploy REST Microservice", "details": "Deploy a simple API server on Render/Vercel and configure CORS security rules." },
    { "week": "Week 3", "task": "Build AI Mini Project", "details": "Integrate the Gemini API, construct local retrieval pipelines, and index sample text." },
    { "week": "Week 4", "task": "Apply to 10 Internships", "details": "Incorporate tech keywords into your resume, publish your projects on GitHub, and apply through STEM portals." }
  ],
  "salaryProjection": {
    "currentRange": "₹5–8 LPA",
    "projectedRange": "₹10–14 LPA",
    "disclaimer": "Predictions are AI-generated estimates based on industrial averages for STEM recruits."
  },
  "resumeChecklist": [
    { "text": "Add GitHub profile hyperlink", "completed": false },
    { "text": "Include active LinkedIn profile details", "completed": false },
    { "text": "Improve professional summary introduction", "completed": true },
    { "text": "Add measurable metrics (e.g. Optimized queries by 30%)", "completed": false },
    { "text": "Attach cloud or framework certifications", "completed": false },
    { "text": "Refactor technical skills categorizations", "completed": true }
  ],
  "skillGapAnalysis": {
    "currentSkills": ["React", "JavaScript", "CSS"],
    "missingSkills": [
      {
        "name": "Python & PyTorch",
        "whyImportant": "Core programming language and library used to construct and load neural network models."
      },
      {
        "name": "Docker",
        "whyImportant": "Crucial for packaging and deploying machine learning pipelines in reproducible environments."
      },
      {
        "name": "Gemini API / LLM Prompting",
        "whyImportant": "Necessary for integrating state-of-the-art foundation models into software systems."
      },
      {
        "name": "SQL & Vector Databases",
        "whyImportant": "Required to query relational data and query semantic knowledge bases using embeddings."
      }
    ]
  },
  "personalizedRoadmap": [
    { "month": "Month 1", "task": "Master Python & PyTorch Basics", "details": "Learn data structures, object-oriented concepts in Python, and practice simple tensor math in PyTorch." },
    { "month": "Month 2", "task": "Build local RAG Applications", "details": "Integrate the Gemini API, read text vectors from a database, and construct custom context feeds." },
    { "month": "Month 3", "task": "Learn Containerization & Docker", "details": "Write Dockerfiles for your projects, build containers, and deploy them on lightweight cloud servers." },
    { "month": "Month 4", "task": "Machine Learning Foundations", "details": "Understand supervised/unsupervised training algorithms and linear regressions." },
    { "month": "Month 5", "task": "Contribute to Open Source STEM repositories", "details": "Locate repos on GitHub related to AI packages, read codebases, and resolve open documentation or bug issues." },
    { "month": "Month 6", "task": "Internship Applications & Resume Audit", "details": "Refactor your portfolio to highlight your AI pipelines and apply to STEM opportunity portals." }
  ],
  "recommendedProjects": [
    {
      "title": "AI-Powered PDF Summarizer",
      "difficulty": "Easy",
      "time": "2 weeks",
      "technologies": ["Python", "FastAPI", "Gemini API"],
      "outcome": "Created a lightweight web app that parses uploaded PDFs and queries LLMs for core bulleted highlights."
    },
    {
      "title": "ML Model Pipeline Container",
      "difficulty": "Medium",
      "time": "3 weeks",
      "technologies": ["Docker", "Python", "Flask", "Scikit-Learn"],
      "outcome": "Packaged a sentiment analysis classifier inside a Docker container with local health check scripts."
    },
    {
      "title": "Semantic Knowledge Base with Vector Search",
      "difficulty": "Hard",
      "time": "4 weeks",
      "technologies": ["ChromaDB", "Python", "Streamlit", "SentenceTransformers"],
      "outcome": "Constructed an indexing crawler that converts local files into vector embeds for lightning-fast matching."
    },
    {
      "title": "Automated Code Review Assistant",
      "difficulty": "Medium",
      "time": "3 weeks",
      "technologies": ["NodeJS", "GitHub Actions", "Gemini API"],
      "outcome": "Built a CI/CD web-hook helper that flags complexity issues in GitHub commits using LLMs."
    },
    {
      "title": "STEM Scholar Matcher Portal",
      "difficulty": "Hard",
      "time": "5 weeks",
      "technologies": ["React", "Firebase", "Python", "Gemini API"],
      "outcome": "Developed an matching algorithm that alerts STEM students of scholarships matching their college majors."
    }
  ],
  "learningResources": [
    { "name": "Google AI Studio Documentation", "type": "Documentation", "link": "https://ai.google.dev", "description": "Official guides, quickstarts, and reference documents for implementing Gemini APIs." },
    { "name": "DeepLearning.AI: Prompt Engineering for Developers", "type": "Coursera", "link": "https://www.deeplearning.ai", "description": "Short micro-credential detailing how to construct prompts and parser systems." },
    { "name": "Hugging Face Course: NLP Basics", "type": "Documentation", "link": "https://huggingface.co/course", "description": "Hands-on tutorials for fine-tuning transformers and working with neural weights." },
    { "name": "Docker Deep Dive Book", "type": "Books", "link": "https://docker.com", "description": "Comprehensive reference guide explaining network mappings, daemon structure, and builds." },
    { "name": "Gemini API Cookbook GitHub Repository", "type": "GitHub", "link": "https://github.com/google-gemini/cookbook", "description": "A collection of python scripts, notebooks, and prompt architectures maintained by Google." }
  ],
  "readinessBreakdown": [
    { "subject": "Programming", "value": 75 },
    { "subject": "Projects", "value": 60 },
    { "subject": "Communication", "value": 85 },
    { "subject": "Resume", "value": 70 },
    { "subject": "Problem Solving", "value": 65 },
    { "subject": "Open Source", "value": 40 }
  ],
  "personalizedTips": {
    "dailyTip": "Write clean, modular code. Take 15 minutes today to document your local projects with a detailed README file.",
    "weeklyGoal": "Build a simple web crawler or REST endpoint using Python's FastAPI framework.",
    "monthlyGoal": "Containerize your current React applications using multi-stage Docker builds to reduce bundle footprints.",
    "careerAdvice": "Participate in STEM hackathons to build collaboration habits and practice presenting technical designs under deadlines."
  }
}

Return ONLY raw JSON. Do NOT wrap it in markdown code blocks like \`\`\`json.
`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Clean potential markdown wrap
    textResponse = textResponse.replace(/^```json/, '').replace(/```$/, '').trim();
    
    return JSON.parse(textResponse);
  } catch (error) {
    console.error("Gemini API call failed, falling back to local Sandbox Mock:", error);
    return await generateLocalMockAnalysis(careerGoal, currentSkills, resumeFileName);
  }
};

/**
 * Generate a dynamic local mock response matching the selected goal and current skills.
 */
const generateLocalMockAnalysis = async (careerGoal, currentSkills, resumeFileName = '') => {
  // Simulate network latency (1.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const goal = careerGoal || 'Software Engineer';
  const cleanSkills = currentSkills.map(s => s.trim());
  const skillCount = cleanSkills.length;
  
  // Calculate readiness score
  let score = 30 + Math.min(skillCount * 8, 55);
  if (resumeFileName) score += 8;
  score = Math.min(score, 98);

  // Confidence and ATS scores
  const confidenceScore = Math.min(score + 6, 96);
  const atsScore = resumeFileName ? Math.min(score + 10, 95) : 45; // lower if no resume uploaded

  // Setup Dynamic Categories based on track
  let missing = [];
  let summary = "";
  let roadmap = [];
  let projects = [];
  let resources = [];
  let breakdown = [];
  let dailyTip = "";
  let weeklyGoal = "";
  let strengths = [];
  let weaknesses = [];
  let whyStrengths = [];
  let whyImprovements = [];
  let comparisonTracks = [];
  let comparisonBestMatch = "";
  let salaryCur = "₹5–8 LPA";
  let salaryProj = "₹10–14 LPA";

  // Pre-calculated comparison tracks
  const trackScores = {
    ai: goal.includes('AI') || goal.includes('ML') || goal.includes('Scientist') ? score : Math.max(score - 15, 55),
    frontend: goal.includes('Frontend') || goal.includes('Design') || cleanSkills.includes('React') ? Math.max(score, 80) : Math.max(score - 10, 60),
    data: goal.includes('Data') || cleanSkills.includes('Python') ? Math.max(score - 5, 70) : Math.max(score - 20, 50),
    cloud: goal.includes('Cloud') || cleanSkills.includes('Docker') ? Math.max(score, 75) : Math.max(score - 18, 55),
  };

  comparisonTracks = [
    { "career": "AI Engineer", "score": trackScores.ai },
    { "career": "Frontend Developer", "score": trackScores.frontend },
    { "career": "Data Scientist", "score": trackScores.data },
    { "career": "Cloud Engineer", "score": trackScores.cloud }
  ];

  // Best Match calculation
  const bestTrack = [...comparisonTracks].sort((a,b) => b.score - a.score)[0];
  comparisonBestMatch = `${bestTrack.career} currently offers the highest readiness (${bestTrack.score}%) based on your active skill profile. To transition into ${goal}, complete the roadmap below.`;

  if (goal.includes('AI') || goal.includes('ML') || goal.includes('Scientist')) {
    whyStrengths = [
      "Strong coding structures in core languages like Python",
      "Great logical processing capabilities",
      "Demonstrated aptitude for data-driven modeling"
    ];
    whyImprovements = [
      "Docker and microservices packaging are missing",
      "Model deployment pipelines and vector indices required",
      "More open-source commits in STEM repositories recommended"
    ];
    strengths = ["Python Scripting", "Data Structures", "SQL Querying", "Problem Solving", "Collaboration"];
    weaknesses = ["Docker Containers", "Vector Databases", "MLOps Pipelines", "PyTorch Layers", "System Scale"];
    missing = [
      { name: "Python & Pandas", whyImportant: "Required for high-performance data manipulation, tensor math, and ML training pipelines." },
      { name: "Docker Containerization", whyImportant: "Enables packaging complex AI models and pipelines into reproducible execution layers." },
      { name: "Vector Databases (Pinecone/ChromaDB)", whyImportant: "Allows indexing vector embeddings for semantic, context-aware RAG search queries." },
      { name: "Scikit-Learn & PyTorch", whyImportant: "Essential frameworks for loading models, predicting labels, and adjusting neural weights." }
    ];
    summary = `You already possess a strong software development foundation with practical projects. To transition successfully into an AI Engineer, focus on TensorFlow, Docker, cloud deployment, and open-source contributions. You are approximately 4-6 months away from being internship ready.`;
    roadmap = [
      { month: "Month 1", task: "Python & Pandas Essentials", details: "Learn Jupyter Notebooks, manipulate large datasets, and practice vector math configurations." },
      { month: "Month 2", task: "Scikit-Learn Modeling", details: "Build regression classifiers, evaluate precision/recall statistics, and save binary model weights." },
      { month: "Month 3", task: "Deep Learning Foundations", details: "Study gradient descent mechanics, loss optimization, and load tensors using PyTorch." },
      { month: "Month 4", task: "RAG & LLM Pipeline Integration", details: "Incorporate Gemini APIs, index semantic context files, and build automated vector queries." },
      { month: "Month 5", task: "Docker and Microservice Hosting", details: "Dockerize a Python REST endpoint, publish image footprints, and host on cloud clusters." },
      { month: "Month 6", task: "Resume Review & Hackathon Projects", details: "Publish projects to GitHub with interactive readmes, and target junior AI engineering listings." }
    ];
    projects = [
      { title: "Intelligent PDF Summarizer API", difficulty: "Easy", time: "2 weeks", technologies: ["Python", "FastAPI", "Gemini API"], outcome: "Extracts text from files and yields structured bulleted notes using generative AI models." },
      { title: "Iris Species Classifier Pipeline", difficulty: "Easy", time: "1 week", technologies: ["Python", "Scikit-Learn", "Flask"], outcome: "A basic REST app that receives botanical parameters and outputs flower category predictions." },
      { title: "Semantic Resume Matcher Engine", difficulty: "Medium", time: "3 weeks", technologies: ["ChromaDB", "FastAPI", "SentenceTransformers"], outcome: "Index resume strings and search matches by comparing geometric cosine distances." },
      { title: "Automated Git PR Assessor Bot", difficulty: "Hard", time: "4 weeks", technologies: ["NodeJS", "GitHub Actions", "Gemini API"], outcome: "Automatically inspects newly created pull requests for syntax leaks and returns review cards." },
      { title: "Personalized Study Roadmap Portal", difficulty: "Hard", time: "5 weeks", technologies: ["React", "Tailwind", "Python", "Gemini API"], outcome: "Custom dashboard generating study maps based on pre-audited student skill sets." }
    ];
    resources = [
      { name: "Google AI Studio Quickstart Guides", type: "Documentation", link: "https://ai.google.dev", description: "Official documentation for requesting API keys and tweaking candidate parameters." },
      { name: "Kaggle Course: Intro to Machine Learning", type: "Coursera", link: "https://kaggle.com/learn", description: "Interactive coding environments teaching model fits, splits, and parameter trees." },
      { name: "PyTorch Official 60-Minute Blitz", type: "Documentation", link: "https://pytorch.org/tutorials", description: "Practical guides introducing basic neural configurations and backward gradients." },
      { name: "MLOps Zoomcamp Course Repository", type: "GitHub", link: "https://github.com/DataTalksClub/mlops-zoomcamp", description: "Excellent open guides teaching orchestration, model monitoring, and pipeline registries." },
      { name: "Designing Machine Learning Systems Book", type: "Books", link: "https://amazon.com", description: "Recruiter-recommended text covering batch pipelines, inference latencies, and vector indexes." }
    ];
    breakdown = [
      { subject: "Programming", value: Math.min(score - 10, 85) },
      { subject: "Projects", value: Math.min(score - 15, 80) },
      { subject: "Communication", value: 85 },
      { subject: "Resume", value: Math.min(score - 5, 90) },
      { subject: "Problem Solving", value: 75 },
      { subject: "Open Source", value: 40 }
    ];
    dailyTip = "Take 10 minutes today to learn about vector retrieval mechanics and how RAG differs from fine-tuning.";
    weeklyGoal = "Write a basic FastAPI app that serves predicted labels from a pickled scikit-learn model.";
    salaryCur = "₹6–9 LPA";
    salaryProj = "₹12–18 LPA";
  } else if (goal.includes('Frontend') || goal.includes('Design') || goal.includes('React')) {
    whyStrengths = [
      "Excellent mastery of UI layouts and modern JavaScript structure",
      "Hands-on portfolio containing modular React assets",
      "Appreciation of visual hierarchy and responsive styling"
    ];
    whyImprovements = [
      "TypeScript static declarations should be adopted",
      "NextJS App Router directory structure needs review",
      "Unit testing frameworks like Vitest are missing"
    ];
    strengths = ["JavaScript ES6", "React Framework", "Figma Prototyping", "Tailwind CSS", "Semantic HTML"];
    weaknesses = ["TypeScript Union Types", "NextJS App Routing", "Webpack Bundling", "Unit Test Suites", "SEO Layout Audits"];
    missing = [
      { name: "TypeScript Core Integration", whyImportant: "Enforces structural type contracts, reducing runtime bugs in heavy client codebases." },
      { name: "Next.js (App Router)", whyImportant: "Standard framework for server-side rendering, metadata optimization, and layout routing." },
      { name: "Framer Motion", whyImportant: "Industry favorite library for rendering micro-interactions and layout transitions." },
      { name: "Tailwind CSS Utilities", whyImportant: "Accelerates design assembly using reusable, inline color and spacing tokens." }
    ];
    summary = `You possess a strong software engineering foundation with practical web layouts. To grow as a premium Frontend Architect, focus on TypeScript interfaces, Next.js, and Framer Motion micro-interactions. You are approximately 3-5 months away from being internship ready.`;
    roadmap = [
      { month: "Month 1", task: "TypeScript Foundations", details: "Convert your basic JS apps to TS, configure tsconfig parameters, and learn interface types." },
      { month: "Month 2", task: "Next.js App Router Structure", details: "Understand server components vs client components, layouts, and data fetch hooks." },
      { month: "Month 3", task: "Framer Motion Physics", details: "Implement smooth layout slides, spring hover animations, and orchestrate menu popovers." },
      { month: "Month 4", task: "Global State & Caching Libraries", details: "Implement modern state containers like Zustand or React Context API configurations." },
      { month: "Month 5", task: "Unit Testing with Vitest", details: "Write unit tests for UI events, mock fetch routers, and inspect core test coverage." },
      { month: "Month 6", task: "Speed Optimization and SEO", details: "Measure bundle footprints using build analyzers, optimize images, and align semantic labels." }
    ];
    projects = [
      { title: "Glassmorphic Task Dashboard", difficulty: "Easy", time: "2 weeks", technologies: ["React", "Framer Motion", "Tailwind"], outcome: "Beautiful personal task planner utilizing local storage and smooth dragging panels." },
      { title: "STEM Internship Finder Dashboard", difficulty: "Medium", time: "3 weeks", technologies: ["Next.js", "TypeScript", "Vercel"], outcome: "A lightning-fast opportunity web portal featuring instant search filters and static generation." },
      { title: "Framer-Animated Portfolio Showcase", difficulty: "Medium", time: "2 weeks", technologies: ["React", "Framer Motion", "Tailwind"], outcome: "Responsive interactive developer portfolio exhibiting custom page transitions." },
      { title: "UI Design Tokens Library", difficulty: "Hard", time: "4 weeks", technologies: ["React", "TypeScript", "Tailwind", "npm"], outcome: "A reusable, typed layout library published as an npm package with component document docs." },
      { title: "Collaborative Whiteboard Application", difficulty: "Hard", time: "5 weeks", technologies: ["Next.js", "TypeScript", "Socket.io"], outcome: "Real-time painting and canvas sharing dashboard allowing synchronized team design sessions." }
    ];
    resources = [
      { name: "React 19 Official Upgrading Guides", type: "Documentation", link: "https://react.dev", description: "Official documentation covering action hooks, form statuses, and compiler updates." },
      { name: "Next.js Learn Portal", type: "Coursera", link: "https://nextjs.org/learn", description: "Interactive guided steps teaching caching layouts, routing directories, and builds." },
      { name: "Framer Motion API Reference Docs", type: "Documentation", link: "https://motion.dev", description: "Guides, spring curve templates, and keyframe arrays for designing fluid UIs." },
      { name: "TypeScript Handbook Guide", type: "Books", link: "https://typescriptlang.org", description: "The official handbook clarifying type narrowing, union interfaces, and generic declarations." },
      { name: "Awesome Tailwind CSS GitHub Repository", type: "GitHub", link: "https://github.com/anuraghazra/awesome-tailwindcss", description: "Curated catalog of design elements, grids, icons, and theme extensions." }
    ];
    breakdown = [
      { subject: "Programming", value: Math.min(score, 90) },
      { subject: "Projects", value: Math.min(score - 5, 85) },
      { subject: "Communication", value: 92 },
      { subject: "Resume", value: Math.min(score + 5, 95) },
      { subject: "Problem Solving", value: 70 },
      { subject: "Open Source", value: 50 }
    ];
    dailyTip = "Check your contrast ratios! Use Chrome DevTools audits to ensure your layouts support accessible contrast standards.";
    weeklyGoal = "Convert an existing vanilla JS portfolio project to use fully static TypeScript interfaces.";
    salaryCur = "₹5–7 LPA";
    salaryProj = "₹9–13 LPA";
  } else {
    // Default generic Software Engineering Track
    whyStrengths = [
      "Familiarity with foundational OOP structures",
      "Competency building relational database models",
      "Strong debugging habits"
    ];
    whyImprovements = [
      "Container deployment skills are missing",
      "Continuous Integration actions need to be integrated",
      "System design caches and load managers need research"
    ];
    strengths = ["Algorithmic Logic", "Data Schemas", "Git Workflows", "API Routing", "Unit Tests"];
    weaknesses = ["Container Security", "CI Pipelines", "Microservice Splits", "Redis Caching", "Server Mappings"];
    missing = [
      { name: "Data Structures & Algorithms", whyImportant: "Necessary for writing time-efficient scripts and passing technical problem rounds." },
      { name: "Docker & Container Basics", whyImportant: "Standard tool for running web applications in isolated environments." },
      { name: "CI/CD Pipeline Configurations", whyImportant: "Automates testing and deployment workflows upon pushing commits to repositories." },
      { name: "System Design Paradigms", whyImportant: "Required to design highly scalable server systems, load balancers, and caches." }
    ];
    summary = `You possess a solid software engineering foundation. To target advanced technical opportunities, focus on data structure algorithms, Docker container wrapping, and CI/CD pipelines. You are approximately 4-6 months away from being internship ready.`;
    roadmap = [
      { month: "Month 1", task: "DSA & Problem Solving", details: "Practice arrays, hash maps, binary trees, and write unit tests for recursive functions." },
      { month: "Month 2", task: "Relational DBs & SQL", details: "Study schema models, join queries, transaction isolates, and practice local indexes." },
      { month: "Month 3", task: "Docker and Web Servers", details: "Write multi-stage Docker builds, map ports, and launch local proxy servers." },
      { month: "Month 4", task: "RESTful API Integration", details: "Understand routing headers, status payloads, authentication layers, and documentation tools." },
      { month: "Month 5", task: "GitHub Actions CI/CD", details: "Write YAML files to trigger test suites automatically whenever code gets pushed." },
      { month: "Month 6", task: "Mock Interviews & Portfolios", details: "Practice live system design concepts, assemble project cards, and review resumes." }
    ];
    projects = [
      { title: "Clean RESTful E-Commerce Backend", difficulty: "Medium", time: "3 weeks", technologies: ["NodeJS", "Express", "PostgreSQL"], outcome: "Includes secure session logins, payment routers, and transaction rollbacks." },
      { title: "Containerized API Gateway Proxy", difficulty: "Medium", time: "2 weeks", technologies: ["Go", "Docker", "Nginx"], outcome: "Forwards endpoint requests to multiple backend server systems with load balancing." },
      { title: "STEM Scholarship Tracker App", difficulty: "Easy", time: "2 weeks", technologies: ["React", "Firebase", "Tailwind"], outcome: "A portal showcasing scholarships with local search tools and notifications." },
      { title: "Distributed Task Scheduler", difficulty: "Hard", time: "4 weeks", technologies: ["Python", "Redis", "Celery"], outcome: "Fires backend processes at scheduled intervals and monitors worker thread states." },
      { title: "Real-time Messaging Chatroom", difficulty: "Hard", time: "4 weeks", technologies: ["Go", "WebSockets", "React"], outcome: "A highly scalable chat app supporting group channels and history retrieval." }
    ];
    resources = [
      { name: "MDN Web Docs: Web Dev Resources", type: "Documentation", link: "https://developer.mozilla.org", description: "Comprehensive reference guide for understanding network protocols and browser models." },
      { name: "LeetCode Study Guides", type: "Coursera", link: "https://leetcode.com", description: "Practices arrays, linked structures, and typical algorithmic sorting patterns." },
      { name: "Git Actions Workflows Guide", type: "Documentation", link: "https://github.com/features/actions", description: "Official manuals for compiling, testing, and publishing packages." },
      { name: "System Design Primer Guide", type: "GitHub", link: "https://github.com/donnemartin/system-design-primer", description: "Legendary repository explaining database shards, load managers, and key caches." },
      { name: "Pragmatic Programmer Book", type: "Books", link: "https://amazon.com", description: "Classic text focusing on software debugging, refactoring, and code flexibility." }
    ];
    breakdown = [
      { subject: "Programming", value: Math.min(score + 5, 95) },
      { subject: "Projects", value: Math.min(score, 88) },
      { subject: "Communication", value: 80 },
      { subject: "Resume", value: Math.min(score - 5, 85) },
      { subject: "Problem Solving", value: 85 },
      { subject: "Open Source", value: 45 }
    ];
    dailyTip = "Ensure your APIs return appropriate status codes! (e.g. 200 for OK, 401 for unauthorized, 404 for missing).";
    weeklyGoal = "Practice drawing a high-level system design flow diagram for a real-time messaging architecture.";
    salaryCur = "₹5–8 LPA";
    salaryProj = "₹10–14 LPA";
  }

  // ATS Suggestions
  const atsSuggestions = [
    "Incorporate quantifiable metrics (e.g. 'boosted speeds by 25%')",
    "Verify your GitHub link is clickable in the header section",
    "Tailor the professional summary to mention specific engineering architectures",
    "List exact STEM keywords (e.g. Vector embeds, containerization, RAG)"
  ];

  // Weekly Action Plan (4 Weeks)
  const weeklyActionPlan = [
    { "week": "Week 1", "task": `Master ${goal} Basics`, "details": `Learn foundational components, read documentation guides, and configure local environments.` },
    { "week": "Week 2", "task": "Implement Mini Frameworks", "details": "Develop simple testing pipelines, practice modular routing, and run local integration tests." },
    { "week": "Week 3", "task": "Assemble Showcase Project", "details": "Construct a functional portfolio application, publish source code on GitHub, and document README." },
    { "week": "Week 4", "task": "Resume Keywords Sync & Applies", "details": "Inject missing technical tags into your profile, compile achievements, and submit applications." }
  ];

  // Resume Checklist (dynamic based on file presence)
  const resumeChecklist = [
    { "text": "Include active GitHub profile URL", "completed": cleanSkills.includes('Git') },
    { "text": "Include active LinkedIn profile details", "completed": cleanSkills.length > 2 },
    { "text": "Improve professional summary introduction", "completed": true },
    { "text": "Include measurable metrics & achievements", "completed": resumeFileName.length > 0 },
    { "text": "Attach cloud or framework certifications", "completed": false },
    { "text": "Clean technical skills categorizations", "completed": true }
  ];

  return {
    careerReadinessScore: score,
    careerConfidenceScore: confidenceScore,
    atsResumeScore: atsScore,
    aiSummary: summary,
    whyScore: {
      strengths: whyStrengths,
      improvements: whyImprovements
    },
    careerComparison: {
      bestMatchRecommendation: comparisonBestMatch,
      tracks: comparisonTracks
    },
    atsSuggestions,
    strengths,
    weaknesses,
    weeklyActionPlan,
    salaryProjection: {
      currentRange: salaryCur,
      projectedRange: salaryProj,
      disclaimer: "Predictions are AI-generated estimates based on industrial averages for STEM recruits."
    },
    resumeChecklist,
    skillGapAnalysis: {
      currentSkills: cleanSkills.length > 0 ? cleanSkills : ['Python', 'React', 'Git'],
      missingSkills: missing
    },
    personalizedRoadmap: roadmap,
    recommendedProjects: projects,
    learningResources: resources,
    readinessBreakdown: breakdown,
    personalizedTips: {
      dailyTip,
      weeklyGoal,
      monthlyGoal: "Incorporate containerization or cloud deployment scripts into your personal projects.",
      careerAdvice: "Network with other women in tech! Join organizations like Women Techmakers and attend local study groups."
    }
  };
};

/**
 * Fetch Opportunity Recommendations based on career path, skills, and readiness score.
 */
export const getOpportunityRecommendations = async (careerGoal, currentSkills, readinessScore = 50) => {
  if (!isGeminiConfigured) {
    console.warn("Gemini API key is not configured. Falling back to local dynamic Opportunity mock.");
    return await generateLocalMockOpportunities(careerGoal, currentSkills, readinessScore);
  }

  const prompt = `
You are SheRise AI, an expert career advisor and technical recruiter.
Recommend a list of 8 opportunities matching the user's STEM qualifications:

User Career Goal: ${careerGoal}
User Current Skills: ${currentSkills.join(', ') || 'None'}
User Readiness Score: ${readinessScore}%

Categorize each opportunity exactly into one of:
"Internships", "Hackathons", "Scholarships", "Open Source", "Competitions", "Women Communities", "Mentorship Programs", "Remote Jobs", "Certifications", "Conferences".

Ensure your response is valid JSON matching EXACTLY the format below:
[
  {
    "id": "opp-unique-1",
    "title": "STEP Internship 2026",
    "organization": "Google",
    "category": "Internships",
    "difficulty": "Beginner",
    "locationType": "Hybrid",
    "deadlineDays": 12,
    "eligibility": "Second-year B.Tech students in STEM.",
    "description": "A 12-week summer internship targeting computer science undergraduates, offering mentoring and hands-on coding.",
    "applyLink": "https://careers.google.com",
    "matchScore": 94,
    "reason": "Matches your Python and Git knowledge, and is beginner-friendly.",
    "trendingBadge": "Popular"
  }
]

Return ONLY raw JSON. Do NOT wrap it in markdown code blocks like \`\`\`json.
`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    textResponse = textResponse.replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(textResponse);
  } catch (error) {
    console.error("Gemini Opportunity fetch failed, falling back to mock sandbox:", error);
    return await generateLocalMockOpportunities(careerGoal, currentSkills, readinessScore);
  }
};

/**
 * Generates a local mock catalog of matching opportunities based on selected tracks and skills.
 */
const generateLocalMockOpportunities = async (careerGoal, currentSkills, readinessScore = 50) => {
  // Simulate network latency (1 second)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const goal = careerGoal || 'AI Engineer';
  const cleanSkills = currentSkills.map(s => s.trim().toLowerCase());

  // Comprehensive static opportunity database
  const baseOpportunities = [
    {
      id: "opp-1",
      title: "Google STEP Internship 2026",
      organization: "Google",
      category: "Internships",
      difficulty: "Beginner",
      locationType: "Hybrid",
      deadlineDays: 8,
      eligibility: "B.Tech/B.E. second-year undergraduates in Computer Science or related fields.",
      description: "Development program designed for second-year undergraduates, offering hands-on coding tasks and mentorship.",
      applyLink: "https://careers.google.com/jobs",
      trendingBadge: "Popular",
      keywords: ["python", "java", "c++", "git", "javascript"]
    },
    {
      id: "opp-2",
      title: "Microsoft SWE Summer Intern",
      organization: "Microsoft",
      category: "Internships",
      difficulty: "Intermediate",
      locationType: "Offline",
      deadlineDays: 15,
      eligibility: "Penultimate year B.Tech/M.Tech students with good programming basics.",
      description: "Solve complex technical design problems, write scalable services, and collaborate with product teams.",
      applyLink: "https://careers.microsoft.com",
      trendingBadge: "Trending",
      keywords: ["c#", "java", "python", "typescript", "git", "sql"]
    },
    {
      id: "opp-3",
      title: "Adobe Women-in-Technology Scholarship",
      organization: "Adobe",
      category: "Scholarships",
      difficulty: "Beginner",
      locationType: "Remote",
      deadlineDays: 20,
      eligibility: "Full-time female STEM students with strong academic scores.",
      description: "Provides ₹2,00,000 tuition grant and an internship interview opportunity at Adobe India.",
      applyLink: "https://research.adobe.com/scholarships",
      trendingBadge: "Popular",
      keywords: ["python", "javascript", "react", "c++", "problem solving"]
    },
    {
      id: "opp-4",
      title: "Generation Google Scholarship (APAC)",
      organization: "Google",
      category: "Scholarships",
      difficulty: "Beginner",
      locationType: "Remote",
      deadlineDays: 14,
      eligibility: "Female students pursuing computer science or software engineering degrees.",
      description: "A $2,500 USD grant awarded based on academic performance and dedication to diversity and leadership in STEM.",
      applyLink: "https://buildyourfor.withgoogle.com/scholarships",
      trendingBadge: "Closing Today",
      keywords: ["programming", "leadership", "stem", "problem solving"]
    },
    {
      id: "opp-5",
      title: "Smart India Hackathon - WIE track",
      organization: "Govt of India",
      category: "Hackathons",
      difficulty: "Intermediate",
      locationType: "Offline",
      deadlineDays: 5,
      eligibility: "Teams representing recognized academic colleges. Must include female developers.",
      description: "National hackathon challenge solving pressing industrial and administrative problems under 36-hour timelines.",
      applyLink: "https://sih.gov.in",
      trendingBadge: "Trending",
      keywords: ["react", "node.js", "firebase", "python", "sql", "git"]
    },
    {
      id: "opp-6",
      title: "SheBuilds Global STEM Hackathon",
      organization: "Women Who Code",
      category: "Hackathons",
      difficulty: "Beginner",
      locationType: "Remote",
      deadlineDays: 18,
      eligibility: "Open to female and non-binary designers and engineers worldwide.",
      description: "Build innovative web/mobile apps utilizing APIs to promote sustainable education or health accessibility.",
      applyLink: "https://womenwhocode.com",
      trendingBadge: "Recently Added",
      keywords: ["react", "tailwind", "figma", "firebase", "javascript"]
    },
    {
      id: "opp-7",
      title: "Google Summer of Code (GSoC) 2026",
      organization: "Google Open Source",
      category: "Open Source",
      difficulty: "Advanced",
      locationType: "Remote",
      deadlineDays: 30,
      eligibility: "Open to students and open-source beginners aged 18+.",
      description: "A global program providing stipends to write code for open-source organizations under mentor supervision.",
      applyLink: "https://summerofcode.withgoogle.com",
      trendingBadge: "Popular",
      keywords: ["git", "github", "python", "c++", "javascript", "docker"]
    },
    {
      id: "opp-8",
      title: "Outreachy Open Source Internships",
      organization: "Software Freedom Conservancy",
      category: "Open Source",
      difficulty: "Intermediate",
      locationType: "Remote",
      deadlineDays: 25,
      eligibility: "People subject to systemic bias in the tech industry.",
      description: "A 3-month paid remote internship supporting open source development and documentation tasks.",
      applyLink: "https://outreachy.org",
      trendingBadge: "Trending",
      keywords: ["git", "github", "documentation", "python", "javascript"]
    },
    {
      id: "opp-9",
      title: "Grace Hopper Celebration 2026",
      organization: "AnitaB.org",
      category: "Conferences",
      difficulty: "Beginner",
      locationType: "Offline",
      deadlineDays: 45,
      eligibility: "Female students and industry professionals in technical computing.",
      description: "The world's largest gathering of women technologists, offering keynote panels, networking, and career fairs.",
      applyLink: "https://ghc.anitab.org",
      trendingBadge: "Popular",
      keywords: ["networking", "stem", "career advancement"]
    },
    {
      id: "opp-10",
      title: "Women in Data Science (WiDS) Event",
      organization: "Stanford University",
      category: "Conferences",
      difficulty: "Intermediate",
      locationType: "Hybrid",
      deadlineDays: 22,
      eligibility: "Open to anyone interested in data science and computational modeling.",
      description: "Technical conference featuring stellar female researchers explaining regressions, pipelines, and vector models.",
      applyLink: "https://widsconference.org",
      trendingBadge: "Recently Added",
      keywords: ["python", "data science", "machine learning", "pandas"]
    },
    {
      id: "opp-11",
      title: "Google Women in Engineering Mentorship",
      organization: "Google India",
      category: "Mentorship Programs",
      difficulty: "Beginner",
      locationType: "Hybrid",
      deadlineDays: 10,
      eligibility: "Third-year female B.Tech students pursuing technical streams.",
      description: "A structured 12-week program matching students with Google engineers to prepare for technical interview loops.",
      applyLink: "https://buildyourfor.withgoogle.com",
      trendingBadge: "Trending",
      keywords: ["dsa", "interview prep", "problem solving", "c++", "python", "java"]
    },
    {
      id: "opp-12",
      title: "Junior AI/ML Engineer (Remote)",
      organization: "Scale AI",
      category: "Remote Jobs",
      difficulty: "Intermediate",
      locationType: "Remote",
      deadlineDays: 16,
      eligibility: "STEM graduates with good coding fluency in Python and ML libraries.",
      description: "Write backend endpoints to serve predictions, clean data sets, and evaluate classification boundaries.",
      applyLink: "https://scale.com/careers",
      trendingBadge: "Trending",
      keywords: ["python", "fastapi", "docker", "pytorch", "scikit-learn", "git"]
    },
    {
      id: "opp-13",
      title: "AWS Certified Developer - STEM Grant",
      organization: "Amazon Web Services",
      category: "Certifications",
      difficulty: "Intermediate",
      locationType: "Remote",
      deadlineDays: 50,
      eligibility: "Female university students in tech streams. Grants cover 100% exam fees.",
      description: "Validates technical expertise in developing, maintaining, and deploying applications on AWS cloud systems.",
      applyLink: "https://aws.amazon.com/education",
      trendingBadge: "Popular",
      keywords: ["aws", "cloud", "deployment", "node.js", "python"]
    },
    {
      id: "opp-14",
      title: "ElevateHer Coding Challenge 2026",
      organization: "Unstop Challenge",
      category: "Competitions",
      difficulty: "Intermediate",
      locationType: "Remote",
      deadlineDays: 6,
      eligibility: "STEM students from engineering colleges.",
      description: "Online coding hackathon checking algorithms, syntax, and problem-solving skills under time deadlines.",
      applyLink: "https://unstop.com",
      trendingBadge: "Closing Today",
      keywords: ["dsa", "c++", "java", "python", "problem solving"]
    }
  ];

  // Process opportunities and calculate custom scores based on skills matching
  const scoredOpportunities = baseOpportunities.map(opp => {
    // Calculate matching keywords
    const matches = opp.keywords.filter(kw => cleanSkills.includes(kw));
    const matchCount = matches.length;

    // Calculate match score dynamically
    let matchScore = 65 + Math.min(matchCount * 10, 30);
    
    // Boost score if career goal matches category
    if (goal.includes('AI') && opp.keywords.includes('python')) matchScore += 4;
    if (goal.includes('Frontend') && opp.keywords.includes('react')) matchScore += 5;
    
    matchScore = Math.min(matchScore, 98);

    // Formulate a dynamic recommendation reason
    let reason = "";
    if (matchCount > 0) {
      reason = `Highly recommended because your skills in ${matches.slice(0, 2).join(' and ')} closely match this opportunity.`;
    } else if (opp.difficulty === 'Beginner') {
      reason = `Recommended as an entry-level pathway to build up your core STEM qualifications in ${opp.category}.`;
    } else {
      reason = `Recommended to expand your STEM profile and prepare for ${goal} placements.`;
    }

    return {
      id: opp.id,
      title: opp.title,
      organization: opp.organization,
      category: opp.category,
      difficulty: opp.difficulty,
      locationType: opp.locationType,
      deadlineDays: opp.deadlineDays,
      eligibility: opp.eligibility,
      description: opp.description,
      applyLink: opp.applyLink,
      matchScore,
      reason,
      trendingBadge: opp.trendingBadge
    };
  });

  // Filter based on career relevance
  // Sort scored list so that the highest match score appears first
  return scoredOpportunities.sort((a, b) => b.matchScore - a.matchScore);
};

