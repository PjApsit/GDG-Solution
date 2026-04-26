import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { volunteerSidebarLinks } from '../data/mockData';
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  Heart,
  LogOut,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
};

/**
 * Volunteer Layout
 * WHY: Same 240px sidebar structure as NGO for visual consistency.
 * Different navigation links reflect the volunteer role.
 */
const VolunteerLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-sidebar flex flex-col border-r border-outline-variant bg-surface-container-lowest shrink-0">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-primary-container">
            <Heart className="w-4 h-4 text-on-primary" />
          </div>
          <div>
            <h1 className="text-h3 text-on-surface leading-none">Volunteer</h1>
            <p className="text-body-sm text-on-surface-variant">Portal</p>
          </div>
        </div>

        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          {volunteerSidebarLinks.map((link) => {
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
          <NavLink to="/" className="sidebar-link w-full text-on-surface-variant hover:text-error cursor-pointer block">
            <div className="flex items-center gap-3 w-full">
              <LogOut className="w-5 h-5" strokeWidth={2} />
              <span>Sign Out</span>
            </div>
          </NavLink>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-container-margin">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default VolunteerLayout;
