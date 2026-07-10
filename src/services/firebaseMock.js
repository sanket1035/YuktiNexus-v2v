// Mock Firebase Authentication & Firestore Service using LocalStorage
// Implements simulated network delays (800ms) for high-fidelity UI loading states

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

const getMockUsers = () => {
  return JSON.parse(localStorage.getItem('sherise_mock_users') || '[]');
};

const saveMockUsers = (users) => {
  localStorage.setItem('sherise_mock_users', JSON.stringify(users));
};

const getMockProfiles = () => {
  return JSON.parse(localStorage.getItem('sherise_mock_profiles') || '{}');
};

const saveMockProfiles = (profiles) => {
  localStorage.setItem('sherise_mock_profiles', JSON.stringify(profiles));
};

export const mockAuthService = {
  // Sign Up with Email and Password
  signUp: async (email, password, profileData = {}) => {
    await delay(1000);
    const users = getMockUsers();
    
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('auth/email-already-in-use');
    }

    const uid = 'mock_uid_' + Math.random().toString(36).substr(2, 9);
    const newUser = { uid, email, password: btoa(password), emailVerified: true };
    users.push(newUser);
    saveMockUsers(users);

    // Save profile metadata
    const profiles = getMockProfiles();
    profiles[uid] = {
      uid,
      email,
      fullName: profileData.fullName || '',
      college: profileData.college || '',
      degree: profileData.degree || '',
      branch: profileData.branch || '',
      graduationYear: profileData.graduationYear || '',
      careerGoal: profileData.careerGoal || '',
      skills: profileData.skills || [],
      dreamCareer: profileData.dreamCareer || '',
      photoURL: profileData.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profileData.fullName || 'User')}&clothing=blazerAndShirt`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveMockProfiles(profiles);

    const sessionUser = { uid, email, displayName: profileData.fullName || '' };
    localStorage.setItem('sherise_mock_active_user', JSON.stringify(sessionUser));
    return sessionUser;
  },

  // Sign In with Email and Password
  signIn: async (email, password) => {
    await delay(1000);
    const users = getMockUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== btoa(password)) {
      throw new Error('auth/invalid-credential');
    }

    const profiles = getMockProfiles();
    const profile = profiles[user.uid] || {};

    const sessionUser = { uid: user.uid, email: user.email, displayName: profile.fullName || '' };
    localStorage.setItem('sherise_mock_active_user', JSON.stringify(sessionUser));
    return sessionUser;
  },

  // Sign In with Google Mock
  signInWithGoogle: async () => {
    await delay(1200);
    const mockGoogleUsers = [
      { email: 'ananya.sharma@stem.edu', name: 'Ananya Sharma' },
      { email: 'priya.patel@tech.org', name: 'Priya Patel' },
      { email: 'aditi.sen@science.net', name: 'Aditi Sen' }
    ];
    // Pick one randomly or use default
    const selected = mockGoogleUsers[Math.floor(Math.random() * mockGoogleUsers.length)];
    
    const users = getMockUsers();
    let user = users.find(u => u.email.toLowerCase() === selected.email.toLowerCase());
    
    let uid;
    if (!user) {
      uid = 'mock_g_uid_' + Math.random().toString(36).substr(2, 9);
      const newUser = { uid, email: selected.email, password: btoa('GoogleAuth123!'), emailVerified: true };
      users.push(newUser);
      saveMockUsers(users);

      // Create initial profile
      const profiles = getMockProfiles();
      profiles[uid] = {
        uid,
        email: selected.email,
        fullName: selected.name,
        college: 'Indian Institute of Technology (IIT)',
        degree: 'B.Tech',
        branch: 'Computer Science & Engineering',
        graduationYear: '2027',
        careerGoal: 'AI/ML Researcher',
        skills: ['Python', 'SQL', 'Data Science'],
        dreamCareer: 'Machine Learning Engineer',
        photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selected.name)}&clothing=blazerAndShirt`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isNewUser: true // Flag to trigger Profile Setup if needed
      };
      saveMockProfiles(profiles);
    } else {
      uid = user.uid;
    }

    const profiles = getMockProfiles();
    const profile = profiles[uid] || {};
    
    const sessionUser = { 
      uid, 
      email: selected.email, 
      displayName: selected.name,
      photoURL: profile.photoURL,
      isNewUser: profile.isNewUser || false
    };
    localStorage.setItem('sherise_mock_active_user', JSON.stringify(sessionUser));
    return sessionUser;
  },

  // Sign Out
  signOut: async () => {
    await delay(500);
    localStorage.removeItem('sherise_mock_active_user');
  },

  // Send Password Reset Email Mock
  sendPasswordResetEmail: async (email) => {
    await delay(800);
    const users = getMockUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('auth/user-not-found');
    }
    // Simulate successfully sending email
    return true;
  },

  // Check Current Active Session (on page reload)
  getCurrentUser: () => {
    const saved = localStorage.getItem('sherise_mock_active_user');
    return saved ? JSON.parse(saved) : null;
  }
};

export const mockFirestoreService = {
  // Get Profile
  getProfile: async (uid) => {
    await delay(600);
    const profiles = getMockProfiles();
    return profiles[uid] || null;
  },

  // Create or Update Profile
  setProfile: async (uid, profileData) => {
    await delay(800);
    const profiles = getMockProfiles();
    const existingProfile = profiles[uid] || {};
    
    profiles[uid] = {
      ...existingProfile,
      ...profileData,
      uid,
      photoURL: profileData.photoURL || existingProfile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profileData.fullName || 'User')}&clothing=blazerAndShirt`,
      updatedAt: new Date().toISOString(),
      isNewUser: false // Clear setup flag on save
    };
    
    saveMockProfiles(profiles);
    
    // Update active user displayName if changed
    const activeUser = localStorage.getItem('sherise_mock_active_user');
    if (activeUser) {
      const parsed = JSON.parse(activeUser);
      if (parsed.uid === uid) {
        parsed.displayName = profiles[uid].fullName;
        parsed.photoURL = profiles[uid].photoURL;
        localStorage.setItem('sherise_mock_active_user', JSON.stringify(parsed));
      }
    }
    return profiles[uid];
  }
};
