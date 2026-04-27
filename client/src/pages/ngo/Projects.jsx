import React from 'react';
import { mockNGOs, mockEvents } from '../../data/mockData';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  MoreVertical, 
  MapPin, 
  Users, 
  Calendar,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const Projects = () => {
  // Use first NGO for demo
  const ngo = mockNGOs[0];
  
  // Mock projects derived from events/tasks for the NGO
  const activeProjects = [
    {
      id: 'prj-001',
      name: 'Dharavi Health Initiative',
      location: 'Mumbai, Maharashtra',
      volunteers: 45,
      budget: '₹4.5L / ₹10L',
      status: 'active',
      lastUpdate: '2h ago',
      progress: 65,
      criticality: 'High'
    },
    {
      id: 'prj-002',
      name: 'Clean Water Thar',
      location: 'Bikaner, Rajasthan',
      volunteers: 12,
      budget: '₹8.2L / ₹15L',
      status: 'active',
      lastUpdate: '1d ago',
      progress: 30,
      criticality: 'Medium'
    },
    {
      id: 'prj-003',
      name: 'Cyclone Preparedness 2026',
      location: 'Coastal Odisha',
      volunteers: 89,
      budget: '₹2.1L / ₹20L',
      status: 'planning',
      lastUpdate: '5d ago',
      progress: 10,
      criticality: 'Urgent'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 text-on-surface">NGO Projects & Hub</h1>
          <p className="text-body-base text-on-surface-variant">Strategic oversight of all humanitarian deployments.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-9 pr-4 py-2 border border-outline-variant rounded bg-surface-container-lowest text-body-sm w-64 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded text-label-caps font-bold hover:bg-primary/90 shadow-sm transition-colors">
            <Plus className="w-4 h-4" strokeWidth={3} />
            NEW PROJECT
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'ACTIVE PROJECTS', value: '12', icon: FolderKanban, color: 'text-primary' },
          { label: 'TOTAL VOLUNTEERS', value: '156', icon: Users, color: 'text-secondary' },
          { label: 'PROJECTED IMPACT', value: '8.5k', icon: TrendingUp, color: 'text-tertiary' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded p-4 flex items-center justify-between">
            <div>
              <p className="text-label-caps text-on-surface-variant mb-1">{stat.label}</p>
              <h3 className="text-h1 text-on-surface leading-none">{stat.value}</h3>
            </div>
            <div className={`p-2 rounded bg-surface-container ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {activeProjects.map((project) => (
          <div key={project.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col group hover:shadow-md transition-all">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${
                      project.criticality === 'Urgent' ? 'bg-error' : project.criticality === 'High' ? 'bg-tertiary' : 'bg-secondary'
                    }`} />
                    <span className="text-label-caps text-on-surface-variant">{project.criticality} PRIORITY</span>
                  </div>
                  <h3 className="text-h2 text-on-surface group-hover:text-primary transition-colors">{project.name}</h3>
                </div>
                <button className="p-1 hover:bg-surface-container rounded text-on-surface-variant">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <MapPin className="w-4 h-4" />
                    <span className="text-label-caps">LOCATION</span>
                  </div>
                  <p className="text-body-base text-on-surface font-medium">{project.location}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <Users className="w-4 h-4" />
                    <span className="text-label-caps">TEAM SIZE</span>
                  </div>
                  <p className="text-body-base text-on-surface font-medium">{project.volunteers} Active</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <Calendar className="w-4 h-4" />
                    <span className="text-label-caps">BUDGET</span>
                  </div>
                  <p className="text-body-base text-on-surface font-medium">{project.budget}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-label-caps">COMPLETION</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-tabular-nums text-on-surface font-bold">{project.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-5 py-3 border-t border-outline-variant bg-surface-container-low flex items-center justify-between">
              <span className="text-body-sm text-on-surface-variant">Last activity: {project.lastUpdate}</span>
              <button className="flex items-center gap-1 text-label-caps text-primary font-bold hover:underline">
                MANAGE DEPLOYMENT
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
