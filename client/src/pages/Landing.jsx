import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface text-on-surface antialiased font-inter">
      {/* TopAppBar */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md fixed top-0 w-full z-50 border-b border-teal-50 dark:border-teal-900/20 shadow-sm shadow-teal-900/5 h-20">
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 h-full">
          <div className="flex items-center gap-8">
            <span className="font-epilogue text-xl font-bold text-teal-600 dark:text-teal-400 tracking-tight">ImpactFlow AI</span>
            <div className="hidden md:flex gap-6">
              <a className="font-epilogue text-slate-600 dark:text-slate-400 font-medium hover:text-teal-500 dark:hover:text-teal-300 transition-colors duration-200" href="#about">About us</a>
              <a className="font-epilogue text-slate-600 dark:text-slate-400 font-medium hover:text-teal-500 dark:hover:text-teal-300 transition-colors duration-200" href="#features">Features</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="font-epilogue text-teal-600 dark:text-teal-400 font-medium px-4 py-2 active:scale-95 transition-transform" id="landing-signin-btn">Sign in</button>
            <button onClick={() => navigate('/login')} className="font-epilogue bg-primary text-white font-semibold px-6 py-2.5 rounded-lg active:scale-95 transition-transform hover:opacity-90 shadow-lg shadow-primary/20" id="landing-getstarted-btn">Get Started</button>
          </div>
        </nav>
      </header>
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-surface-container-low py-xl px-margin pt-16">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-xl items-center">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 bg-primary-fixed px-3 py-1 rounded-full mb-md">
                <span className="material-symbols-outlined text-primary scale-75">volunteer_activism</span>
                <span className="font-label-sm text-on-primary-fixed text-xs uppercase tracking-wider">Google Solution Challenge 2026</span>
              </div>
              <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-on-background mb-md font-bold mb-6">
                From scattered data to <span className="text-primary">life-saving action</span>.
              </h1>
              <p className="font-body-lg text-lg text-on-surface-variant mb-lg leading-relaxed max-w-xl mb-8">
                AI-powered community need detection. Photograph paper surveys, let Gemini AI extract data, and match volunteers to urgent tasks instantly.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => navigate('/login')} className="bg-primary text-white px-8 py-4 rounded-lg font-headline-sm flex items-center gap-2 hover:shadow-xl transition-all font-semibold" id="hero-start-btn">
                  Get Started
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button onClick={() => navigate('/ngo/dashboard')} className="bg-white border-2 border-primary text-primary px-8 py-4 rounded-lg font-headline-sm hover:bg-secondary-container transition-colors font-semibold" id="hero-demo-btn">
                  Try Demo
                </button>
              </div>
            </div>
            <div className="relative group mt-12 md:mt-0">
              <div className="absolute -inset-4 bg-primary-container/10 rounded-[2rem] rotate-3 group-hover:rotate-1 transition-transform"></div>
              <div className="relative aspect-square rounded-xl overflow-hidden shadow-2xl">
                <img alt="Humanitarian worker" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq1VFv-v9d3kdLVv4GUcTAPwYKznmVJ7HoTYH4213nXTuy-uVNrFO9-NY3kieOEJSD3mvEQxkH8aoLwUce4oPBfXcg6DkmwBxbbupwahiN6As-FMWsfEmJVhEXOvxWd7YFEGx9Z2j3iKAfSetSiNEmpqkWo3QL8yD_WBUFqaLwZckhfsNLeNkQkYi7dWRt2xQPQy8Y3bFNFUMsw5IU4vwxNu-89HKwfHyMLKOE26sfWQS9T54nhZLHJxQY_PuZZJf-ZBMovlVTMBU"/>
              </div>
              {/* Floating Metric Card */}
              <div className="absolute bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl flex items-center gap-4 max-w-[240px]">
                <div className="bg-tertiary-fixed p-3 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary">groups</span>
                </div>
                <div>
                  <p className="font-display-md text-primary text-2xl font-bold">42k+</p>
                  <p className="font-label-sm text-on-surface-variant text-xs font-semibold">Volunteers Connected</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-on-background mb-4">Powered by Google AI</h2>
              <div className="w-24 h-1 bg-primary-fixed mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-4 hover:shadow-lg transition-shadow">
                <span className="material-symbols-outlined text-error text-4xl">document_scanner</span>
                <h3 className="text-xl font-semibold">AI Survey Scanner</h3>
                <p className="text-base text-on-surface-variant">Photograph paper surveys and let Gemini 1.5 Flash extract structured data in 3 seconds. Supports Hindi, Marathi, and regional languages.</p>
              </div>
              <div className="p-8 rounded-xl bg-primary-container text-white shadow-lg shadow-primary/20 flex flex-col gap-4 md:scale-105">
                <span className="material-symbols-outlined text-4xl">hub</span>
                <h3 className="text-xl font-semibold">Smart Matching</h3>
                <p className="text-base">AI-powered volunteer-to-task matching using skills, proximity, and availability scoring. Prevents race conditions with transactional assignment.</p>
              </div>
              <div className="p-8 rounded-xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-4 hover:shadow-lg transition-shadow">
                <span className="material-symbols-outlined text-tertiary text-4xl">map</span>
                <h3 className="text-xl font-semibold">Live Heat Map</h3>
                <p className="text-base text-on-surface-variant">Real-time geospatial visualization of community needs with priority-based color coding. 100% free using Leaflet + OpenStreetMap.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-on-background mb-4">Unity in Fragmentation</h2>
              <div className="w-24 h-1 bg-primary-fixed mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-8 rounded-xl bg-white border border-outline-variant/30 flex flex-col gap-4">
                <span className="material-symbols-outlined text-error text-4xl">crisis_alert</span>
                <h3 className="text-xl font-semibold">The Data Gap</h3>
                <p className="text-base text-on-surface-variant">NGOs often operate in silos, leading to duplicated efforts and overlooked needs. We saw volunteers ready to help but paralyzed by a lack of clear direction.</p>
              </div>
              <div className="p-8 rounded-xl bg-white border border-outline-variant/30 flex flex-col gap-4">
                <span className="material-symbols-outlined text-primary text-4xl">auto_awesome</span>
                <h3 className="text-xl font-semibold">AI-Powered Intelligence</h3>
                <p className="text-base text-on-surface-variant">Our mission is to create a unified data nervous system for humanitarian aid. By aggregating local insights and global resources, we ensure help lands exactly where it's needed most.</p>
              </div>
              <div className="p-8 rounded-xl bg-white border border-outline-variant/30 flex flex-col gap-4">
                <span className="material-symbols-outlined text-tertiary text-4xl">verified</span>
                <h3 className="text-xl font-semibold">100% Free Stack</h3>
                <p className="text-base text-on-surface-variant">Built entirely on free Google tools: Firebase Auth, Firestore, Gemini 1.5 Flash, and Leaflet maps. No credit card needed, ever.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-16 flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-xs">
            <span className="font-epilogue text-lg font-bold text-teal-600">ImpactFlow AI</span>
            <p className="text-sm text-slate-500 mt-4 leading-relaxed">
              Empowering the humanitarian sector through AI-driven data intelligence and smart volunteer coordination.
            </p>
          </div>
          <div className="text-sm text-slate-500">
             © 2026 ImpactFlow AI. Google Solution Challenge. Dedicated to humanitarian impact.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
