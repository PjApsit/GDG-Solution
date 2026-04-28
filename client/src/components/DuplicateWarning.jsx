/**
 * DuplicateWarning — Alert when a new report is near an existing one (Q22)
 * WHY: Prevents duplicate data entry. Shows 50m proximity warning.
 */

import React from 'react';
import { AlertTriangle, MapPin, GitMerge } from 'lucide-react';

const DuplicateWarning = ({ distance, existingId, onMerge, onProceed, onCancel }) => {
  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <h3 className="text-h3 text-amber-900">Possible Duplicate Detected</h3>
          <p className="text-body-base text-amber-800 mt-1">
            This report is <span className="font-bold">{distance}m</span> from an existing active report.
          </p>
          <p className="text-body-sm text-amber-700 mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            Existing report ID: {existingId}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        {onMerge && (
          <button onClick={onMerge} className="btn-primary flex-1 bg-amber-600 hover:bg-amber-700" id="merge-reports-btn">
            <GitMerge className="w-4 h-4" />Merge Reports
          </button>
        )}
        <button onClick={onProceed} className="btn-secondary flex-1" id="proceed-anyway-btn">
          Proceed Anyway
        </button>
        <button onClick={onCancel} className="btn-ghost text-amber-700" id="cancel-duplicate-btn">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DuplicateWarning;
