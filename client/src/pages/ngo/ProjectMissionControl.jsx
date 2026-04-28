/**
 * ProjectMissionControl.jsx
 * Live Mission Control — fully wired to Supabase.
 * "Add Volunteer" → AddVolunteerModal (shows followers, full profile)
 * "Assign Task"   → CreateTaskModal (create task + optional assignment)
 * Task list shows assignment statuses: pending / accepted / declined / completed
 */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowUpRight, Bell, CheckCircle2, Clock, Dot, Download,
  Edit3, FileText, Loader2, MapPin, MoreHorizontal, Plus,
  Shield, UserPlus, XCircle, Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getProjectById,
  getAssetSignedUrl,
  getProjectTasksWithAssignments,
} from '../../services/projectService';
import AddVolunteerModal from '../../components/AddVolunteerModal';
import CreateTaskModal from '../../components/CreateTaskModal';
import { AllAnalysis } from '../../utils/AllAnalysis';

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatFileSize = (bytes) => {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};
const assetColor = (type) => {
  if (type === 'pdf') return 'text-error';
  if (type === 'csv') return 'text-success';
  return 'text-primary';
};
const volunteerStatusClass = (status) => {
  if (status === 'DISPATCHING') return 'badge-success';
  if (status === 'CRITICAL ALERT') return 'badge-critical';
  return 'badge-neutral';
};
const assignmentBadge = (status) => {
  if (status === 'accepted') return { cls: 'badge-success', label: 'Accepted', icon: CheckCircle2 };
  if (status === 'declined') return { cls: 'badge-critical', label: 'Declined', icon: XCircle };
  if (status === 'completed') return { cls: 'badge-neutral', label: 'Completed', icon: CheckCircle2 };
  return { cls: 'badge-warning', label: 'Pending', icon: Clock };
};

// ── Component ─────────────────────────────────────────────────────────────────
const ProjectMissionControl = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddVol, setShowAddVol] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await AllAnalysis(projectId);
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => { if (projectId) loadAll(); }, [projectId]);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [proj, taskData] = await Promise.all([
        getProjectById(projectId),
        getProjectTasksWithAssignments(projectId),
      ]);
      setProject(proj);
      setTasks(taskData);
    } catch (err) {
      console.error(err);
      setError('Failed to load project.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssetDownload = async (asset) => {
    try {
      const url = await getAssetSignedUrl(asset.file_path);
      window.open(url, '_blank');
    } catch { alert('Could not generate download link.'); }
  };

  // ── Loading / Error ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 gap-3 text-on-surface-variant">
        <Loader2 className="w-6 h-6 animate-spin" /> Loading mission control...
      </div>
    );
  }
  if (error || !project) {
    return (
      <div className="card border-error/30 border text-error p-6 text-center">
        <p className="text-h3 mb-2">Access Denied</p>
        <p className="text-body-sm">{error || 'Project not found.'}</p>
        <Link to="/ngo/projects" className="btn-secondary mt-4 inline-flex">Back to Projects</Link>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-[1200px]">

      {/* ── Header ── */}
      <header className="border-b border-outline-variant pb-5">
        <p className="text-body-sm text-on-surface-variant mb-2">Mission Control</p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-label-caps uppercase text-on-surface-variant">Projects › Active Operations</p>
            <h1 className="text-h1 text-on-surface mt-1">
              {project.title}
              <span className={`ml-2 align-middle ${project.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                {project.status}
              </span>
            </h1>
            <p className="text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {project.location || 'Location not set'} — Capacity: {project.operative_capacity}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary"><Download className="h-4 w-4" />Export Report</button>
            <button className="btn-primary"><Edit3 className="h-4 w-4" />Edit Project</button>
          </div>
        </div>
      </header>

      {/* ── Assets + Analytics ── */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="card xl:col-span-7">
          <div className="flex items-center justify-between mb-3">
            <p className="text-label-caps uppercase text-on-surface-variant">Project Data Assets</p>
            <div className="flex gap-2">
              <button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
                className="btn-primary py-1.5 px-3 text-sm flex items-center gap-2"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Analyze
              </button>
              <button className="btn-ghost text-primary">View Repository</button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {project.assets.length === 0 && (
              <p className="text-body-sm text-on-surface-variant col-span-3">No assets uploaded yet.</p>
            )}
            {project.assets.map((asset) => (
              <button key={asset.id} onClick={() => handleAssetDownload(asset)}
                className="rounded border border-outline-variant bg-surface-container-lowest p-3 text-left hover:bg-surface-container transition-colors">
                <FileText className={`h-4 w-4 ${assetColor(asset.file_type)}`} />
                <p className="text-body-base text-on-surface mt-2 truncate">{asset.file_name}</p>
                <p className="text-body-sm text-on-surface-variant mt-1">
                  {formatFileSize(asset.file_size_bytes)} · {timeAgo(asset.created_at)}
                </p>
              </button>
            ))}
            <button className="rounded border border-dashed border-outline-variant bg-surface-container-low p-3 text-body-sm text-on-surface-variant hover:bg-surface-container transition-colors">
              Upload New Asset
            </button>
          </div>
        </div>

        <div className="card xl:col-span-5">
          <p className="text-label-caps uppercase text-on-surface-variant mb-2">Deployment Analytics</p>
          <div className="rounded border border-outline-variant bg-surface-container-low p-4">
            <p className="text-body-sm text-on-surface-variant uppercase">Weekly Resource Intensity</p>
            <p className="text-4xl font-bold text-primary mt-2">+24.8%</p>
            <p className="text-body-sm text-success mt-1">Critical</p>
            <div className="mt-4 h-20 rounded bg-[linear-gradient(180deg,rgba(37,99,235,0.10)_0%,rgba(37,99,235,0.02)_100%)] border border-outline-variant relative overflow-hidden">
              <svg viewBox="0 0 220 80" className="absolute inset-0 h-full w-full">
                <polyline fill="none" stroke="rgb(37 99 235)" strokeWidth="2" points="0,62 30,55 60,60 90,40 120,48 150,30 180,35 220,26" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mandate ── */}
      <section className="card bg-primary/5 border-primary/20">
        <h3 className="text-h3 text-on-surface flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" /> Operational Mandate: {project.title}
        </h3>
        <p className="text-body-base text-on-surface mt-3 leading-relaxed">
          {project.description || 'No mission description provided.'}
        </p>
      </section>

      {/* ── Volunteer Management ── */}
      <section className="card p-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-outline-variant">
          <div>
            <h3 className="text-h3 text-on-surface">Volunteer Management</h3>
            <p className="text-body-sm text-on-surface-variant">{project.volunteers.length} personnel deployed</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary" onClick={() => setShowCreateTask(true)}>
              <FileText className="h-4 w-4" /> Assign Task
            </button>
            <button className="btn-primary" onClick={() => setShowAddVol(true)}>
              <UserPlus className="h-4 w-4" /> Add Volunteer
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr>
                <th className="table-header">Volunteer</th>
                <th className="table-header">Role</th>
                <th className="table-header">Deployment Area</th>
                <th className="table-header">Contact Status</th>
                <th className="table-header">Task Status</th>
                <th className="table-header text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {project.volunteers.length === 0 && (
                <tr>
                  <td colSpan={6} className="table-cell text-center text-on-surface-variant py-8">
                    No volunteers added yet. Click "Add Volunteer" to assign from your followers.
                  </td>
                </tr>
              )}
              {project.volunteers.map((pv) => {
                const name = pv.volunteer?.full_name || 'Unknown';
                const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <tr key={pv.id}>
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">{initials}</div>
                        <div>
                          <p className="text-body-base text-on-surface">{name}</p>
                          <p className="text-body-sm text-on-surface-variant">{pv.volunteer?.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">{pv.role_in_project || '—'}</td>
                    <td className="table-cell">{pv.deployment_area || '—'}</td>
                    <td className="table-cell">
                      <span className="inline-flex items-center gap-1 text-body-sm">
                        <Dot className="h-4 w-4 text-on-surface-variant" />{pv.contact_status}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={volunteerStatusClass(pv.task_status)}>{pv.task_status}</span>
                    </td>
                    <td className="table-cell text-center">
                      <button className="btn-ghost p-1"><MoreHorizontal className="h-4 w-4" /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-4 border-t border-outline-variant">
          <p className="text-body-sm text-on-surface-variant">Showing {project.volunteers.length} volunteers</p>
          <button onClick={() => setShowAddVol(true)} className="btn-primary rounded-full h-11 w-11 p-0" aria-label="Add Volunteer">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* ── Tasks with Assignment Status ── */}
      <section className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-h3 text-on-surface">Project Tasks</h3>
          <button onClick={() => setShowCreateTask(true)} className="btn-primary">
            <Plus className="h-4 w-4" /> New Task
          </button>
        </div>

        {tasks.length === 0 && (
          <p className="text-body-sm text-on-surface-variant text-center py-6">
            No tasks yet. Create one with the button above.
          </p>
        )}

        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={
                      task.urgency === 'critical' ? 'badge-critical' :
                      task.urgency === 'high' ? 'badge-warning' :
                      task.urgency === 'medium' ? 'badge-success' : 'badge-neutral'
                    }>{(task.urgency || 'medium').toUpperCase()}</span>
                    {task.deadline && (
                      <span className="text-body-sm text-error font-medium">
                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-body-base font-semibold text-on-surface">{task.title}</p>
                  <p className="text-body-sm text-on-surface-variant mt-0.5">{task.description}</p>
                  {task.location && (
                    <p className="text-body-sm text-on-surface-variant flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" /> {task.location}
                    </p>
                  )}
                </div>

                {/* Assignment statuses */}
                <div className="space-y-1.5 shrink-0">
                  {(!task.assignments || task.assignments.length === 0) && (
                    <span className="badge-neutral text-body-sm">Unassigned</span>
                  )}
                  {(task.assignments || []).map((a) => {
                    const badge = assignmentBadge(a.status);
                    const Icon = badge.icon;
                    return (
                      <div key={a.id} className="flex items-center gap-2">
                        <span className="text-body-sm text-on-surface-variant">
                          {a.volunteer?.full_name || 'Volunteer'}:
                        </span>
                        <span className={`${badge.cls} flex items-center gap-1`}>
                          <Icon className="w-3 h-3" /> {badge.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
          <Bell className="h-4 w-4" /> Monitoring channel: Alpha Command Network
        </div>
        <Link to="/ngo/projects" className="btn-ghost text-primary">
          Return to Project Archive <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* ── Modals ── */}
      {showAddVol && (
        <AddVolunteerModal
          projectId={projectId}
          ngoId={user?.id}
          onClose={() => setShowAddVol(false)}
          onAdded={loadAll}
        />
      )}
      {showCreateTask && (
        <CreateTaskModal
          projectId={projectId}
          ngoId={user?.id}
          ngoName={project.title}
          onClose={() => setShowCreateTask(false)}
          onCreated={loadAll}
        />
      )}
    </div>
  );
};

export default ProjectMissionControl;