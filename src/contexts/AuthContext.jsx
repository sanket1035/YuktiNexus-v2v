import React, { createContext, useState, useEffect } from 'react';
import { auth, db, googleProvider, isConfigured } from '../services/firebase';
import { mockAuthService, mockFirestoreService } from '../services/firebaseMock';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const dbMode = isConfigured ? 'firebase' : 'mock';

  // Load auth state
  useEffect(() => {
    let unsubscribe = () => {};

    if (isConfigured && auth) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          // Fetch firestore profile
          try {
            const docRef = doc(db, 'profiles', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setUserProfile(docSnap.data());
            } else {
              setUserProfile(null);
            }
          } catch (e) {
            console.error("Error fetching user profile:", e);
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      });
    } else {
      // Mock Auth State Check
      const activeUser = mockAuthService.getCurrentUser();
      if (activeUser) {
        setCurrentUser(activeUser);
        mockFirestoreService.getProfile(activeUser.uid).then((profile) => {
          setUserProfile(profile);
          setLoading(false);
        }).catch(() => {
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isConfigured && auth) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Fetch firestore profile
        const docRef = doc(db, 'profiles', userCredential.user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserProfile(docSnap.data());
        }
        setCurrentUser(userCredential.user);
        return userCredential.user;
      } else {
        const mockUser = await mockAuthService.signIn(email, password);
        const profile = await mockFirestoreService.getProfile(mockUser.uid);
        setCurrentUser(mockUser);
        setUserProfile(profile);
        return mockUser;
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, educationalDetails) => {
    setLoading(true);
    try {
      if (isConfigured && auth) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Write profile details to Firestore
        const profileData = {
          uid: userCredential.user.uid,
          email,
          fullName: educationalDetails.fullName,
          college: educationalDetails.college,
          degree: educationalDetails.degree,
          branch: educationalDetails.branch,
          graduationYear: educationalDetails.graduationYear,
          careerGoal: educationalDetails.careerGoal,
          skills: [],
          dreamCareer: '',
          photoURL: `https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=${encodeURIComponent(educationalDetails.fullName)}&backgroundColor=b6e3f4`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isNewUser: true
        };

        await setDoc(doc(db, 'profiles', userCredential.user.uid), profileData);
        setCurrentUser(userCredential.user);
        setUserProfile(profileData);
        return userCredential.user;
      } else {
        const mockUser = await mockAuthService.signUp(email, password, educationalDetails);
        const profile = await mockFirestoreService.getProfile(mockUser.uid);
        setCurrentUser(mockUser);
        setUserProfile(profile);
        return mockUser;
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (isConfigured && auth && googleProvider) {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        // Check if firestore profile already exists
        const docRef = doc(db, 'profiles', user.uid);
        const docSnap = await getDoc(docRef);
        
        let profile;
        if (!docSnap.exists()) {
          // Create initial details from google auth
          profile = {
            uid: user.uid,
            email: user.email,
            fullName: user.displayName || 'Google User',
            college: '',
            degree: '',
            branch: '',
            graduationYear: '',
            careerGoal: '',
            skills: [],
            dreamCareer: '',
            photoURL: user.photoURL || `https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=${encodeURIComponent(user.displayName || 'User')}&backgroundColor=b6e3f4`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isNewUser: true
          };
          await setDoc(docRef, profile);
        } else {
          profile = docSnap.data();
        }

        setCurrentUser(user);
        setUserProfile(profile);
        return { user, isNew: !docSnap.exists() || profile.isNewUser };
      } else {
        const mockUser = await mockAuthService.signInWithGoogle();
        const profile = await mockFirestoreService.getProfile(mockUser.uid);
        setCurrentUser(mockUser);
        setUserProfile(profile);
        return { user: mockUser, isNew: mockUser.isNewUser };
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isConfigured && auth) {
        await firebaseSignOut(auth);
      } else {
        await mockAuthService.signOut();
      }
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    if (isConfigured && auth) {
      await sendPasswordResetEmail(auth, email);
    } else {
      await mockAuthService.sendPasswordResetEmail(email);
    }
  };

  const updateProfile = async (profileData) => {
    if (!currentUser) return;
    if (isConfigured && db) {
      const docRef = doc(db, 'profiles', currentUser.uid);
      await setDoc(docRef, { ...profileData, updatedAt: new Date().toISOString() }, { merge: true });
      // Fetch updated profile
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      }
    } else {
      const updated = await mockFirestoreService.setProfile(currentUser.uid, profileData);
      setUserProfile(updated);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      dbMode,
      login,
      register,
      loginWithGoogle,
      logout,
      resetPassword,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
