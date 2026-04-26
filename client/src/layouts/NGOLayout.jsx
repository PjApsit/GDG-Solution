import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ngoSidebarLinks } from '../data/mockData';
import {
  LayoutDashboard,
  FolderKanban,
  Database,
  Bell,
  TrendingUp,
  MessageSquare,
  Shield,
  LogOut,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  FolderKanban,
  Database,
  Bell,
  TrendingUp,
  MessageSquare,
};

/**
 * NGO Layout
 * WHY: Fixed 240px sidebar provides a persistent navigation anchor (per Civil Intelligence design).
 * Content area fills remaining space with 24px margins for breathability.
 */
const NGOLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — 240px fixed, white bg, right border */}
      <aside className="w-sidebar flex flex-col border-r border-outline-variant bg-surface-container-lowest shrink-0">
        {/* Logo area */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-primary-container">
            <Shield className="w-4 h-4 text-on-primary" />
          </div>
          <div>
            <h1 className="text-h3 text-on-surface leading-none">NGO Intel</h1>
            <p className="text-body-sm text-on-surface-variant">Decision Hub</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {ngoSidebarLinks.map((link) => {
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

        {/* Footer */}
        <div className="px-3 py-3 border-t border-outline-variant">
          <NavLink to="/" className="sidebar-link w-full text-on-surface-variant hover:text-error cursor-pointer block">
            <div className="flex items-center gap-3 w-full">
              <LogOut className="w-5 h-5" strokeWidth={2} />
              <span>Sign Out</span>
            </div>
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-container-margin">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default NGOLayout;
