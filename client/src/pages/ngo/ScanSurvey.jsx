/**
 * ScanSurvey — AI-powered paper-to-digital scanner
 * WHY: Core feature. NGO workers photograph paper surveys, Gemini extracts data.
 */
import React, { useState, useRef } from 'react';
import { Camera, Upload, ScanLine, CheckCircle, XCircle, Edit3, Loader2, AlertTriangle, Sparkles, FileImage } from 'lucide-react';

const ScanSurvey = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null); setScanResult(null); setSaved(false);
    try {
      const { default: imageCompression } = await import('browser-image-compression');
      const compressed = await imageCompression(file, { maxSizeMB: 0.2, maxWidthOrHeight: 1200, useWebWorker: true });
      const reader = new FileReader();
      reader.onload = (ev) => { setImagePreview(ev.target.result); setBase64Image(ev.target.result); };
      reader.readAsDataURL(compressed);
    } catch { setError('Failed to process image.'); }
  };

  const handleScan = async () => {
    if (!base64Image) return;
    setIsScanning(true); setError(null);
    try {
      const res = await fetch('/api/scan/survey', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image: base64Image }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scan failed');
      setScanResult(data); setEditedData({ ...data });
    } catch (err) { setError(err.message); }
    finally { setIsScanning(false); }
  };

  const handleSave = () => { setSaved(true); };
  const handleReject = () => { setScanResult(null); setEditedData(null); setImagePreview(null); setBase64Image(null); setSaved(false); };
  const handleFieldChange = (field, value) => setEditedData(prev => ({ ...prev, [field]: value }));

  const confColor = (s) => s === 'high' ? 'text-green-600 bg-green-50 border-green-200' : s === 'medium' ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-red-600 bg-red-50 border-red-200';

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
            <ScanLine className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-h1 text-on-surface">AI Survey Scanner</h1>
            <p className="text-body-base text-on-surface-variant">Photograph paper surveys and let Gemini AI extract structured data.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Image Capture */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-h3 text-on-surface mb-4 flex items-center gap-2"><Camera className="w-5 h-5 text-primary" />Capture Survey</h2>
            {!imagePreview ? (
              <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-outline-variant rounded-xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform"><Upload className="w-8 h-8 text-primary" /></div>
                <p className="text-body-base font-medium text-on-surface">Click to upload or capture photo</p>
                <p className="text-body-sm text-on-surface-variant">Supports JPEG, PNG, WebP</p>
              </div>
            ) : (
              <div className="relative">
                <img src={imagePreview} alt="Captured survey" className="w-full rounded-xl border border-outline-variant" />
                <button onClick={() => { setImagePreview(null); setBase64Image(null); setScanResult(null); setSaved(false); }} className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-error/10"><XCircle className="w-5 h-5 text-error" /></button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageCapture} className="hidden" id="survey-image-input" />
            {imagePreview && !scanResult && (
              <button onClick={handleScan} disabled={isScanning} className="w-full mt-4 btn-primary py-3 disabled:opacity-50" id="scan-survey-btn">
                {isScanning ? (<><Loader2 className="w-5 h-5 animate-spin" />AI is reading your document...</>) : (<><Sparkles className="w-5 h-5" />Scan with Gemini AI</>)}
              </button>
            )}
          </div>
          {error && (<div className="bg-error/10 border border-error/20 rounded-xl p-4 flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-error shrink-0" /><p className="text-body-sm text-error">{error}</p></div>)}
        </div>

        {/* Right — Results */}
        <div className="space-y-4">
          {isScanning && (
            <div className="card flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-h3 text-on-surface">Gemini AI Processing</p>
              <p className="text-body-sm text-on-surface-variant">Extracting structured data...</p>
            </div>
          )}

          {scanResult && !saved && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-h3 text-on-surface flex items-center gap-2"><FileImage className="w-5 h-5 text-primary" />Extracted Data</h2>
                <span className={`px-3 py-1 rounded-full text-body-sm font-medium border ${confColor(scanResult.confidence_score)}`}>{scanResult.confidence_score} confidence</span>
              </div>
              <div className="space-y-3">
                <DataField label="Location" value={scanResult.location_text} editMode={editMode} edited={editedData?.location_text} onChange={(v) => handleFieldChange('location_text', v)} />
                <DataField label="Problem Type" value={scanResult.problem_type} editMode={editMode} edited={editedData?.problem_type} onChange={(v) => handleFieldChange('problem_type', v)} />
                <div className="grid grid-cols-2 gap-3">
                  <DataField label="Severity" value={`${scanResult.severity}/10`} editMode={editMode} edited={editedData?.severity} onChange={(v) => handleFieldChange('severity', parseInt(v))} type="number" />
                  <DataField label="Urgency" value={`${scanResult.urgency}/10`} editMode={editMode} edited={editedData?.urgency} onChange={(v) => handleFieldChange('urgency', parseInt(v))} type="number" />
                </div>
                <DataField label="Affected People" value={(scanResult.affected_count || 0).toLocaleString()} editMode={editMode} edited={editedData?.affected_count} onChange={(v) => handleFieldChange('affected_count', parseInt(v))} type="number" />
                <DataField label="Description" value={scanResult.description} editMode={editMode} edited={editedData?.description} onChange={(v) => handleFieldChange('description', v)} />
                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between"><span className="text-label-caps uppercase text-primary">AI Priority Score</span><span className="text-h1 font-bold text-primary">{scanResult.priority_score}</span></div>
                  <p className="text-body-sm text-on-surface-variant mt-1 italic">{scanResult.why}</p>
                </div>
                {scanResult.needs_human_review && (<div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg"><AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /><p className="text-body-sm text-amber-800">Flagged for human review.</p></div>)}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} className="btn-primary flex-1 py-3" id="approve-save-btn"><CheckCircle className="w-4 h-4" />Approve & Save</button>
                <button onClick={() => setEditMode(!editMode)} className="btn-secondary py-3"><Edit3 className="w-4 h-4" />{editMode ? 'Preview' : 'Edit'}</button>
                <button onClick={handleReject} className="btn-secondary py-3 hover:text-error"><XCircle className="w-4 h-4" />Reject</button>
              </div>
            </div>
          )}

          {saved && (
            <div className="card flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle className="w-8 h-8 text-green-600" /></div>
              <h3 className="text-h2 text-on-surface">Event Saved!</h3>
              <p className="text-body-base text-on-surface-variant">The need has been recorded and will appear on the dashboard.</p>
              <button onClick={handleReject} className="btn-primary mt-4"><ScanLine className="w-4 h-4" />Scan Another</button>
            </div>
          )}

          {!scanResult && !isScanning && !saved && (
            <div className="card flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center"><FileImage className="w-8 h-8 text-on-surface-variant" /></div>
              <h3 className="text-h3 text-on-surface">No Survey Scanned Yet</h3>
              <p className="text-body-sm text-on-surface-variant max-w-xs">Upload a paper survey to begin. Gemini AI will extract data automatically.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DataField = ({ label, value, editMode, edited, onChange, type = 'text' }) => (
  <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
    <label className="text-label-caps uppercase text-on-surface-variant block mb-1">{label}</label>
    {editMode ? <input type={type} value={edited || ''} onChange={(e) => onChange(e.target.value)} className="input-field" /> : <p className="text-body-base font-medium text-on-surface">{value || 'N/A'}</p>}
  </div>
);

export default ScanSurvey;
