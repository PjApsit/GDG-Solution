/**
 * ReportNeed — "Snap & Report" for volunteers (Q17)
 * WHY: Mobile-first, 3-click flow. Volunteers photograph a community need,
 * GPS auto-detects location, Gemini extracts data.
 */

import React, { useState } from 'react';
import { Camera, MapPin, CheckCircle, Loader2, AlertTriangle, Send } from 'lucide-react';
import AIScanner from '../../components/AIScanner';
import DuplicateWarning from '../../components/DuplicateWarning';
import useGeolocation from '../../hooks/useGeolocation';

const ReportNeed = () => {
  const { position, error: geoError, loading: geoLoading } = useGeolocation();
  const [scanResult, setScanResult] = useState(null);
  const [duplicate, setDuplicate] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleScanComplete = async (data) => {
    setScanResult(data);

    // Check for duplicates if we have GPS
    if (position) {
      try {
        const res = await fetch('/api/events/check-duplicate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude: position.latitude,
            longitude: position.longitude,
          }),
        });
        const dupCheck = await res.json();
        if (dupCheck.isDuplicate) {
          setDuplicate(dupCheck);
        }
      } catch {
        // Silently ignore duplicate check failures
      }
    }
  };

  const handleSubmit = async () => {
    if (!scanResult) return;
    setSubmitting(true);

    try {
      const eventData = {
        ...scanResult,
        latitude: position?.latitude || null,
        longitude: position?.longitude || null,
        source: 'volunteer_report',
      };

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (!res.ok) throw new Error('Failed to submit report');

      setSubmitted(true);
    } catch (err) {
      console.error('Report submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setDuplicate(null);
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="card flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-h1 text-on-surface">Report Submitted!</h2>
          <p className="text-body-base text-on-surface-variant text-center max-w-md">
            Thank you for reporting this community need. It has been assigned a priority score
            and will be visible to NGOs immediately.
          </p>
          {scanResult?.priority_score && (
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-label-caps uppercase text-primary">Priority Score</span>
              <span className="text-h2 text-primary font-bold">{scanResult.priority_score}</span>
            </div>
          )}
          <button onClick={handleReset} className="btn-primary mt-4" id="report-another-btn">
            <Camera className="w-4 h-4" />Report Another Need
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 shadow-lg shadow-rose-500/20">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-h1 text-on-surface">Snap & Report</h1>
            <p className="text-body-base text-on-surface-variant">See a community need? Snap a photo and we'll handle the rest.</p>
          </div>
        </div>
      </header>

      {/* Step 1: Location */}
      <div className="card">
        <h2 className="text-h3 text-on-surface mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />Step 1: Location
        </h2>
        {geoLoading ? (
          <div className="flex items-center gap-2 text-body-base text-on-surface-variant">
            <Loader2 className="w-4 h-4 animate-spin" />Detecting your GPS location...
          </div>
        ) : position ? (
          <div className="flex items-center gap-2 text-body-base text-green-600">
            <CheckCircle className="w-4 h-4" />
            Location detected: {position.latitude.toFixed(4)}, {position.longitude.toFixed(4)}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-body-base text-amber-600">
            <AlertTriangle className="w-4 h-4" />
            {geoError || 'Location unavailable. Report will be submitted without GPS.'}
          </div>
        )}
      </div>

      {/* Step 2: Capture */}
      <div className="card">
        <h2 className="text-h3 text-on-surface mb-3 flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />Step 2: Capture Photo
        </h2>
        <AIScanner onScanComplete={handleScanComplete} compact={true} />
      </div>

      {/* Duplicate Warning */}
      {duplicate && (
        <DuplicateWarning
          distance={duplicate.distance}
          existingId={duplicate.existingId}
          onProceed={() => setDuplicate(null)}
          onCancel={handleReset}
        />
      )}

      {/* Step 3: Review & Submit */}
      {scanResult && !duplicate && (
        <div className="card">
          <h2 className="text-h3 text-on-surface mb-4 flex items-center gap-2">
            <Send className="w-5 h-5 text-primary" />Step 3: Review & Submit
          </h2>
          <div className="space-y-3">
            <InfoRow label="Problem" value={scanResult.problem_type} />
            <InfoRow label="Location" value={scanResult.location_text} />
            <InfoRow label="Severity" value={`${scanResult.severity}/10`} />
            <InfoRow label="Affected" value={scanResult.affected_count?.toLocaleString()} />
            <InfoRow label="Description" value={scanResult.description} />
            <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 flex items-center justify-between">
              <span className="text-label-caps uppercase text-primary">AI Priority Score</span>
              <span className="text-h1 font-bold text-primary">{scanResult.priority_score}</span>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full btn-primary py-3 mt-4 disabled:opacity-50"
            id="submit-report-btn"
          >
            {submitting ? (
              <><Loader2 className="w-5 h-5 animate-spin" />Submitting...</>
            ) : (
              <><Send className="w-5 h-5" />Submit Report</>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-outline-variant last:border-0">
    <span className="text-body-sm text-on-surface-variant">{label}</span>
    <span className="text-body-base font-medium text-on-surface">{value || 'N/A'}</span>
  </div>
);

export default ReportNeed;
