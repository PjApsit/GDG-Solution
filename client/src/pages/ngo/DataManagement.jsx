/**
 * DataManagement — All Reports, Pending Review, Import CSV
 */
import React, { useState } from 'react';
import { mockEvents } from '../../data/mockData';
import { getPriorityLevel } from '../../utils/priority';
import { Database, Search, Filter, Upload, Download, AlertTriangle, CheckCircle, Eye } from 'lucide-react';

const DataManagement = () => {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [csvData, setCsvData] = useState(null);

  const events = mockEvents.filter(e =>
    tab === 'pending' ? false : // no pending review items in mock data
    e.location.toLowerCase().includes(search.toLowerCase()) ||
    e.problem_type.toLowerCase().includes(search.toLowerCase())
  );

  const handleCSVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const { default: Papa } = await import('papaparse');
    Papa.parse(file, {
      header: true,
      complete: (results) => setCsvData(results.data.filter(r => r.location || r.problem_type)),
    });
  };

  const handleExport = () => {
    window.open('/api/export/events', '_blank');
  };

  const tabs = [
    { id: 'all', label: 'All Reports', count: mockEvents.length },
    { id: 'pending', label: 'Pending Review', count: 0 },
    { id: 'import', label: 'Import CSV', count: null },
  ];

  return (
    <div className="space-y-6">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-on-surface mb-2">Data Management</h1>
          <p className="text-body-base text-on-surface-variant">View, filter, and import community need reports.</p>
        </div>
        <button onClick={handleExport} className="btn-secondary"><Download className="w-4 h-4" />Export CSV</button>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-container rounded-lg p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-md text-body-base font-medium transition-colors ${tab === t.id ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
            {t.label}
            {t.count !== null && <span className="text-label-caps bg-surface-container-high px-2 py-0.5 rounded-full">{t.count}</span>}
          </button>
        ))}
      </div>

      {tab !== 'import' && (
        <>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by location or problem..." className="input-field pl-10" />
            </div>
          </div>

          <div className="card overflow-hidden p-0">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header">Location</th>
                  <th className="table-header">Problem</th>
                  <th className="table-header">Severity</th>
                  <th className="table-header">Priority</th>
                  <th className="table-header">Affected</th>
                  <th className="table-header">Source</th>
                  <th className="table-header">Date</th>
                </tr>
              </thead>
              <tbody>
                {events.map(event => {
                  const level = getPriorityLevel(event.priority_score);
                  return (
                    <tr key={event.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="table-cell font-medium">{event.location}</td>
                      <td className="table-cell">{event.problem_type}</td>
                      <td className="table-cell tabular-nums">{event.severity}/10</td>
                      <td className="table-cell"><span className={level.className}>{event.priority_score}</span></td>
                      <td className="table-cell tabular-nums">{event.affected_count.toLocaleString()}</td>
                      <td className="table-cell"><span className="badge-neutral">{event.source}</span></td>
                      <td className="table-cell text-on-surface-variant">{event.date_recorded}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'import' && (
        <div className="card">
          <h2 className="text-h3 text-on-surface mb-4 flex items-center gap-2"><Upload className="w-5 h-5 text-primary" />Import CSV Data</h2>
          <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center">
            <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" id="csv-upload" />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="w-10 h-10 text-on-surface-variant mx-auto mb-3" />
              <p className="text-body-base font-medium">Drop CSV file here or click to upload</p>
              <p className="text-body-sm text-on-surface-variant mt-1">Columns: location, problem_type, severity, urgency, affected_count</p>
            </label>
          </div>
          {csvData && (
            <div className="mt-4">
              <p className="text-body-base text-primary font-medium mb-2"><CheckCircle className="w-4 h-4 inline mr-1" />{csvData.length} rows parsed</p>
              <div className="max-h-60 overflow-auto border border-outline-variant rounded-lg">
                <table className="w-full text-body-sm">
                  <thead><tr>{Object.keys(csvData[0] || {}).map(k => <th key={k} className="table-header text-xs">{k}</th>)}</tr></thead>
                  <tbody>{csvData.slice(0, 10).map((row, i) => <tr key={i}>{Object.values(row).map((v, j) => <td key={j} className="table-cell text-xs">{v}</td>)}</tr>)}</tbody>
                </table>
              </div>
              <button className="btn-primary mt-4">Import {csvData.length} Records</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataManagement;
