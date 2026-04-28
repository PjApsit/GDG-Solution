/**
 * Login Page — Firebase Google Sign-In
 * WHY (Q49): Enterprise-grade security, 1-click login, zero password management, all free.
 * 
 * Flow:
 * 1. User clicks "Sign in with Google"
 * 2. Firebase popup handles authentication
 * 3. If first-time user → show role selection (NGO or Volunteer)
 * 4. After role selection → redirect to appropriate dashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Heart, Users, Zap, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithGoogle, signUpWithEmail, signInWithEmail, createUserProfile, isAuthenticated, isProfileComplete, role, user, loading } = useAuth();
  
  const [step, setStep] = useState('login'); // 'login' | 'role' | 'details'
  const [selectedRole, setSelectedRole] = useState(null);
  const [skills, setSkills] = useState([]);
  const [organization, setOrganization] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState(null);
  
  // Email/Password states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setIsSigningIn(true);
    setError(null);
    setSuccessMessage(null);
    try {
      if (isSignUp) {
        const data = await signUpWithEmail(email, password);
        // If session is null, it means email confirmation is required by Supabase config.
        if (data?.user && !data?.session) {
          setSuccessMessage("Success! Please check your email to verify your account.");
          setIsSigningIn(false);
        } else {
          // If session exists, they are logged in, useEffect will handle redirect
        }
      } else {
        await signInWithEmail(email, password);
        // useEffect will redirect if successful
      }
    } catch (err) {
      setError(err.message);
      setIsSigningIn(false);
    }
  };

  // Redirect if already authenticated with complete profile
  useEffect(() => {
    if (!loading && isAuthenticated && isProfileComplete) {
      const redirectPath = role === 'ngo' ? '/ngo/dashboard' : '/volunteer/dashboard';
      navigate(redirectPath, { replace: true });
    }
    // If authenticated but no profile, show role selection
    if (!loading && isAuthenticated && !isProfileComplete) {
      setStep('role');
    }
  }, [isAuthenticated, isProfileComplete, role, loading, navigate]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
      // Auth state change will trigger the useEffect above
    } catch (err) {
      setError(err.message);
      setIsSigningIn(false);
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep('details');
  };

  const handleComplete = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await createUserProfile(selectedRole, {
        skills,
        organization,
      });
      const redirectPath = selectedRole === 'ngo' ? '/ngo/dashboard' : '/volunteer/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message);
      setIsSigningIn(false);
    }
  };

  const availableSkills = [
    'First Aid', 'Medical', 'Logistics', 'Water Management',
    'Community Outreach', 'Data Entry', 'Teaching', 'Construction',
    'Counseling', 'Disaster Relief', 'Food Distribution', 'Transportation',
  ];

  const toggleSkill = (skill) => {
    setSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  // LOGIN STEP
  if (step === 'login') {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Left Panel — Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-container to-blue-700 p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute top-20 -left-10 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/90 font-bold text-xl tracking-tight">ImpactFlow AI</span>
            </div>
            <p className="text-white/60 text-sm">Google Solution Challenge 2026</p>
          </div>

          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl font-bold text-white leading-tight">
              From scattered data to<br />
              <span className="text-blue-200">life-saving action.</span>
            </h2>
            <p className="text-white/70 text-lg max-w-md leading-relaxed">
              AI-powered community need detection. Smart volunteer matching. Real-time coordination.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-3xl font-bold text-white">42K+</p>
                <p className="text-white/60 text-sm">Volunteers Connected</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">98%</p>
                <p className="text-white/60 text-sm">AI Accuracy</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">3s</p>
                <p className="text-white/60 text-sm">Avg. Scan Time</p>
              </div>
            </div>
          </div>

          <p className="text-white/40 text-sm relative z-10">
            Built with Google Gemini AI, Firebase & Leaflet Maps
          </p>
        </div>

        {/* Right Panel — Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 justify-center mb-4">
              <Sparkles className="w-7 h-7 text-primary" />
              <span className="text-primary font-bold text-2xl">ImpactFlow AI</span>
            </div>

            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold text-on-surface mb-2">Welcome back</h1>
              <p className="text-on-surface-variant text-base">
                Sign in to continue making an impact.
              </p>
            </div>

            {error && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                <p className="text-error text-sm">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-primary text-sm font-medium">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="text-label-caps uppercase text-on-surface-variant mb-1 block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="text-label-caps uppercase text-on-surface-variant mb-1 block">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                {isSigningIn ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>{isSignUp ? 'Sign Up' : 'Sign In'} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="text-center text-sm">
              <span className="text-on-surface-variant">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </span>{' '}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary font-medium hover:underline"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-sm text-on-surface-variant">or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-outline-variant rounded-xl px-6 py-4 text-on-surface font-semibold text-base hover:bg-surface-container-low hover:border-primary/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98]"
              id="google-signin-btn"
            >
              {isSigningIn ? (
                <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )}
              {isSigningIn ? 'Signing in...' : 'Continue with Google'}
            </button>

            <div className="relative pt-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-sm text-on-surface-variant">or explore without signing in</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/ngo/dashboard')}
                className="btn-secondary py-3 text-sm"
                id="demo-ngo-btn"
              >
                <Shield className="w-4 h-4" />
                NGO Demo
              </button>
              <button
                onClick={() => navigate('/volunteer/dashboard')}
                className="btn-secondary py-3 text-sm"
                id="demo-volunteer-btn"
              >
                <Heart className="w-4 h-4" />
                Volunteer Demo
              </button>
            </div>

            <p className="text-center text-sm text-on-surface-variant">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ROLE SELECTION STEP
  if (step === 'role') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-on-primary" />
            </div>
            <h1 className="text-3xl font-bold text-on-surface mb-2">
              Welcome, {user?.displayName?.split(' ')[0]}!
            </h1>
            <p className="text-on-surface-variant text-base">
              How would you like to use ImpactFlow AI?
            </p>
          </div>

          <div className="grid gap-4">
            <button
              onClick={() => handleRoleSelect('ngo')}
              className={`p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-lg ${
                selectedRole === 'ngo'
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-outline-variant hover:border-primary/30'
              }`}
              id="role-ngo-btn"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-on-primary" />
                </div>
                <div>
                  <h3 className="text-h3 text-on-surface mb-1">NGO / Organization</h3>
                  <p className="text-body-base text-on-surface-variant">
                    Upload surveys, manage tasks, coordinate volunteers, and view analytics.
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('volunteer')}
              className={`p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-lg ${
                selectedRole === 'volunteer'
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-outline-variant hover:border-primary/30'
              }`}
              id="role-volunteer-btn"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-tertiary-container/20 rounded-xl flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 text-tertiary" />
                </div>
                <div>
                  <h3 className="text-h3 text-on-surface mb-1">Volunteer</h3>
                  <p className="text-body-base text-on-surface-variant">
                    Discover nearby tasks, accept missions, report needs, and earn impact points.
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DETAILS STEP (skills for volunteers, org name for NGOs)
  if (step === 'details') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-lg space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-on-surface mb-2">
              {selectedRole === 'ngo' ? 'Organization Details' : 'Your Skills'}
            </h1>
            <p className="text-on-surface-variant text-base">
              {selectedRole === 'ngo'
                ? 'Tell us about your organization.'
                : 'Select your skills to get matched with relevant tasks.'}
            </p>
          </div>

          {selectedRole === 'ngo' ? (
            <div className="space-y-4">
              <div>
                <label className="text-label-caps uppercase text-on-surface-variant mb-2 block">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g., HealthFirst India"
                  className="input-field"
                  id="org-name-input"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="text-label-caps uppercase text-on-surface-variant mb-2 block">
                Select Your Skills (choose all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      skills.includes(skill)
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:border-primary/30'
                    }`}
                    id={`skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {skills.length > 0 && (
                <p className="text-body-sm text-primary">
                  {skills.length} skill{skills.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4">
              <p className="text-error text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setStep('role')}
              className="btn-secondary flex-1 py-3"
            >
              Back
            </button>
            <button
              onClick={handleComplete}
              disabled={isSigningIn || (selectedRole === 'ngo' && !organization)}
              className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              id="complete-profile-btn"
            >
              {isSigningIn ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Get Started <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Login;
