import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Download, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  BrainCircuit
} from 'lucide-react';
import { trendData } from '../../data/mockData';

const Insights = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-h1 text-on-surface">Deep Intelligence Insights</h1>
          <p className="text-body-base text-on-surface-variant">Predictive analysis and historical impact tracking.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="text-label-caps">LAST 30 DAYS</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded text-label-caps font-bold hover:bg-primary/90 shadow-sm transition-colors">
            <Download className="w-4 h-4" />
            EXPORT REPORT
          </button>
        </div>
      </div>

      {/* High-Level Predictive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'OUTBREAK RISK', value: 'Elevated', sub: '+14% probability', color: 'text-tertiary', icon: BrainCircuit },
          { label: 'RESOURCE EFFICIENCY', value: '92%', sub: '+4% vs last month', color: 'text-success', icon: Target },
          { label: 'AVG RESPONSE TIME', value: '4.2h', sub: '-1.5h improvement', color: 'text-primary', icon: TrendingUp },
          { label: 'ACTIVE DEPLOYMENTS', value: '18', sub: '2 nearing completion', color: 'text-secondary', icon: BarChart3 },
        ].map((card, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded p-5 relative overflow-hidden group">
            <card.icon className="absolute -right-2 -bottom-2 w-16 h-16 opacity-5 group-hover:scale-110 transition-transform" />
            <p className="text-label-caps text-on-surface-variant mb-1">{card.label}</p>
            <h3 className={`text-h1 ${card.color}`}>{card.value}</h3>
            <p className="text-body-sm mt-1 font-medium text-on-surface-variant">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Visualization Placeholder */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-h2 text-on-surface">Mission Severity Trends</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-label-caps text-on-surface-variant">DENGUE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-tertiary" />
                <span className="text-label-caps text-on-surface-variant">FLOOD</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 flex items-end justify-between gap-4 px-4 border-b border-l border-outline-variant/30">
            {trendData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  <div 
                    className="w-1/3 bg-primary/20 group-hover:bg-primary transition-all rounded-t" 
                    style={{ height: `${data.dengue * 2}px` }} 
                  />
                  <div 
                    className="w-1/3 bg-tertiary/20 group-hover:bg-tertiary transition-all rounded-t" 
                    style={{ height: `${data.flood * 4}px` }} 
                  />
                </div>
                <span className="text-label-caps text-on-surface-variant">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Breakdown */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
          <h3 className="text-h2 text-on-surface mb-6">Sector Distribution</h3>
          <div className="space-y-6">
            {[
              { label: 'Healthcare', value: 45, color: 'bg-primary' },
              { label: 'Sanitation', value: 30, color: 'bg-secondary' },
              { label: 'Disaster Relief', value: 15, color: 'bg-tertiary' },
              { label: 'Education', value: 10, color: 'bg-outline-variant' },
            ].map((sector, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-body-base font-medium">
                  <span>{sector.label}</span>
                  <span className="text-tabular-nums">{sector.value}%</span>
                </div>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full ${sector.color}`} style={{ width: `${sector.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-surface-container-low rounded border border-outline-variant/50">
            <div className="flex items-start gap-3">
              <BrainCircuit className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-body-sm font-bold text-on-surface">AI Recommendation</h4>
                <p className="text-body-sm text-on-surface-variant">
                  Shift 15% of healthcare resources to Sanitation in the Mumbai cluster to preemptively reduce dengue breeding sites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
