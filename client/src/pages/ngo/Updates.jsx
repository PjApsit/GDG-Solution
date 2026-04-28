/**
 * Updates — Real-time activity feed / notification log
 */
import React from 'react';
import { Bell, MapPin, User, CheckCircle, AlertTriangle, Clock, ScanLine, UserPlus } from 'lucide-react';

const mockUpdates = [
  { id: 1, type: 'event', icon: AlertTriangle, color: 'text-error bg-error/10', message: 'New event reported in Dharavi, Mumbai', detail: 'Dengue outbreak — Severity 9/10', time: '2 hours ago' },
  { id: 2, type: 'volunteer', icon: UserPlus, color: 'text-primary bg-primary/10', message: 'Volunteer Arun Sharma accepted Task: Flood Relief', detail: 'Sundarbans, West Bengal', time: '3 hours ago' },
  { id: 3, type: 'completed', icon: CheckCircle, color: 'text-green-600 bg-green-50', message: 'Task completed: Water Tanker Deployment', detail: 'By Priya Desai — Thar Desert', time: '5 hours ago' },
  { id: 4, type: 'scan', icon: ScanLine, color: 'text-violet-600 bg-violet-50', message: 'AI scan completed — survey from Patna', detail: 'Cholera cases detected, priority score: 52', time: '6 hours ago' },
  { id: 5, type: 'event', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50', message: 'Event updated: Landslide Risk in Wayanad', detail: 'Severity increased to 8/10', time: '8 hours ago' },
  { id: 6, type: 'volunteer', icon: User, color: 'text-primary bg-primary/10', message: 'New volunteer registered: Sneha Patel', detail: 'Skills: Teaching, First Aid, Community Outreach', time: '12 hours ago' },
  { id: 7, type: 'completed', icon: CheckCircle, color: 'text-green-600 bg-green-50', message: 'Task completed: Door-to-door Survey', detail: 'By Kabir Ahmed — Dharavi', time: '1 day ago' },
  { id: 8, type: 'event', icon: MapPin, color: 'text-error bg-error/10', message: 'Critical event: Flood warning for Sundarbans', detail: 'Heavy rainfall predicted — 3400 affected', time: '1 day ago' },
];

const Updates = () => {
  return (
    <div className="space-y-6">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-on-surface mb-2">Activity Updates</h1>
          <p className="text-body-base text-on-surface-variant">Real-time notifications and activity feed.</p>
        </div>
        <span className="badge-success"><Bell className="w-3.5 h-3.5" />{mockUpdates.length} updates</span>
      </header>

      <div className="space-y-2">
        {mockUpdates.map((update) => {
          const Icon = update.icon;
          return (
            <div key={update.id} className="card flex items-start gap-4 hover:bg-surface-container-low transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${update.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-body-base font-medium text-on-surface">{update.message}</p>
                <p className="text-body-sm text-on-surface-variant mt-0.5">{update.detail}</p>
              </div>
              <span className="text-body-sm text-on-surface-variant shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3" />{update.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Updates;
