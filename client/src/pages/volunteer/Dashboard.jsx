import React from 'react';
import TaskCard from '../../components/TaskCard';
import { mockTasks } from '../../data/mockData';
import { Target, TrendingUp, Users } from 'lucide-react';
import StatCard from '../../components/StatCard';

const VolunteerDashboard = () => {
  const suggestedTasks = mockTasks.filter(t => t.status === 'open');

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-h1 text-on-surface mb-2">Volunteer Portal</h1>
        <p className="text-body-base text-on-surface-variant">
          Discover opportunities matching your skills and availability.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Tasks Completed" value="12" icon={Target} />
        <StatCard label="Impact Score" value="850" icon={TrendingUp} trend="+50 this month" trendUp={true} />
        <StatCard label="NGOs Supported" value="3" icon={Users} />
      </div>

      <div>
        <h2 className="text-h2 text-on-surface mb-4">Suggested Tasks</h2>
        <p className="text-body-sm text-on-surface-variant mb-6">
          Tasks are recommended based on priority and your registered skills (Medical, Logistics).
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {suggestedTasks.map(task => (
            <TaskCard 
              key={task.task_id} 
              task={task} 
              showActions={true}
              onAccept={(id) => console.log('Accept', id)}
              onDecline={(id) => console.log('Decline', id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
