/**
 * MyWork — Volunteer's accepted tasks and completed work.
 * Accepted tasks show a "Mark Complete (Photo Proof)" button.
 * Completed tasks show the submitted proof photo visible to NGO too.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle, Camera, CheckCircle, CheckCircle2, Clock,
  ClipboardList, Loader2, MapPin, Target, Users, XCircle,
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../contexts/AuthContext';
import {
  getVolunteerAssignments,
  submitWorkProof,
  getWorkProofUrl,
} from '../../services/projectService';

// ── Urgency badge ─────────────────────────────────────────────────────────────
const urgencyClass = {
  critical: 'badge-critical',
  high: 'badge-warning',
  medium: 'badge-success',
  low: 'badge-neutral',
};

// ── Proof Photo Modal ─────────────────────────────────────────────────────────
const ProofModal = ({ assignment, onClose, onSubmit }) => {
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!file) return;
    setSubmitting(true);
    await onSubmit(assignment.id, file, note);
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-surface rounded-2xl shadow-level-3 max-w-md w-full p-6 space-y-4">
        <h3 className="text-h3 text-on-surface">Upload Completion Proof</h3>
        <p className="text-body-sm text-on-surface-variant">
          Upload a photo to confirm you have completed: <strong>{assignment.task?.title}</strong>
        </p>

        {/* File drop zone */}
        <label className="block rounded border-2 border-dashed border-outline-variant bg-surface-container-low p-6 text-center cursor-pointer hover:bg-surface-container transition-colors">
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
          {preview ? (
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded object-cover" />
          ) : (
            <>
              <Camera className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-body-sm text-on-surface-variant">Tap to take a photo or choose from gallery</p>
            </>
          )}
        </label>

        {/* Note */}
        <textarea
          className="input-field min-h-[80px]"
          placeholder="Add a note (optional)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-secondary flex-1" disabled={submitting}>Cancel</button>
          <button onClick={handleSubmit} className="btn-primary flex-1" disabled={!file || submitting}>
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Submit Proof</>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Task Card ─────────────────────────────────────────────────────────────────
const WorkCard = ({ assignment, onMarkComplete }) => {
  const { task } = assignment;
  const isCompleted = assignment.status === 'completed';

  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={urgencyClass[task?.urgency] || 'badge-neutral'}>
          {(task?.urgency || 'medium').toUpperCase()}
        </span>
        <span className={isCompleted ? 'badge-neutral' : 'badge-success'}>
          <span className={`w-1.5 h-1.5 rounded-full inline-block ${isCompleted ? 'bg-secondary' : 'bg-primary'}`} />
          {isCompleted ? 'Completed' : 'In Progress'}
        </span>
      </div>

      <h3 className="text-h3 text-on-surface">{task?.title}</h3>
      <p className="text-body-base text-on-surface-variant">{task?.description}</p>

      <div className="flex flex-wrap gap-4 text-body-sm text-on-surface-variant">
        {task?.location && (
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{task.location}</span>
        )}
        {task?.ngo_name && (
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{task.ngo_name}</span>
        )}
        {assignment.created_at && (
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Assigned: {new Date(assignment.created_at).toLocaleDateString()}
          </span>
        )}
        {task?.deadline && (
          <span className="flex items-center gap-1 font-semibold text-error">
            Deadline: {new Date(task.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      {task?.why && (
        <div className="flex items-start gap-2 p-3 bg-surface-container rounded">
          <AlertTriangle className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
          <div>
            <p className="text-label-caps uppercase text-on-surface-variant mb-0.5">Why this task?</p>
            <p className="text-body-sm text-on-surface">{task.why}</p>
          </div>
        </div>
      )}

      {!isCompleted && (
        <button
          onClick={() => onMarkComplete(assignment)}
          className="btn-primary w-full mt-2"
        >
          <Camera className="w-4 h-4" /> Mark Complete (Photo Proof)
        </button>
      )}

      {isCompleted && (
        <div className="flex items-center gap-2 text-success font-medium text-body-sm mt-2">
          <CheckCircle className="w-4 h-4" /> Work submitted — NGO can view your proof.
        </div>
      )}
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const MyWork = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('active');
  const [proofTarget, setProofTarget] = useState(null); // assignment currently being proved

  useEffect(() => {
    if (!user) return;
    loadWork();
  }, [user]);

  const loadWork = async () => {
    try {
      const data = await getVolunteerAssignments(user.id);
      // Only show accepted and completed tasks here
      setAssignments(data.filter((a) => a.status === 'accepted' || a.status === 'completed'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProof = async (assignmentId, file, note) => {
    await submitWorkProof(assignmentId, user.id, file, note);
    // Refresh assignments to show updated status
    await loadWork();
  };

  const active = assignments.filter((a) => a.status === 'accepted');
  const completed = assignments.filter((a) => a.status === 'completed');

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-h1 text-on-surface mb-2">My Work</h1>
        <p className="text-body-base text-on-surface-variant">Track your active missions and completed tasks.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active Tasks" value={active.length} icon={Clock} />
        <StatCard label="Completed" value={completed.length} icon={CheckCircle} trend="+1 this week" trendUp={true} />
        <StatCard label="Total Assigned" value={assignments.length} icon={Target} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container rounded-lg p-1">
        <button
          onClick={() => setTab('active')}
          className={`px-4 py-2 rounded-md text-body-base font-medium transition-colors ${tab === 'active' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'}`}
        >
          Active Tasks ({active.length})
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`px-4 py-2 rounded-md text-body-base font-medium transition-colors ${tab === 'completed' ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant'}`}
        >
          Completed ({completed.length})
        </button>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex items-center justify-center py-12 gap-2 text-on-surface-variant">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading your work...
        </div>
      )}

      <div className="space-y-4">
        {!loading && tab === 'active' && active.length === 0 && (
          <div className="card text-center py-12">
            <ClipboardList className="w-12 h-12 text-on-surface-variant mx-auto mb-3" />
            <h3 className="text-h3 text-on-surface">No Active Tasks</h3>
            <p className="text-body-sm text-on-surface-variant mt-1">Accept tasks from the Dashboard to see them here.</p>
          </div>
        )}

        {tab === 'active' && active.map((assignment) => (
          <WorkCard
            key={assignment.id}
            assignment={assignment}
            onMarkComplete={(a) => setProofTarget(a)}
          />
        ))}

        {tab === 'completed' && completed.map((assignment) => (
          <WorkCard
            key={assignment.id}
            assignment={assignment}
            onMarkComplete={() => {}}
          />
        ))}
      </div>

      {/* Proof Upload Modal */}
      {proofTarget && (
        <ProofModal
          assignment={proofTarget}
          onClose={() => setProofTarget(null)}
          onSubmit={handleSubmitProof}
        />
      )}
    </div>
  );
};

export default MyWork;
