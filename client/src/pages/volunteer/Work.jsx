import React, { useState } from 'react';
import { mockTasks, mockVolunteers } from '../../data/mockData';
import TaskCard from '../../components/TaskCard';
import StatCard from '../../components/StatCard';
import { User, MapPin, Briefcase, CheckCircle, Clock, ClipboardList } from 'lucide-react';

/**
 * Volunteer "My Work" page
 * WHY: Central place where a volunteer sees their own details and all task assignments.
 * Shows profile, in-progress tasks, and open tasks they can pick up.
 */

// Simulate the currently logged-in volunteer
const CURRENT_VOLUNTEER_ID = 'vol-001';

const Work = () => {
  const volunteer = mockVolunteers.find(v => v.id === CURRENT_VOLUNTEER_ID);
  const [tasks, setTasks] = useState(mockTasks);

  const myTasks = tasks.filter(t => t.volunteer_id === CURRENT_VOLUNTEER_ID);
  const openTasks = tasks.filter(t => t.status === 'open' && t.volunteer_id === null);

  const handleAccept = (taskId) => {
    setTasks(prev =>
      prev.map(t =>
        t.task_id === taskId
          ? { ...t, volunteer_id: CURRENT_VOLUNTEER_ID, status: 'in_progress' }
          : t
      )
    );
  };

  const handleComplete = (taskId) => {
    setTasks(prev =>
      prev.map(t =>
        t.task_id === taskId ? { ...t, status: 'completed' } : t
      )
    );
  };

  if (!volunteer) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-body-base text-on-surface-variant">Volunteer profile not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="mb-2">
        <h1 className="text-h1 text-on-surface mb-2">My Work</h1>
        <p className="text-body-base text-on-surface-variant">
          Your profile, active assignments, and available opportunities.
        </p>
      </header>

      {/* ── Volunteer Profile Card ── */}
      <section className="card" id="volunteer-profile">
        <div className="flex items-start gap-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-container shrink-0">
            <User className="w-7 h-7 text-on-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-h2 text-on-surface mb-1">{volunteer.name}</h2>
            <div className="flex flex-wrap items-center gap-4 text-body-sm text-on-surface-variant mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {volunteer.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                {volunteer.skills.join(', ')}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {volunteer.skills.map(skill => (
                <span key={skill} className="badge-neutral">{skill}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-4 shrink-0">
            <div className="text-center">
              <p className="text-h2 text-on-surface tabular-nums">{volunteer.active_tasks}</p>
              <p className="text-body-sm text-on-surface-variant">Active</p>
            </div>
            <div className="text-center">
              <p className="text-h2 text-on-surface tabular-nums">{volunteer.completed_tasks}</p>
              <p className="text-body-sm text-on-surface-variant">Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="My Active Tasks" value={myTasks.filter(t => t.status === 'in_progress').length} icon={Clock} />
        <StatCard label="Completed Tasks" value={volunteer.completed_tasks} icon={CheckCircle} trend="+2 this week" trendUp={true} />
        <StatCard label="Open Opportunities" value={openTasks.length} icon={ClipboardList} />
      </div>

      {/* ── My Assigned Tasks ── */}
      <section id="my-tasks">
        <h2 className="text-h2 text-on-surface mb-2">My Assigned Tasks</h2>
        <p className="text-body-sm text-on-surface-variant mb-4">
          Tasks currently assigned to you. Mark them complete when done.
        </p>
        {myTasks.length === 0 ? (
          <div className="card text-center py-10 text-on-surface-variant text-body-base">
            No tasks assigned yet. Accept one from the list below.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {myTasks.map(task => (
              <div key={task.task_id} className="space-y-2">
                <TaskCard task={task} showActions={false} />
                {task.status === 'in_progress' && (
                  <button
                    className="btn-primary w-full text-body-sm"
                    onClick={() => handleComplete(task.task_id)}
                    id={`complete-task-${task.task_id}`}
                  >
                    Mark as Complete
                  </button>
                )}
                {task.status === 'completed' && (
                  <p className="text-body-sm text-primary text-center">✓ Task completed</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Open Tasks to Pick Up ── */}
      <section id="open-tasks">
        <h2 className="text-h2 text-on-surface mb-2">Available Tasks</h2>
        <p className="text-body-sm text-on-surface-variant mb-4">
          Unassigned tasks that match the current need. Accept one to get started.
        </p>
        {openTasks.length === 0 ? (
          <div className="card text-center py-10 text-on-surface-variant text-body-base">
            No open tasks available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {openTasks.map(task => (
              <TaskCard
                key={task.task_id}
                task={task}
                showActions={true}
                onAccept={handleAccept}
                onDecline={() => {}}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Work;
