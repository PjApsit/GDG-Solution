import React from 'react';
import { mockTasks, mockVolunteers } from '../../data/mockData';
import TaskCard from '../../components/TaskCard';
import StatCard from '../../components/StatCard';
import { User, MapPin, Briefcase, ClipboardList, CheckCircle, Clock } from 'lucide-react';

/**
 * NGO Projects page
 * WHY: NGOs need a single place to see every task, its status, and which volunteer is assigned.
 * Pairs task details with volunteer profile for full situational awareness.
 */

const statusOrder = { open: 0, in_progress: 1, completed: 2 };

const Projects = () => {
  const sortedTasks = [...mockTasks].sort(
    (a, b) => statusOrder[a.status] - statusOrder[b.status]
  );

  const openCount = mockTasks.filter(t => t.status === 'open').length;
  const inProgressCount = mockTasks.filter(t => t.status === 'in_progress').length;
  const completedCount = mockTasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-8">
      <header className="mb-2">
        <h1 className="text-h1 text-on-surface mb-2">Projects</h1>
        <p className="text-body-base text-on-surface-variant">
          All tasks with volunteer assignments and full details.
        </p>
      </header>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Open Tasks" value={openCount} icon={ClipboardList} />
        <StatCard label="In Progress" value={inProgressCount} icon={Clock} />
        <StatCard label="Completed" value={completedCount} icon={CheckCircle} />
      </div>

      {/* ── Task + Volunteer List ── */}
      <section id="task-volunteer-list" className="space-y-6">
        <h2 className="text-h2 text-on-surface">Task & Volunteer Details</h2>
        {sortedTasks.map(task => {
          const volunteer = task.volunteer_id
            ? mockVolunteers.find(v => v.id === task.volunteer_id)
            : null;

          return (
            <div key={task.task_id} className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
              {/* Task card takes 2/3 width */}
              <div className="lg:col-span-2">
                <TaskCard task={task} showActions={false} />
              </div>

              {/* Volunteer panel takes 1/3 width */}
              <div className="card h-full" id={`volunteer-for-${task.task_id}`}>
                {volunteer ? (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-container shrink-0">
                        <User className="w-5 h-5 text-on-primary" />
                      </div>
                      <div>
                        <p className="text-h3 text-on-surface leading-tight">{volunteer.name}</p>
                        <p className="text-body-sm text-on-surface-variant">Assigned Volunteer</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-body-sm text-on-surface-variant">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {volunteer.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 shrink-0" />
                        {volunteer.skills.join(', ')}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-3 pt-3 border-t border-outline-variant">
                      <div className="text-center flex-1">
                        <p className="text-h3 text-on-surface tabular-nums">{volunteer.active_tasks}</p>
                        <p className="text-body-sm text-on-surface-variant">Active</p>
                      </div>
                      <div className="text-center flex-1">
                        <p className="text-h3 text-on-surface tabular-nums">{volunteer.completed_tasks}</p>
                        <p className="text-body-sm text-on-surface-variant">Done</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-6 text-center gap-2">
                    <User className="w-8 h-8 text-on-surface-variant opacity-40" />
                    <p className="text-body-sm text-on-surface-variant">No volunteer assigned</p>
                    <span className="badge-warning">Awaiting assignment</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default Projects;
