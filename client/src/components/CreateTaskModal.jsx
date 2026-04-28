/**
 * CreateTaskModal.jsx
 * NGO creates a new task for a project.
 * Optionally assigns a volunteer from the followers list.
 * Once assigned, volunteer sees it in their dashboard to Accept/Decline.
 */
import React, { useEffect, useState } from 'react';
import {
  AlertTriangle, CheckCircle2, ChevronDown, Loader2,
  UserCheck, X,
} from 'lucide-react';
import { getNGOFollowers, createFullTask } from '../services/projectService';

const URGENCIES = ['critical', 'high', 'medium', 'low'];

const CreateTaskModal = ({ projectId, ngoId, ngoName, onClose, onCreated }) => {
  const [followers, setFollowers] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    urgency: 'medium',
    deadline: '',
    why: '',
    volunteerId: '', // optional
  });

  useEffect(() => { loadFollowers(); }, []);

  const loadFollowers = async () => {
    try {
      const data = await getNGOFollowers(ngoId);
      setFollowers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const isValid = form.title.trim() && form.description.trim() && form.location.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    try {
      await createFullTask(
        projectId,
        {
          title: form.title,
          description: form.description,
          ngo_name: ngoName,
          location: form.location,
          urgency: form.urgency,
          deadline: form.deadline || null,
          why: form.why,
        },
        form.volunteerId || null
      );
      onCreated?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-surface rounded-2xl shadow-level-3 max-w-lg w-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-outline-variant">
          <h3 className="text-h3 text-on-surface">Create New Task</h3>
          <button onClick={onClose} className="btn-ghost p-1"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="text-label-caps uppercase text-on-surface-variant block mb-1">Task Title *</label>
            <input
              className="input-field"
              placeholder="e.g. Emergency Medical Camp Setup"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-label-caps uppercase text-on-surface-variant block mb-1">Description *</label>
            <textarea
              className="input-field min-h-[90px]"
              placeholder="What needs to be done?"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              required
            />
          </div>

          {/* Location + Urgency (2-col) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-label-caps uppercase text-on-surface-variant block mb-1">Location *</label>
              <input
                className="input-field"
                placeholder="e.g. Dharavi, Mumbai"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-label-caps uppercase text-on-surface-variant block mb-1">Urgency</label>
              <div className="relative">
                <select
                  className="input-field appearance-none pr-8 capitalize"
                  value={form.urgency}
                  onChange={(e) => set('urgency', e.target.value)}
                >
                  {URGENCIES.map((u) => (
                    <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="text-label-caps uppercase text-on-surface-variant block mb-1">Deadline (optional)</label>
            <input
              type="date"
              className="input-field"
              value={form.deadline}
              onChange={(e) => set('deadline', e.target.value)}
            />
          </div>

          {/* Why */}
          <div>
            <label className="text-label-caps uppercase text-on-surface-variant block mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-tertiary" /> Why This Task?
            </label>
            <textarea
              className="input-field min-h-[70px]"
              placeholder="Explain the reason so the volunteer understands urgency..."
              value={form.why}
              onChange={(e) => set('why', e.target.value)}
            />
          </div>

          {/* Assign Volunteer (optional) */}
          <div>
            <label className="text-label-caps uppercase text-on-surface-variant block mb-1">
              Assign Volunteer (optional)
            </label>
            {loadingFollowers ? (
              <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading followers...
              </div>
            ) : followers.length === 0 ? (
              <p className="text-body-sm text-on-surface-variant italic">
                No volunteers follow you yet. They can follow your NGO from their dashboard.
              </p>
            ) : (
              <div className="relative">
                <select
                  className="input-field appearance-none pr-8"
                  value={form.volunteerId}
                  onChange={(e) => set('volunteerId', e.target.value)}
                >
                  <option value="">— Skip assignment —</option>
                  {followers.map((vol) => (
                    <option key={vol.id} value={vol.id}>
                      {vol.full_name} {vol.location ? `· ${vol.location}` : ''} [{vol.availability_status || 'Available'}]
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              </div>
            )}
            {form.volunteerId && (
              <p className="text-body-sm text-primary mt-1.5 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                Volunteer will see this task on their dashboard to Accept or Decline.
              </p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="p-5 border-t border-outline-variant flex gap-3">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary flex-1"
            disabled={!isValid || submitting}
          >
            {submitting
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <><CheckCircle2 className="w-4 h-4" /> Create Task</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
