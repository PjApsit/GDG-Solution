import React from 'react';
import { CheckCircle, Clock, AlertCircle, User, MapPin, AlertTriangle } from 'lucide-react';

/**
 * TaskCard — Individual task display
 * WHY: Every task must be actionable and show its reasoning.
 * Status badges use semantic colors with dot indicators per design system.
 */

const statusConfig = {
  open: { label: 'Open', icon: AlertCircle, className: 'badge-warning', dot: 'bg-tertiary' },
  in_progress: { label: 'In Progress', icon: Clock, className: 'badge-success', dot: 'bg-primary' },
  completed: { label: 'Completed', icon: CheckCircle, className: 'badge-neutral', dot: 'bg-secondary' },
};

const priorityConfig = {
  critical: { label: 'Critical', className: 'badge-critical' },
  high: { label: 'High', className: 'badge-warning' },
  medium: { label: 'Medium', className: 'badge-success' },
  low: { label: 'Low', className: 'badge-neutral' },
};

const TaskCard = ({ task, onAccept, onDecline, showActions = false }) => {
  const status = statusConfig[task.status] || statusConfig.open;
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const StatusIcon = status.icon;

  return (
    <div className="card hover:bg-surface-container-low transition-colors" id={`task-${task.task_id}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-1">
            <span className={priority.className}>{priority.label}</span>
            <span className={status.className}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-h3 text-on-surface mb-1">{task.title}</h3>

          {/* Description */}
          <p className="text-body-base text-on-surface-variant mb-3">{task.description}</p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-body-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {task.location}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {task.ngo_name}
            </span>
            <span>{task.created_at}</span>
          </div>

          {/* WHY explanation — mandatory */}
          <div className="flex items-start gap-2 mt-3 p-3 bg-surface-container rounded">
            <AlertTriangle className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
            <div>
              <p className="text-label-caps uppercase text-on-surface-variant mb-0.5">
                Why this task?
              </p>
              <p className="text-body-sm text-on-surface">{task.why}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && task.status === 'open' && (
          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={() => onAccept && onAccept(task.task_id)}
              className="btn-primary text-body-sm"
              id={`accept-task-${task.task_id}`}
            >
              Accept
            </button>
            <button
              onClick={() => onDecline && onDecline(task.task_id)}
              className="btn-secondary text-body-sm"
              id={`decline-task-${task.task_id}`}
            >
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
