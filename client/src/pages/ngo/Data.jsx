import React from 'react';
import { 
  Database, 
  FileText, 
  Upload, 
  Link2, 
  Settings, 
  CheckCircle2, 
  AlertTriangle,
  Search,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const Data = () => {
  const dataSources = [
    { name: 'District Hospital API', type: 'API', status: 'connected', latency: '45ms', reliability: 99.8, lastSync: '5m ago' },
    { name: 'Field Report CSV Batch', type: 'FILE', status: 'idle', latency: '-', reliability: 100, lastSync: '1h ago' },
    { name: 'Weather Satellite Feed', type: 'STREAM', status: 'error', latency: '-', reliability: 85.4, lastSync: '4d ago' },
    { name: 'Public Health Registry', type: 'DB', status: 'connected', latency: '120ms', reliability: 99.2, lastSync: '12m ago' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 text-on-surface">Data Management</h1>
          <p className="text-body-base text-on-surface-variant">Configure ingestion pipelines and monitor intelligence integrity.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors">
            <Upload className="w-4 h-4" />
            <span className="text-label-caps">UPLOAD FILE</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded text-label-caps font-bold hover:bg-primary/90 shadow-sm transition-colors">
            <Link2 className="w-4 h-4" />
            CONNECT SOURCE
          </button>
        </div>
      </div>

      {/* Integration Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { label: 'SOURCES', value: '14', status: 'Healthy' },
          { label: 'RECORDS/DAY', value: '42.5k', status: '+12%' },
          { label: 'INTEGRITY', value: '99.4%', status: 'Institutional' },
          { label: 'VULNERABILITIES', value: '0', status: 'Secure' },
        ].map((item, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded p-4 border-l-4 border-l-primary">
            <p className="text-label-caps text-on-surface-variant mb-1">{item.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-h2 text-on-surface">{item.value}</h3>
              <span className="text-body-sm text-primary font-bold">{item.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sources Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h2 className="text-h3 text-on-surface flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Active Intelligence Pipelines
              </h2>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant" />
                <input 
                  type="text" 
                  placeholder="Filter sources..." 
                  className="pl-8 pr-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded text-body-sm w-48 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-4 py-3 text-label-caps text-on-surface-variant font-bold">SOURCE NAME</th>
                    <th className="px-4 py-3 text-label-caps text-on-surface-variant font-bold">TYPE</th>
                    <th className="px-4 py-3 text-label-caps text-on-surface-variant font-bold">STATUS</th>
                    <th className="px-4 py-3 text-label-caps text-on-surface-variant font-bold">RELIABILITY</th>
                    <th className="px-4 py-3 text-label-caps text-on-surface-variant font-bold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {dataSources.map((source, i) => (
                    <tr key={i} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-4 py-4">
                        <div className="font-medium text-on-surface">{source.name}</div>
                        <div className="text-body-sm text-on-surface-variant italic">Last sync: {source.lastSync}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 bg-surface-container rounded text-label-caps text-on-surface-variant border border-outline-variant/30">
                          {source.type}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${source.status === 'connected' ? 'bg-success' : source.status === 'error' ? 'bg-error' : 'bg-outline-variant'}`} />
                          <span className="text-body-base capitalize">{source.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${source.reliability}%` }} />
                          </div>
                          <span className="text-tabular-nums text-body-sm font-bold">{source.reliability}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button className="p-2 hover:bg-surface-container rounded text-on-surface-variant">
                          <Settings className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Panel: Security & Processing */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
            <h3 className="text-h3 text-on-surface mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-success" />
              Security Compliance
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Data Encryption', value: 'AES-256 Active', icon: CheckCircle2, color: 'text-success' },
                { label: 'Anonymization', value: 'GDPR Standard', icon: CheckCircle2, color: 'text-success' },
                { label: 'Audit Logging', value: 'Institutional', icon: CheckCircle2, color: 'text-success' },
                { label: 'Key Rotation', value: 'Needs Action', icon: AlertTriangle, color: 'text-tertiary' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-body-base text-on-surface-variant">{row.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-body-sm font-bold">{row.value}</span>
                    <row.icon className={`w-4 h-4 ${row.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary text-on-primary rounded-lg p-5 shadow-lg relative overflow-hidden group">
            <Database className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-700" />
            <h3 className="text-h3 mb-2 font-bold">New: ML Scoring Engine</h3>
            <p className="text-body-sm mb-4 text-on-primary/80">
              Integrate our latest machine learning model to automatically categorize severity from raw field notes.
            </p>
            <button className="flex items-center gap-2 bg-on-primary text-primary px-4 py-2 rounded text-label-caps font-bold hover:bg-on-primary/90 transition-all">
              ENABLE MODEL
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Data;
