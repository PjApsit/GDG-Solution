/**
 * CSVImport — Upload and parse CSV files for batch event import
 * WHY (Q16): NGOs have existing data in spreadsheets. This enables bulk import.
 */

import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertTriangle, FileSpreadsheet } from 'lucide-react';

const CSVImport = ({ onImport }) => {
  const [csvData, setCsvData] = useState(null);
  const [error, setError] = useState(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null);

    try {
      const { default: Papa } = await import('papaparse');
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const valid = results.data.filter(r => r.location || r.problem_type);
          if (valid.length === 0) {
            setError('No valid rows found. Ensure CSV has location or problem_type columns.');
            return;
          }
          setCsvData(valid);
        },
        error: (err) => setError(err.message),
      });
    } catch (err) {
      setError('Failed to parse CSV: ' + err.message);
    }
  };

  const handleImport = async () => {
    if (!csvData || !onImport) return;
    setImporting(true);
    try {
      await onImport(csvData);
      setCsvData(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
        onClick={() => fileInputRef.current?.click()}>
        <input ref={fileInputRef} type="file" accept=".csv" onChange={handleUpload} className="hidden" id="csv-import-input" />
        <FileSpreadsheet className="w-10 h-10 text-on-surface-variant mx-auto mb-3" />
        <p className="text-body-base font-medium text-on-surface">Drop CSV file here or click to upload</p>
        <p className="text-body-sm text-on-surface-variant mt-1">Required: location, problem_type, severity, urgency, affected_count</p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-error shrink-0" />
          <p className="text-body-sm text-error">{error}</p>
        </div>
      )}

      {csvData && (
        <div className="card">
          <p className="text-body-base text-primary font-medium mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />{csvData.length} rows parsed successfully
          </p>
          <div className="max-h-60 overflow-auto border border-outline-variant rounded-lg">
            <table className="w-full text-body-sm">
              <thead>
                <tr>
                  {Object.keys(csvData[0] || {}).map(k => (
                    <th key={k} className="table-header text-xs">{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 10).map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((v, j) => (
                      <td key={j} className="table-cell text-xs">{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {csvData.length > 10 && (
            <p className="text-body-sm text-on-surface-variant mt-2">Showing first 10 of {csvData.length} rows</p>
          )}
          <button
            onClick={handleImport}
            disabled={importing}
            className="btn-primary mt-4 disabled:opacity-50"
            id="csv-import-btn"
          >
            <Upload className="w-4 h-4" />
            {importing ? 'Importing...' : `Import ${csvData.length} Records`}
          </button>
        </div>
      )}
    </div>
  );
};

export default CSVImport;
