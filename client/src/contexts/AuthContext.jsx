/**
 * Auth Context — Global authentication state
 * WHY: Every component in the app needs to know if the user is logged in and what their role is.
 * Uses Firebase Auth with Google Sign-In (Q49 — enterprise-grade, free, zero password management).
 * 
 * Role detection reads from Firestore `users/{uid}` document.
 * First-time users are prompted to select their role (NGO or Volunteer).
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db, firebaseConfigured } from '../config/firebase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    if (!firebaseConfigured || !auth) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setUserProfile({ id: userDoc.id, ...userDoc.data() });
          } else {
            // First-time user — profile will be created during role selection
            setUserProfile(null);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError(err.message);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign-In
  const signInWithGoogle = async () => {
    setError(null);
    if (!firebaseConfigured || !auth || !googleProvider) {
      const err = new Error('Firebase is not configured.');
      setError(err.message);
      throw err;
    }
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Create user profile in Firestore (called after role selection)
  const createUserProfile = async (role, extraData = {}) => {
    if (!firebaseConfigured || !db) {
      throw new Error('Firebase is not configured.');
    }
    if (!user) throw new Error('Must be signed in to create profile');
    
    const profile = {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role, // 'ngo' or 'volunteer'
      skills: extraData.skills || [],
      location: extraData.location || '',
      organization: extraData.organization || '',
      impact_points: 0,
      tasks_completed: 0,
      tasks_active: 0,
      last_task_completed_at: null, // Q21 — task fatigue tracking
      schema_version: 1, // Q46 — schema versioning
      is_active: true, // Q42 — soft deletes
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', user.uid), profile);
    setUserProfile({ id: user.uid, ...profile });
    return profile;
  };

  // Sign out
  const signOut = async () => {
    if (!firebaseConfigured || !auth) {
      setUser(null);
      setUserProfile(null);
      return;
    }
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signInWithGoogle,
    createUserProfile,
    signOut,
    isAuthenticated: !!user,
    isProfileComplete: !!userProfile?.role,
    role: userProfile?.role || null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
