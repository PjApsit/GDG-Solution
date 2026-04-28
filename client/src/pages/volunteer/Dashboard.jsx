/**
 * Volunteer Dashboard — Shows assigned tasks with Accept/Decline + NGO Directory.
 * After the volunteer responds, buttons lock and show a status label.
 */
import React, { useEffect, useState } from 'react';
import {
  AlertTriangle, CheckCircle2, Clock, Loader2, MapPin,
  Target, TrendingUp, Users, XCircle,
} from 'lucide-react';
import StatCard from '../../components/StatCard';
import NGODirectory from '../../components/NGODirectory';
import { useAuth } from '../../contexts/AuthContext';
import {
  getVolunteerAssignments,
  respondToAssignment,
} from '../../services/projectService';

// ── Urgency badge helper ──────────────────────────────────────────────────────
const urgencyClass = {
  critical: 'badge-critical',
  high: 'badge-warning',
  medium: 'badge-success',
  low: 'badge-neutral',
};

// ── Single task card ──────────────────────────────────────────────────────────
const AssignmentCard = ({ assignment, onRespond }) => {
  const { task } = assignment;
  const [loading, setLoading] = useState(false);

  const handleRespond = async (response) => {
    setLoading(true);
    await onRespond(assignment.id, response);
    setLoading(false);
  };

  const isLocked = assignment.status !== 'pending';

  return (
    <div className="card hover:bg-surface-container-low transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={urgencyClass[task?.urgency] || 'badge-neutral'}>
              {(task?.urgency || 'medium').toUpperCase()}
            </span>
            <span className="badge-warning">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary inline-block" />
              OPEN
            </span>
          </div>

          <h3 className="text-h3 text-on-surface mb-1">{task?.title || '—'}</h3>
          <p className="text-body-base text-on-surface-variant mb-3">{task?.description || ''}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-body-sm text-on-surface-variant">
            {task?.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {task.location}
              </span>
            )}
            {task?.ngo_name && (
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {task.ngo_name}
              </span>
            )}
            {assignment.created_at && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(assignment.created_at).toLocaleDateString()}
              </span>
            )}
            {task?.deadline && (
              <span className="flex items-center gap-1 text-error font-medium">
                Deadline: {new Date(task.deadline).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Why */}
          {task?.why && (
            <div className="flex items-start gap-2 mt-3 p-3 bg-surface-container rounded">
              <AlertTriangle className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
              <div>
                <p className="text-label-caps uppercase text-on-surface-variant mb-0.5">Why this task?</p>
                <p className="text-body-sm text-on-surface">{task.why}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions or locked status */}
        <div className="flex flex-col gap-2 shrink-0 items-center">
          {isLocked ? (
            <div className={`flex items-center gap-1.5 px-3 py-2 rounded font-semibold text-body-sm ${
              assignment.status === 'accepted'
                ? 'bg-success/10 text-success border border-success/30'
                : assignment.status === 'completed'
                ? 'bg-primary/10 text-primary border border-primary/30'
                : 'bg-error/10 text-error border border-error/30'
            }`}>
              {assignment.status === 'accepted' && <CheckCircle2 className="w-4 h-4" />}
              {assignment.status === 'declined' && <XCircle className="w-4 h-4" />}
              {assignment.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
            </div>
          ) : (
            <>
              <button
                disabled={loading}
                onClick={() => handleRespond('accepted')}
                className="btn-primary text-body-sm min-w-[90px]"
                id={`accept-${assignment.id}`}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Accept'}
              </button>
              <button
                disabled={loading}
                onClick={() => handleRespond('declined')}
                className="btn-secondary text-body-sm min-w-[90px]"
                id={`decline-${assignment.id}`}
              >
                Decline
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadAssignments();
  }, [user]);

  const loadAssignments = async () => {
    try {
      const data = await getVolunteerAssignments(user.id);
      setAssignments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (assignmentId, response) => {
    await respondToAssignment(assignmentId, response);
    // Update local state immediately so UI locks without re-fetching
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? { ...a, status: response, responded_at: new Date().toISOString() }
          : a
      )
    );
  };

  const pendingCount = assignments.filter((a) => a.status === 'pending').length;
  const acceptedCount = assignments.filter((a) => a.status === 'accepted').length;
  const completedCount = assignments.filter((a) => a.status === 'completed').length;

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-h1 text-on-surface mb-2">Volunteer Portal</h1>
        <p className="text-body-base text-on-surface-variant">
          Discover opportunities matching your skills and availability.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Tasks Completed" value={completedCount} icon={Target} />
        <StatCard
          label="Tasks Accepted"
          value={acceptedCount}
          icon={TrendingUp}
          trend={`${pendingCount} pending`}
          trendUp={true}
        />
        <StatCard label="Pending Response" value={pendingCount} icon={Users} />
      </div>

      <div>
        <h2 className="text-h2 text-on-surface mb-2">Assigned Tasks</h2>
        <p className="text-body-sm text-on-surface-variant mb-6">
          Tasks assigned to you by NGOs. Accept or Decline below.
        </p>

        {loading && (
          <div className="flex items-center justify-center py-12 gap-2 text-on-surface-variant">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading assignments...
          </div>
        )}

        {!loading && assignments.length === 0 && (
          <div className="card text-center py-12">
            <Target className="w-10 h-10 text-on-surface-variant mx-auto mb-3" />
            <h3 className="text-h3 text-on-surface mb-1">No Assigned Tasks</h3>
            <p className="text-body-sm text-on-surface-variant">
              An NGO hasn't assigned you any tasks yet. Check back soon!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onRespond={handleRespond}
            />
          ))}
        </div>
      </div>

      {/* NGO Directory with Follow/Unfollow */}
      <NGODirectory />
    </div>
  );
};

export default VolunteerDashboard;
