import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Sign Up Page — matches Stitch "Sign Up - NGO Intel" screen
 * 
 * Features: Role toggle (Volunteer/NGO), Google SSO, email+password form,
 * terms checkbox, decorative gradient blobs, header + footer
 */
const SignUp = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('volunteer'); // 'volunteer' | 'ngo'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Route to correct dashboard based on role
    if (role === 'volunteer') {
      navigate('/volunteer/dashboard');
    } else {
      navigate('/ngo/dashboard');
    }
  };

  return (
    <div className="font-inter text-on-surface flex flex-col min-h-screen bg-surface relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-full opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-fixed-dim blur-[100px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[300px] h-[300px] rounded-full bg-tertiary-fixed-dim blur-[80px]" />
      </div>
      <div className="fixed bottom-0 left-0 -z-10 w-1/3 h-full opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary-fixed-dim blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
        <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-7xl mx-auto">
          <div
            className="text-2xl font-bold text-primary tracking-tight cursor-pointer active:scale-95 transition-transform"
            onClick={() => navigate('/')}
          >
            NGO Intel
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a className="text-on-surface-variant hover:text-primary transition-colors text-body-base" href="#">About</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-body-base" href="#">Impact Stories</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors text-body-base" href="#">Resources</a>
          </nav>
          <button
            className="text-primary font-semibold cursor-pointer active:scale-95 transition-transform hover:text-primary/80"
            onClick={() => navigate('/')}
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-32 pb-16 px-6 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-8 md:p-12">
            {/* Heading */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-semibold text-on-surface tracking-tight mb-2">Join our mission</h1>
              <p className="text-body-base text-secondary">Create an account to start making a real-world impact.</p>
            </div>

            {/* Role Selection Toggle */}
            <div className="flex p-1 bg-surface-container-low rounded-lg mb-8">
              <button
                onClick={() => setRole('volunteer')}
                className={`flex-1 py-3 px-4 rounded-lg text-label-caps font-semibold transition-all duration-200 ${
                  role === 'volunteer'
                    ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                Volunteer
              </button>
              <button
                onClick={() => setRole('ngo')}
                className={`flex-1 py-3 px-4 rounded-lg text-label-caps font-semibold transition-all duration-200 ${
                  role === 'ngo'
                    ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                NGO / Partner
              </button>
            </div>

            {/* Google SSO */}
            <button className="w-full flex items-center justify-center gap-3 py-3.5 px-6 border border-outline-variant rounded-lg font-semibold text-on-surface hover:bg-surface-container-low transition-colors active:scale-[0.98]">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative my-8 flex items-center">
              <div className="flex-grow border-t border-outline-variant" />
              <span className="flex-shrink mx-4 text-label-caps font-semibold text-secondary uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-outline-variant" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-label-caps font-semibold text-on-surface mb-2" htmlFor="signup-email">
                  Email Address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-body-base placeholder:text-outline-variant"
                  required
                />
              </div>
              <div>
                <label className="block text-label-caps font-semibold text-on-surface mb-2" htmlFor="signup-password">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-body-base placeholder:text-outline-variant"
                  required
                  minLength={8}
                />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="signup-terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
                />
                <label className="text-body-sm text-secondary" htmlFor="signup-terms">
                  I agree to the{' '}
                  <a className="text-primary hover:underline" href="#">Terms of Service</a> and{' '}
                  <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
                </label>
              </div>
              <button
                type="submit"
                disabled={!agreed}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-on-primary font-semibold py-4 rounded-lg transition-all active:scale-[0.98] shadow-md shadow-primary/10"
              >
                Create Account
              </button>
            </form>

            <p className="text-center mt-8 text-body-base text-secondary">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/')}
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 mt-auto bg-surface-container-low border-t border-outline-variant/30">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-4">
          <div className="font-bold text-primary">NGO Intel</div>
          <div className="flex flex-wrap justify-center gap-6">
            <a className="text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline underline-offset-4" href="#">Privacy Policy</a>
            <a className="text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline underline-offset-4" href="#">Terms of Service</a>
            <a className="text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline underline-offset-4" href="#">Contact Us</a>
            <a className="text-body-sm text-on-surface-variant hover:text-primary transition-colors hover:underline underline-offset-4" href="#">Help Center</a>
          </div>
          <div className="text-body-sm text-on-surface-variant">
            © 2026 NGO Intel. Built for human impact.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignUp;
