import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Globe,
  MapPin,
  Save,
  ShieldCheck,
  Upload,
  Users,
} from 'lucide-react';

const initialForm = {
  projectName: '',
  missionDescription: '',
  geospatialAnchor: '',
  operativeCapacity: '',
  intelFiles: [],
};

const CreateProjectData = () => {
  const [form, setForm] = useState(initialForm);
  const [saved, setSaved] = useState(false);

  const completion = useMemo(() => {
    const requiredKeys = ['projectName', 'missionDescription', 'geospatialAnchor', 'operativeCapacity'];
    const filled = requiredKeys.filter((key) => String(form[key] || '').trim().length > 0).length;
    return Math.round((filled / requiredKeys.length) * 100);
  }, [form]);

  const onChange = (key, value) => {
    setSaved(false);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSaveDraft = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  const onUploadFiles = (event) => {
    const incoming = Array.from(event.target.files || []);
    if (!incoming.length) return;
    setSaved(false);
    setForm((prev) => ({ ...prev, intelFiles: [...prev.intelFiles, ...incoming].slice(0, 8) }));
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

      <form onSubmit={onSaveDraft} className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <section className="xl:col-span-8 space-y-4">
          <div className="card">
            <label className="text-label-caps uppercase text-on-surface-variant block mb-1">Project Title</label>
            <input
              className="input-field"
              value={form.projectName}
              onChange={(e) => onChange('projectName', e.target.value)}
              placeholder="e.g. Operation Northern Watch"
              required
            />

            <label className="text-label-caps uppercase text-on-surface-variant block mb-1 mt-4">Mission Description</label>
            <textarea
              className="input-field min-h-[120px]"
              value={form.missionDescription}
              onChange={(e) => onChange('missionDescription', e.target.value)}
              placeholder="Outline the strategic objectives and field parameters..."
              required
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
                  />
                </div>
              </div>
              <div>
                <label className="text-label-caps uppercase text-on-surface-variant block mb-1">Operative Capacity</label>
                <div className="relative">
                  <Users className="h-4 w-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    className="input-field pl-9"
                    value={form.operativeCapacity}
                    onChange={(e) => onChange('operativeCapacity', e.target.value)}
                    placeholder="Personnel count"
                    required
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
              />
              <Upload className="h-7 w-7 text-primary mx-auto mb-2" />
              <p className="text-h3 text-on-surface">Drag & Drop Intel Packages</p>
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
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-tertiary" style={{ width: `${completion}%` }} />
            </div>
            {saved && (
              <div className="mt-3 rounded border border-primary/25 bg-primary/10 p-2 text-body-sm text-primary flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Draft saved locally.
              </div>
            )}
          </div>
        </aside>

        <div className="xl:col-span-12 flex items-center justify-between pt-1">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setForm(initialForm);
              setSaved(false);
            }}
          >
            Cancel Draft
          </button>
          <button type="submit" className="btn-primary min-w-[180px]">
            <Save className="h-4 w-4" />
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectData;