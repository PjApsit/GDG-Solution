/**
 * Projects — Lists all projects owned by the logged-in NGO user.
 * Loads live data from Supabase via projectService.
 */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, FolderKanban, Loader2, MapPin, Plus, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserProjects } from '../../services/projectService';

const statusColors = {
  active: 'badge-success',
  planning: 'badge-warning',
  completed: 'badge-neutral',
};

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getUserProjects(user.id);
      setProjects(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-on-surface mb-2">Projects</h1>
          <p className="text-body-base text-on-surface-variant">Organize events and tasks into coordinated projects.</p>
        </div>
        <Link to="/ngo/projects/new-data" className="btn-primary">
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </header>

      {loading && (
        <div className="flex items-center justify-center py-16 text-on-surface-variant gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading projects...
        </div>
      )}

      {error && (
        <div className="card border-error/30 border text-error text-body-sm p-4">{error}</div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="card text-center py-16">
          <FolderKanban className="w-10 h-10 text-on-surface-variant mx-auto mb-3" />
          <p className="text-h3 text-on-surface mb-1">No projects yet</p>
          <p className="text-body-sm text-on-surface-variant mb-4">Create your first intelligence project to get started.</p>
          <Link to="/ngo/projects/new-data" className="btn-primary inline-flex">
            <Plus className="w-4 h-4" />
            Initialize Project
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Link
            to={`/ngo/projects/mission-control/${project.id}`}
            key={project.id}
            className="card hover:shadow-level-2 transition-shadow cursor-pointer group block"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FolderKanban className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-h3 text-on-surface">{project.title}</h3>
                  <p className="text-body-sm text-on-surface-variant flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {project.location || 'Location not set'}
                  </p>
                </div>
              </div>
              <span className={statusColors[project.status] || 'badge-neutral'}>{project.status}</span>
            </div>

            <div className="flex items-center gap-4 text-body-sm text-on-surface-variant mt-3">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {project.operative_capacity || 0} capacity
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {project.status}
              </span>
              <span className="flex items-center gap-1 ml-auto text-xs text-on-surface-variant">
                {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Projects;
