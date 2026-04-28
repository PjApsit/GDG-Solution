/**
 * AddVolunteerModal.jsx
 * NGO views followers and adds one to the project.
 * Shows full volunteer profile (skills, location, education, age, gender, status).
 */
import React, { useEffect, useState } from 'react';
import {
  BookOpen, GraduationCap, Loader2, MapPin, UserCheck, X,
} from 'lucide-react';
import {
  getNGOFollowers,
  addVolunteerToProject,
} from '../services/projectService';

const statusColor = {
  Available: 'badge-success',
  Active: 'badge-warning',
  Busy: 'badge-critical',
};

const AddVolunteerModal = ({ projectId, ngoId, onClose, onAdded }) => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(null);
  const [form, setForm] = useState({ role: '', area: '' });
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState('list'); // 'list' | 'detail'

  useEffect(() => { loadFollowers(); }, []);

  const loadFollowers = async () => {
    try {
      const data = await getNGOFollowers(ngoId);
      setFollowers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!selected || !form.role || !form.area) return;
    setAdding(selected.id);
    try {
      await addVolunteerToProject(projectId, selected.id, {
        role: form.role,
        area: form.area,
        contactStatus: 'Offline',
        taskStatus: 'STANDBY',
      });
      onAdded?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-surface rounded-2xl shadow-level-3 max-w-lg w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-outline-variant">
          <h3 className="text-h3 text-on-surface">Add Volunteer to Project</h3>
          <button onClick={onClose} className="btn-ghost p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          {loading && (
            <div className="flex items-center justify-center py-10 gap-2 text-on-surface-variant">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading followers...
            </div>
          )}

          {!loading && followers.length === 0 && (
            <div className="text-center py-10">
              <p className="text-h3 text-on-surface mb-1">No Followers Yet</p>
              <p className="text-body-sm text-on-surface-variant">
                Volunteers will appear here after they follow your NGO.
              </p>
            </div>
          )}

          {/* Step 1: Volunteer list */}
          {step === 'list' && !loading && followers.map((vol) => {
            const initials = (vol.full_name || 'V').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div
                key={vol.id}
                onClick={() => { setSelected(vol); setStep('detail'); }}
                className="flex items-center gap-3 p-3 rounded-lg border border-outline-variant bg-surface-container-lowest mb-2 cursor-pointer hover:bg-surface-container transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-body-base font-semibold text-on-surface">{vol.full_name}</p>
                  <div className="flex gap-3 text-body-sm text-on-surface-variant mt-0.5 flex-wrap">
                    {vol.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{vol.location}</span>}
                    {vol.skills?.length > 0 && <span>{vol.skills.slice(0, 2).join(', ')}</span>}
                  </div>
                </div>
                <span className={statusColor[vol.availability_status] || 'badge-neutral'}>
                  {vol.availability_status || 'Available'}
                </span>
              </div>
            );
          })}

          {/* Step 2: Volunteer detail + assignment form */}
          {step === 'detail' && selected && (
            <div className="space-y-4">
              <button onClick={() => setStep('list')} className="btn-ghost text-body-sm mb-2">← Back to list</button>

              {/* Profile card */}
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {(selected.full_name || 'V').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-h3 text-on-surface">{selected.full_name}</p>
                    <span className={statusColor[selected.availability_status] || 'badge-neutral'}>
                      {selected.availability_status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-body-sm">
                  {selected.location && (
                    <div className="flex items-center gap-1.5 text-on-surface-variant">
                      <MapPin className="w-3.5 h-3.5" /> {selected.location}
                    </div>
                  )}
                  {selected.age && (
                    <div className="flex items-center gap-1.5 text-on-surface-variant">
                      <UserCheck className="w-3.5 h-3.5" /> Age: {selected.age} · {selected.gender}
                    </div>
                  )}
                  {selected.education && (
                    <div className="flex items-center gap-1.5 text-on-surface-variant col-span-2">
                      <GraduationCap className="w-3.5 h-3.5" /> {selected.education}
                    </div>
                  )}
                  {selected.skills?.length > 0 && (
                    <div className="col-span-2 flex flex-wrap gap-1.5">
                      {selected.skills.map((s) => (
                        <span key={s} className="badge-neutral text-xs">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Assignment details */}
              <div className="space-y-3">
                <div>
                  <label className="text-label-caps uppercase text-on-surface-variant block mb-1">Role in Project *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Lead Paramedic"
                    value={form.role}
                    onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-label-caps uppercase text-on-surface-variant block mb-1">Deployment Area *</label>
                  <input
                    className="input-field"
                    placeholder="e.g. Idukki - Sector 4"
                    value={form.area}
                    onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'detail' && selected && (
          <div className="p-5 border-t border-outline-variant flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button
              onClick={handleAdd}
              className="btn-primary flex-1"
              disabled={!form.role || !form.area || !!adding}
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <><UserCheck className="w-4 h-4" /> Add to Project</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddVolunteerModal;
