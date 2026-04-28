import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Globe,
  Loader2,
  MapPin,
  ShieldCheck,
  Upload,
  Users,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createProject } from '../../services/projectService';

const initialForm = {
  projectName: '',
  missionDescription: '',
  geospatialAnchor: '',
  operativeCapacity: '',
  intelFiles: [],
};

const CreateProjectData = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const completion = useMemo(() => {
    const requiredKeys = ['projectName', 'missionDescription', 'geospatialAnchor', 'operativeCapacity'];
    const filled = requiredKeys.filter((key) => String(form[key] || '').trim().length > 0).length;
    return Math.round((filled / requiredKeys.length) * 100);
  }, [form]);

  const onChange = (key, value) => {
    setError(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onUploadFiles = (event) => {
    const incoming = Array.from(event.target.files || []);
    if (!incoming.length) return;
    setForm((prev) => ({ ...prev, intelFiles: [...prev.intelFiles, ...incoming].slice(0, 8) }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a project.');
      return;
    }
    if (completion < 100) {
      setError('Please fill in all required fields before creating the project.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const project = await createProject(form, user.id);
      // Redirect to the new project's Mission Control page
      navigate(`/ngo/projects/mission-control/${project.id}`);
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(err.message || 'Failed to create project. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1150px]">
      <header className="border-b border-outline-variant pb-4">
        <p className="text-label-caps uppercase text-on-surface-variant mb-2">Project Creation</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-h1 text-on-surface">Initialize New Project</h1>
            <p className="text-body-base text-on-surface-variant mt-1">
              Deploy a new intelligence node. All data is encrypted and subject to institutional oversight protocols.
            </p>
          </div>
          <Link to="/ngo/projects" className="btn-ghost shrink-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Archive
          </Link>
        </div>
      </header>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <section className="xl:col-span-8 space-y-4">
          <div className="card">
            <label className="text-label-caps uppercase text-on-surface-variant block mb-1">Project Title</label>
            <input
              className="input-field"
              value={form.projectName}
              onChange={(e) => onChange('projectName', e.target.value)}
              placeholder="e.g. Operation Northern Watch"
              required
              disabled={loading}
            />

            <label className="text-label-caps uppercase text-on-surface-variant block mb-1 mt-4">Mission Description</label>
            <textarea
              className="input-field min-h-[120px]"
              value={form.missionDescription}
              onChange={(e) => onChange('missionDescription', e.target.value)}
              placeholder="Outline the strategic objectives and field parameters..."
              required
              disabled={loading}
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 mt-4">
              <div>
                <label className="text-label-caps uppercase text-on-surface-variant block mb-1">Geospatial Anchor</label>
                <div className="relative">
                  <MapPin className="h-4 w-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    className="input-field pl-9"
                    value={form.geospatialAnchor}
                    onChange={(e) => onChange('geospatialAnchor', e.target.value)}
                    placeholder="Region or Coordinates"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label className="text-label-caps uppercase text-on-surface-variant block mb-1">Operative Capacity</label>
                <div className="relative">
                  <Users className="h-4 w-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    className="input-field pl-9"
                    value={form.operativeCapacity}
                    onChange={(e) => onChange('operativeCapacity', e.target.value)}
                    placeholder="Personnel count"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <p className="text-label-caps uppercase text-on-surface-variant mb-3">Intel Data Ingestion</p>
            <label className="block rounded border border-dashed border-outline-variant bg-surface-container-low p-6 text-center cursor-pointer hover:bg-surface-container transition-colors">
              <input
                type="file"
                multiple
                accept=".pdf,.csv,.xlsx"
                className="hidden"
                onChange={onUploadFiles}
                disabled={loading}
              />
              <Upload className="h-7 w-7 text-primary mx-auto mb-2" />
              <p className="text-h3 text-on-surface">Drag &amp; Drop Intel Packages</p>
              <p className="text-body-sm text-on-surface-variant mt-1">Supports high-fidelity PDFs, CSV datasets, and encrypted archives.</p>
              <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
                <span className="badge-critical"><FileText className="h-3 w-3" />PDF</span>
                <span className="badge-success"><FileSpreadsheet className="h-3 w-3" />CSV</span>
                <span className="badge-neutral"><Globe className="h-3 w-3" />XLSX</span>
              </div>
            </label>

            {!!form.intelFiles.length && (
              <div className="mt-3 rounded border border-outline-variant bg-surface-container-lowest p-3">
                <p className="text-body-sm text-on-surface-variant mb-1">Queued Files ({form.intelFiles.length})</p>
                <div className="text-body-sm text-on-surface space-y-1">
                  {form.intelFiles.map((file, idx) => (
                    <p key={`${file.name}-${idx}`} className="truncate">{file.name}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <aside className="xl:col-span-4 space-y-4">
          <div className="card p-0 overflow-hidden">
            <div className="h-44 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_36%),linear-gradient(140deg,#4b5563_0%,#1f2937_45%,#111827_100%)] relative">
              <div className="absolute inset-0 opacity-45" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
              <p className="absolute bottom-3 left-3 text-xs tracking-widest text-white uppercase">Geospatial Preview</p>
            </div>
          </div>

          <div className="card">
            <p className="text-label-caps uppercase text-primary mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Institutional Compliance
            </p>
            <ul className="space-y-2 text-body-sm text-on-surface-variant">
              <li>- Ensure all data aligns with the Humanitarian Information Unit policy framework.</li>
              <li>- Project baseline is immutable once high-level clearance is granted by operations.</li>
              <li>- Operative capacity limits can be adjusted later through the command console.</li>
            </ul>
          </div>

          <div className="card">
            <p className="text-label-caps uppercase text-on-surface-variant">Form Completion</p>
            <p className="text-2xl font-bold text-on-surface mt-1">{completion}%</p>
            <div className="mt-2 h-2 rounded-full bg-surface-container-high overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-tertiary transition-all duration-300" style={{ width: `${completion}%` }} />
            </div>
            {error && (
              <div className="mt-3 rounded border border-error/25 bg-error/10 p-2 text-body-sm text-error">
                {error}
              </div>
            )}
          </div>
        </aside>

        <div className="xl:col-span-12 flex items-center justify-between pt-1">
          <button
            type="button"
            className="btn-ghost"
            disabled={loading}
            onClick={() => { setForm(initialForm); setError(null); }}
          >
            Cancel Draft
          </button>
          <button type="submit" className="btn-primary min-w-[180px]" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Create Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectData;