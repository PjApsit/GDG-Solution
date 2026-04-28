/**
 * MyWork — Volunteer's active and completed tasks
 */
import React, { useState } from 'react';
import { mockTasks } from '../../data/mockData';
import TaskCard from '../../components/TaskCard';
import { ClipboardList, CheckCircle, Clock, Target, Camera } from 'lucide-react';
import StatCard from '../../components/StatCard';

const MyWork = () => {
  const [tab, setTab] = useState('active');
  
  // Simulate volunteer's tasks
  const activeTasks = mockTasks.filter(t => t.status === 'in_progress');
  const completedTasks = [
    { ...mockTasks[0], task_id: 'tsk-done-1', status: 'completed', title: 'Community Health Survey', completed_at: '2026-04-20', location: 'Andheri, Mumbai', ngo_name: 'HealthFirst India', priority: 'high', why: 'Completed health survey covering 340 households.', description: 'Conducted door-to-door health assessment.' },
  ];

  const handleMarkComplete = (taskId) => {
    console.log('Mark complete:', taskId);
    alert('In production, this would open photo upload for completion proof.');
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-h1 text-on-surface mb-2">My Work</h1>
        <p className="text-body-base text-on-surface-variant">Track your active missions and completed tasks.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active Tasks" value={activeTasks.length} icon={Clock} />
        <StatCard label="Completed" value={completedTasks.length} icon={CheckCircle} trend="+1 this week" trendUp={true} />
        <StatCard label="Impact Points" value="850" icon={Target} trend="+50 this month" trendUp={true} />
      </div>

      <div className="flex gap-1 bg-surface-container rounded-lg p-1">
        <button onClick={() => setTab('active')} className={`px-4 py-2 rounded-md text-body-base font-medium transition-colors ${tab === 'active' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'}`}>
          Active Tasks ({activeTasks.length})
        </button>
        <button onClick={() => setTab('completed')} className={`px-4 py-2 rounded-md text-body-base font-medium transition-colors ${tab === 'completed' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'}`}>
          Completed ({completedTasks.length})
        </button>
      </div>

      <div className="space-y-4">
        {tab === 'active' && activeTasks.map(task => (
          <div key={task.task_id} className="card">
            <TaskCard task={task} />
            <div className="mt-4 pt-4 border-t border-outline-variant flex gap-3">
              <button onClick={() => handleMarkComplete(task.task_id)} className="btn-primary flex-1">
                <Camera className="w-4 h-4" />Mark Complete (Photo Proof)
              </button>
            </div>
          </div>
        ))}
        {tab === 'completed' && completedTasks.map(task => (
          <TaskCard key={task.task_id} task={task} />
        ))}
        {tab === 'active' && activeTasks.length === 0 && (
          <div className="card text-center py-12">
            <ClipboardList className="w-12 h-12 text-on-surface-variant mx-auto mb-3" />
            <h3 className="text-h3 text-on-surface">No Active Tasks</h3>
            <p className="text-body-sm text-on-surface-variant mt-1">Check the dashboard for suggested tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWork;
