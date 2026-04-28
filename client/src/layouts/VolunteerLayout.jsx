import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { volunteerSidebarLinks } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Award,
  Heart,
  LogOut,
  User,
  Camera,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Award,
  Camera,
};

/**
 * Volunteer Layout
 * WHY: Same 240px sidebar structure as NGO for visual consistency.
 * Different navigation links reflect the volunteer role.
 * Now includes user info, report link, and proper sign-out.
 */
const VolunteerLayout = () => {
  const navigate = useNavigate();
  const auth = (() => {
    try { return useAuth(); } catch { return null; }
  })();

  const handleSignOut = async () => {
    if (auth?.signOut) {
      await auth.signOut();
    }
    navigate('/');
  };

  // Extended sidebar links with Report Need
  const links = [
    ...volunteerSidebarLinks,
    { label: 'Report Need', path: '/volunteer/report', icon: 'Camera' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <a href="#main-content" className="skip-link">Skip to content</a>
      {/* Sidebar */}
      <aside className="w-sidebar flex flex-col border-r border-outline-variant bg-surface-container-lowest shrink-0">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-primary-container">
            <Heart className="w-4 h-4 text-on-primary" />
          </div>
          <div>
            <h1 className="text-h3 text-on-surface leading-none">ImpactFlow</h1>
            <p className="text-body-sm text-on-surface-variant">Volunteer</p>
          </div>
        </div>

        {/* User Info */}
        {auth?.user && (
          <div className="px-4 py-3 border-b border-outline-variant">
            <div className="flex items-center gap-3">
              {auth.user.photoURL ? (
                <img src={auth.user.photoURL} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-body-sm font-medium text-on-surface truncate">{auth.user.displayName || 'Volunteer'}</p>
                <p className="text-body-sm text-on-surface-variant truncate text-xs">
                  {auth.userProfile?.impact_points || 0} Impact Points
                </p>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {links.map((link) => {
            const Icon = iconMap[link.icon];
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive ? 'sidebar-link-active' : 'sidebar-link'
                }
              >
                {Icon && <Icon className="w-5 h-5 shrink-0" strokeWidth={2} />}
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="px-3 py-3 border-t border-outline-variant">
          <ThemeToggle className="mb-2" />
          <button onClick={handleSignOut} className="sidebar-link w-full text-on-surface-variant hover:text-error cursor-pointer">
            <div className="flex items-center gap-3 w-full">
              <LogOut className="w-5 h-5" strokeWidth={2} />
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto" id="main-content">
        <div className="p-container-margin">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default VolunteerLayout;
