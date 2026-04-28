import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Bell,
  Dot,
  Download,
  Edit3,
  FileText,
  MapPin,
  MoreHorizontal,
  Plus,
  Shield,
  Signal,
  UserPlus,
} from 'lucide-react';

const assets = [
  { id: 'a1', title: 'Incident Report V1', size: '2.4 MB', update: 'Updated 2h ago', color: 'text-error' },
  { id: 'a2', title: 'Victim Demographics', size: '842 KB', update: 'Updated 5h ago', color: 'text-success' },
  { id: 'a3', title: 'Resource Allocation', size: '1.1 MB', update: 'Updated 1d ago', color: 'text-primary' },
];

const volunteers = [
  { id: 'AK', name: 'Arjun Kulkarni', code: 'ID: VOL-9421', role: 'Lead Paramedic', area: 'Idukki - Sector 4', contact: 'Secure Line', status: 'Dispatching', statusClass: 'badge-success' },
  { id: 'MS', name: 'Meera Sankar', code: 'ID: VOL-8832', role: 'Logistics Coordinator', area: 'Kochi Hub', contact: 'Offline', status: 'Standby', statusClass: 'badge-neutral' },
  { id: 'RL', name: 'Rajesh L.', code: 'ID: VOL-7120', role: 'Heavy Machinery Ops', area: 'Wayanad - Pass 1', contact: 'Unresponsive', status: 'Critical Alert', statusClass: 'badge-critical' },
];

const stats = [
  { label: 'Total Allocated Funds', value: 'Rs12.4M', sub: '+8.2% vs last qtr', subClass: 'text-success' },
  { label: 'Evacuations Complete', value: '1,248', sub: '92.3% of target', subClass: 'text-on-surface-variant' },
  { label: 'Active Incidents', value: '14', sub: '2 high severity', subClass: 'text-error' },
  { label: 'Connectivity Uptime', value: '99.8%', sub: 'Alpha beta online', subClass: 'text-success' },
];

const ProjectMissionControl = () => {
  return (
    <div className="space-y-6 max-w-[1200px]">
      <header className="border-b border-outline-variant pb-5">
        <p className="text-body-sm text-on-surface-variant mb-2">Mission Control</p>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-label-caps uppercase text-on-surface-variant">Projects &gt; Active Operations</p>
            <h1 className="text-h1 text-on-surface mt-1">Monsoon Relief '24 <span className="badge-success ml-2 align-middle">Active</span></h1>
            <p className="text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> Kerala, India - Operational Zone Alpha
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary"><Download className="h-4 w-4" />Export Report</button>
            <button className="btn-primary"><Edit3 className="h-4 w-4" />Edit Project</button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="card xl:col-span-7">
          <div className="flex items-center justify-between mb-3">
            <p className="text-label-caps uppercase text-on-surface-variant">Project Data Assets</p>
            <button className="btn-ghost text-primary">View Repository</button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {assets.map((asset) => (
              <div key={asset.id} className="rounded border border-outline-variant bg-surface-container-lowest p-3">
                <FileText className={`h-4 w-4 ${asset.color}`} />
                <p className="text-body-base text-on-surface mt-2 truncate">{asset.title}</p>
                <p className="text-body-sm text-on-surface-variant mt-1">{asset.size} - {asset.update}</p>
              </div>
            ))}
            <button className="rounded border border-dashed border-outline-variant bg-surface-container-low p-3 text-body-sm text-on-surface-variant hover:bg-surface-container transition-colors">
              Upload New Asset
            </button>
          </div>
        </div>

        <div className="card xl:col-span-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-label-caps uppercase text-on-surface-variant">Deployment Analytics</p>
            <div className="flex items-center gap-1 text-on-surface-variant">
              <button className="btn-ghost px-2 py-1">&lt;</button>
              <button className="btn-ghost px-2 py-1">&gt;</button>
            </div>
          </div>
          <div className="rounded border border-outline-variant bg-surface-container-low p-4">
            <p className="text-body-sm text-on-surface-variant uppercase">Weekly Resource Intensity</p>
            <p className="text-4xl font-bold text-primary mt-2">+24.8%</p>
            <p className="text-body-sm text-success mt-1">Critical</p>
            <div className="mt-4 h-20 rounded bg-[linear-gradient(180deg,rgba(37,99,235,0.10)_0%,rgba(37,99,235,0.02)_100%)] border border-outline-variant relative overflow-hidden">
              <svg viewBox="0 0 220 80" className="absolute inset-0 h-full w-full">
                <polyline fill="none" stroke="rgb(37 99 235)" strokeWidth="2" points="0,62 30,55 60,60 90,40 120,48 150,30 180,35 220,26" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className="card bg-primary/5 border-primary/20">
        <h3 className="text-h3 text-on-surface flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Operational Mandate: Monsoon Relief 2024
        </h3>
        <p className="text-body-base text-on-surface mt-3 leading-relaxed">
          The 2024 monsoon relief operation represents a critical intervention in the Kerala sector, where
          unprecedented precipitation has triggered grade-A humanitarian concerns. Our mission is to focus resources
          through high-fidelity data coordination and volunteer logistics to ensure that life-saving support reaches
          the most vulnerable demographics within the shortest operational window.
        </p>
      </section>

      <section className="card p-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-outline-variant">
          <div>
            <h3 className="text-h3 text-on-surface">Volunteer Management</h3>
            <p className="text-body-sm text-on-surface-variant">42 personnel deployed - 3 active sectors</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary"><FileText className="h-4 w-4" />Assign Task</button>
            <button className="btn-primary"><UserPlus className="h-4 w-4" />Add Volunteer</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr>
                <th className="table-header">Volunteer</th>
                <th className="table-header">Role</th>
                <th className="table-header">Deployment Area</th>
                <th className="table-header">Contact Status</th>
                <th className="table-header">Task Status</th>
                <th className="table-header text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((vol) => (
                <tr key={vol.code}>
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">{vol.id}</div>
                      <div>
                        <p className="text-body-base text-on-surface">{vol.name}</p>
                        <p className="text-body-sm text-on-surface-variant">{vol.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">{vol.role}</td>
                  <td className="table-cell">{vol.area}</td>
                  <td className="table-cell">
                    <span className="inline-flex items-center gap-1 text-body-sm">
                      <Dot className="h-4 w-4 text-on-surface-variant" />{vol.contact}
                    </span>
                  </td>
                  <td className="table-cell"><span className={vol.statusClass}>{vol.status}</span></td>
                  <td className="table-cell text-center"><button className="btn-ghost p-1"><MoreHorizontal className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-outline-variant">
          <p className="text-body-sm text-on-surface-variant">Showing 3 of 42 volunteers</p>
          <button className="btn-primary rounded-full h-11 w-11 p-0" aria-label="Quick Add Volunteer">
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div key={item.label} className="card">
            <p className="text-label-caps uppercase text-on-surface-variant">{item.label}</p>
            <p className="text-4xl font-semibold text-on-surface mt-2">{item.value}</p>
            <p className={`text-body-sm mt-2 uppercase ${item.subClass}`}>{item.sub}</p>
          </div>
        ))}
      </section>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
          <Bell className="h-4 w-4" />
          Monitoring channel: Alpha Command Network
        </div>
        <Link to="/ngo/projects" className="btn-ghost text-primary">
          Return to Project Archive <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectMissionControl;