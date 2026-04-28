import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

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

  useEffect(() => {
    // 1. Get initial session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // 2. Listen to auth state changes (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session) => {
    if (session?.user) {
      setUser(session.user);
      await fetchUserProfile(session.user.id);
    } else {
      setUser(null);
      setUserProfile(null);
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 means "Row not found" - totally normal for a first-time user!
        console.error('Error fetching user profile:', error);
      }

      setUserProfile(data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In via Supabase
  const signInWithGoogle = async () => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin, // Returns to your app after Google auth
        }
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Create user profile in Supabase Database (Profiles Table)
  const createUserProfile = async (role, extraData = {}) => {
    if (!user) throw new Error('Must be signed in to create profile');
    
    const fullName = user.user_metadata?.full_name || user.email.split('@')[0];

    const profile = {
      id: user.id, // CRITICAL: Links directly to auth.users.id
      email: user.email,
      full_name: fullName,
      role, // 'ngo' or 'volunteer'
      skills: extraData.skills || [],
      location: extraData.location || '',
      organization: extraData.organization || '',
      impact_points: 0,
      tasks_completed: 0,
      contact_status: 'Online'
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .single();

    if (error) throw error;

    // If role is volunteer, also create a row in public.volunteers
    // so FK joins (project_volunteers → volunteers) always resolve.
    if (role === 'volunteer') {
      await supabase.from('volunteers').upsert({
        id: user.id,
        full_name: fullName,
        email: user.email,
        location: extraData.location || '',
        skills: extraData.skills || [],
        availability_status: 'Available',
      }, { onConflict: 'id' });
    }
    
    setUserProfile(data);
    return data;
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Sign up with Email and Password
  const signUpWithEmail = async (email, password) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in with Email and Password
  const signInWithEmail = async (email, password) => {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
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
