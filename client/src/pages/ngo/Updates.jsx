import React from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Clock
} from 'lucide-react';

const Updates = () => {
  const notifications = [
    {
      id: 1,
      type: 'critical',
      title: 'New Severe Outbreak Detected',
      message: 'Intelligence scoring engine flagged a high-risk Dengue cluster in Dharavi Sector 4.',
      time: '12m ago',
      read: false,
    },
    {
      id: 2,
      type: 'success',
      title: 'Resource Deployment Complete',
      message: 'HealthFirst India successfully deployed 500 testing kits to the Mumbai regional hub.',
      time: '2h ago',
      read: false,
    },
    {
      id: 3,
      type: 'info',
      title: 'System Update',
      message: 'The Civil Intelligence Platform has been updated to v2.4.1. New GIS layers are available.',
      time: '5h ago',
      read: true,
    },
    {
      id: 4,
      type: 'warning',
      title: 'Data Ingestion Delay',
      message: 'Weather Satellite Feed is experiencing latency issues. Data may be up to 4 hours old.',
      time: '1d ago',
      read: true,
    }
  ];

  const getTypeStyles = (type) => {
    switch (type) {
      case 'critical': return { icon: AlertCircle, color: 'text-error', bg: 'bg-error-container/30' };
      case 'success': return { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' };
      case 'warning': return { icon: AlertCircle, color: 'text-tertiary', bg: 'bg-tertiary-container/30' };
      default: return { icon: Info, color: 'text-primary', bg: 'bg-primary-container/30' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 text-on-surface">Intelligence Updates</h1>
          <p className="text-body-base text-on-surface-variant">Stay informed about critical events and system activity.</p>
        </div>
        <button className="text-label-caps text-primary font-bold hover:underline">MARK ALL AS READ</button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="Search updates..." 
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded focus:outline-none focus:ring-1 focus:ring-primary text-body-sm"
          />
        </div>
        <button className="px-4 py-2 border border-outline-variant rounded flex items-center gap-2 text-on-surface-variant hover:bg-surface-container transition-colors">
          <Filter className="w-4 h-4" />
          <span className="text-label-caps">FILTER</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => {
          const { icon: Icon, color, bg } = getTypeStyles(notif.type);
          return (
            <div 
              key={notif.id} 
              className={`p-4 rounded-lg border flex gap-4 transition-all hover:border-primary cursor-pointer ${
                notif.read ? 'bg-surface-container-lowest border-outline-variant/50' : 'bg-surface-container-low border-primary/30 shadow-sm'
              }`}
            >
              <div className={`p-2 rounded-lg h-fit ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold ${notif.read ? 'text-on-surface' : 'text-primary'}`}>{notif.title}</h3>
                  <div className="flex items-center gap-1 text-body-sm text-on-surface-variant italic">
                    <Clock className="w-3 h-3" />
                    {notif.time}
                  </div>
                </div>
                <p className="text-body-base text-on-surface-variant leading-relaxed">
                  {notif.message}
                </p>
                {!notif.read && (
                  <div className="mt-3 flex gap-4">
                    <button className="text-label-caps text-primary font-bold hover:underline">VIEW IMPACT MAP</button>
                    <button className="text-label-caps text-on-surface-variant font-bold hover:underline">DISMISS</button>
                  </div>
                )}
              </div>
              {!notif.read && (
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Updates;
