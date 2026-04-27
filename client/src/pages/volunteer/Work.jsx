import React from 'react';
import { mockTasks } from '../../data/mockData';
import { 
  ClipboardList, 
  MapPin, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Filter
} from 'lucide-react';

const Work = () => {
  // Split tasks into active (assigned to user) and open (available)
  // For demo, we'll assume vol-001 is the current user
  const currentVolunteerId = 'vol-001';
  const myTasks = mockTasks.filter(t => t.volunteer_id === currentVolunteerId);
  const openTasks = mockTasks.filter(t => t.status === 'open');

  const PriorityBadge = ({ priority }) => {
    const styles = {
      critical: 'bg-error-container text-on-error-container border-error/20',
      high: 'bg-tertiary-container text-on-tertiary-container border-tertiary/20',
      medium: 'bg-secondary-container text-on-secondary-container border-secondary/20',
      low: 'bg-surface-container text-on-surface-variant border-outline-variant/20',
    };
    
    return (
      <span className={`px-2 py-0.5 rounded text-label-caps border ${styles[priority] || styles.low}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const TaskCard = ({ task, isAssigned }) => (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 hover:border-primary transition-colors cursor-pointer group">
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-1">
          <h3 className="text-h3 text-on-surface group-hover:text-primary transition-colors">{task.title}</h3>
          <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
            <span className="font-semibold text-primary">{task.ngo_name}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {task.location}
            </div>
          </div>
        </div>
        <PriorityBadge priority={task.priority} />
      </div>
      
      <p className="text-body-base text-on-surface-variant mb-4 line-clamp-2">
        {task.description}
      </p>
      
      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
            <Clock className="w-4 h-4" />
            <span>{task.created_at}</span>
          </div>
          <div className="flex items-center gap-1.5 text-body-sm text-on-surface-variant">
            {task.status === 'in_progress' ? (
              <div className="flex items-center gap-1.5 text-secondary">
                <AlertCircle className="w-4 h-4" />
                <span>In Progress</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-primary">
                <ClipboardList className="w-4 h-4" />
                <span>Open</span>
              </div>
            )}
          </div>
        </div>
        <button className="flex items-center gap-1 text-label-caps text-primary font-bold hover:underline">
          {isAssigned ? 'UPDATE STATUS' : 'VIEW DETAILS'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 text-on-surface">Volunteer Operations</h1>
          <p className="text-body-base text-on-surface-variant">Manage your active commitments and discover new opportunities.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-label-caps">FILTER</span>
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary rounded text-label-caps font-bold hover:bg-primary/90 transition-colors shadow-sm">
            FIND NEW TASKS
          </button>
        </div>
      </div>

      {/* Active Work */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
          <AlertCircle className="w-5 h-5 text-secondary" />
          <h2 className="text-h2 text-on-surface">My Active Work</h2>
          <span className="ml-auto bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-label-caps">
            {myTasks.length} ASSIGNED
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {myTasks.map(task => (
            <TaskCard key={task.task_id} task={task} isAssigned={true} />
          ))}
          {myTasks.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant rounded-lg bg-surface-container-lowest">
              <ClipboardList className="w-12 h-12 text-outline-variant mb-3" />
              <p className="text-on-surface-variant">You don't have any active tasks assigned.</p>
              <button className="mt-4 text-primary font-bold text-label-caps hover:underline">BROWSE TASK QUEUE</button>
            </div>
          )}
        </div>
      </section>

      {/* Available Opportunities */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-outline-variant pb-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          <h2 className="text-h2 text-on-surface">Available Opportunities</h2>
          <span className="ml-auto bg-primary-container text-on-primary-container px-2 py-0.5 rounded text-label-caps">
            {openTasks.length} OPEN
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {openTasks.map(task => (
            <TaskCard key={task.task_id} task={task} isAssigned={false} />
          ))}
        </div>
      </section>

      {/* Completed History (Mini) */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <h2 className="text-h2 text-on-surface">Recently Completed</h2>
          </div>
          <button className="text-primary text-label-caps font-bold hover:underline">VIEW ALL HISTORY</button>
        </div>
        <div className="text-body-sm text-on-surface-variant italic">
          No tasks completed in the last 7 days.
        </div>
      </section>
    </div>
  );
};

export default Work;
