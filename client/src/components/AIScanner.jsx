/**
 * AIScanner — Reusable Gemini-powered document scanner widget
 * WHY: Used by both ScanSurvey and ReportNeed pages.
 * Handles image capture, compression, API call, and result display.
 */

import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Sparkles, XCircle, AlertTriangle } from 'lucide-react';

const AIScanner = ({ onScanComplete, compact = false }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageCapture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null);

    try {
      const { default: imageCompression } = await import('browser-image-compression');
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      });
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target.result);
        setBase64Image(ev.target.result);
        // Backup to localStorage (Q29)
        try {
          localStorage.setItem('impactflow_last_scan_image', ev.target.result);
        } catch { /* localStorage full */ }
      };
      reader.readAsDataURL(compressed);
    } catch {
      setError('Failed to process image.');
    }
  };

  const handleScan = async () => {
    if (!base64Image) return;
    setIsScanning(true);
    setError(null);

    try {
      const res = await fetch('/api/scan/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Scan failed');

      if (onScanComplete) onScanComplete(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const handleClear = () => {
    setImagePreview(null);
    setBase64Image(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {!imagePreview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group ${compact ? 'p-6' : 'p-12'}`}
        >
          <div className={`rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform ${compact ? 'w-12 h-12' : 'w-16 h-16'}`}>
            <Camera className={compact ? 'w-6 h-6 text-primary' : 'w-8 h-8 text-primary'} />
          </div>
          <div className="text-center">
            <p className="text-body-base font-medium text-on-surface">
              {compact ? 'Capture photo' : 'Click to upload or capture photo'}
            </p>
            <p className="text-body-sm text-on-surface-variant">JPEG, PNG, WebP</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img src={imagePreview} alt="Captured" className="w-full rounded-xl border border-outline-variant max-h-64 object-cover" />
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-error/10"
          >
            <XCircle className="w-5 h-5 text-error" />
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageCapture}
        className="hidden"
        id="ai-scanner-input"
      />

      {imagePreview && (
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="w-full btn-primary py-3 disabled:opacity-50"
          id="ai-scan-btn"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI is reading your document...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Scan with Gemini AI
            </>
          )}
        </button>
      )}

      {isScanning && (
        <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
          <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          Analyzing document... this usually takes 3-5 seconds
        </div>
      )}

      {error && (
        <div className="bg-error/10 border border-error/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-error shrink-0" />
          <p className="text-body-sm text-error">{error}</p>
        </div>
      )}
    </div>
  );
};

export default AIScanner;
