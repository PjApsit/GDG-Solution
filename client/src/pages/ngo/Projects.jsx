/**
 * Projects — Group related events/tasks by theme
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Plus, Users, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';

const mockProjects = [
  { id: 'proj-1', name: 'Dharavi Health Initiative', location: 'Dharavi, Mumbai', events: ['evt-001'], tasks: ['tsk-001'], status: 'active', progress: 35 },
  { id: 'proj-2', name: 'Sundarbans Flood Relief 2026', location: 'Sundarbans, West Bengal', events: ['evt-002'], tasks: ['tsk-002'], status: 'active', progress: 60 },
  { id: 'proj-3', name: 'Thar Desert Water Program', location: 'Thar Desert, Rajasthan', events: ['evt-003'], tasks: ['tsk-003'], status: 'active', progress: 45 },
  { id: 'proj-4', name: 'Monsoon Readiness 2026', location: 'Wayanad, Kerala', events: ['evt-004'], tasks: ['tsk-004'], status: 'planning', progress: 15 },
];

const Projects = () => {
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', location: '' });

  const statusColors = {
    active: 'badge-success',
    planning: 'badge-warning',
    completed: 'badge-neutral',
  };

  return (
    <div className="space-y-6">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-on-surface mb-2">Projects</h1>
          <p className="text-body-base text-on-surface-variant">Organize events and tasks into coordinated projects.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/ngo/projects/new-data" className="btn-secondary">
            Create New Project Data
          </Link>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary"><Plus className="w-4 h-4" />New Project</button>
        </div>
      </header>

      {showForm && (
        <div className="card border-primary/20 border-2">
          <h3 className="text-h3 text-on-surface mb-4">Create New Project</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-label-caps uppercase text-on-surface-variant block mb-1">Project Name</label>
              <input value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} placeholder="e.g., Mumbai Health Drive" className="input-field" />
            </div>
            <div>
              <label className="text-label-caps uppercase text-on-surface-variant block mb-1">Location</label>
              <input value={newProject.location} onChange={(e) => setNewProject({ ...newProject, location: e.target.value })} placeholder="e.g., Mumbai, Maharashtra" className="input-field" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn-primary"><CheckCircle className="w-4 h-4" />Create</button>
            <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockProjects.map(project => (
          <Link to="/ngo/projects/mission-control" key={project.id} className="card hover:shadow-level-2 transition-shadow cursor-pointer group block">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FolderKanban className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-h3 text-on-surface">{project.name}</h3>
                  <p className="text-body-sm text-on-surface-variant flex items-center gap-1"><MapPin className="w-3 h-3" />{project.location}</p>
                </div>
              </div>
              <span className={statusColors[project.status]}>{project.status}</span>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-body-sm mb-1">
                <span className="text-on-surface-variant">Progress</span>
                <span className="text-primary font-medium">{project.progress}%</span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-blue-400 rounded-full transition-all" style={{ width: `${project.progress}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-4 text-body-sm text-on-surface-variant">
              <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{project.events.length} events</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />{project.tasks.length} tasks</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{Math.floor(Math.random() * 10) + 2} volunteers</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Projects;
