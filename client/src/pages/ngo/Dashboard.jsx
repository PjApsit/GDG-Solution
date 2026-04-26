import React from 'react';
import StatCard from '../../components/StatCard';
import PriorityList from '../../components/PriorityList';
import HeatMap from '../../components/HeatMap';
import DecisionInsights from '../../components/DecisionInsights';
import { mockEvents, dashboardStats } from '../../data/mockData';
import { AlertTriangle, Users, CheckCircle, Database } from 'lucide-react';

const NGODashboard = () => {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-h1 text-on-surface mb-2">NGO Dashboard</h1>
        <p className="text-body-base text-on-surface-variant">
          Real-time decision intelligence and priority tracking.
        </p>
      </header>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Events"
          value={dashboardStats.totalEvents}
          icon={Database}
        />
        <StatCard
          label="Critical Areas"
          value={dashboardStats.criticalAreas}
          icon={AlertTriangle}
          trend="Requires action"
          trendUp={false}
        />
        <StatCard
          label="Active Volunteers"
          value={dashboardStats.activeVolunteers}
          icon={Users}
        />
        <StatCard
          label="Tasks Completed"
          value={dashboardStats.tasksCompleted}
          icon={CheckCircle}
          trend="+5 this week"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - Heatmap and Priority List */}
        <div className="lg:col-span-2 space-y-6">
          <HeatMap events={mockEvents} />
          <PriorityList events={mockEvents} />
        </div>

        {/* Sidebar - Decision Insights */}
        <div className="space-y-6">
          <DecisionInsights events={mockEvents} />
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
