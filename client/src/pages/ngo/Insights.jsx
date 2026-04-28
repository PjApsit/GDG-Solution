/**
 * Insights — Trend charts, AI predictions
 */
import React, { useState } from 'react';
import { mockEvents, trendData } from '../../data/mockData';
import { TrendingUp, PieChart, Loader2, Sparkles, BarChart3, Clock } from 'lucide-react';
import { PieChart as RePie, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';

const COLORS = ['#ba1a1a', '#2563eb', '#bc4800', '#585f6c', '#004ac6'];

const Insights = () => {
  const [prediction, setPrediction] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Problem type distribution
  const typeDist = mockEvents.reduce((acc, e) => {
    acc[e.problem_type] = (acc[e.problem_type] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(typeDist).map(([name, value]) => ({ name, value }));

  // Severity distribution
  const sevData = mockEvents.map(e => ({ name: e.location.split(',')[0], severity: e.severity, urgency: e.urgency, score: e.priority_score }));

  const handlePredict = async () => {
    setIsPredicting(true);
    try {
      const res = await fetch('/api/predict/needs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: mockEvents }),
      });
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      setPrediction({ overall_trend: 'Failed to generate predictions. Check server connection.', predictions: [], risk_level: 'moderate' });
    } finally { setIsPredicting(false); }
  };

  const riskColor = { critical: 'text-error bg-error/10', elevated: 'text-amber-600 bg-amber-50', moderate: 'text-primary bg-primary/10', low: 'text-green-600 bg-green-50' };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-h1 text-on-surface mb-2">Deep Insights</h1>
        <p className="text-body-base text-on-surface-variant">Analytics, trends, and AI-powered predictions.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="card">
          <h2 className="text-h3 text-on-surface mb-4 flex items-center gap-2"><PieChart className="w-5 h-5 text-primary" />Problem Type Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RePie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </RePie>
          </ResponsiveContainer>
        </div>

        {/* Trend Line */}
        <div className="card">
          <h2 className="text-h3 text-on-surface mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" />Monthly Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e2ed" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="dengue" stroke="#ba1a1a" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="flood" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="cholera" stroke="#bc4800" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Severity Comparison */}
        <div className="card">
          <h2 className="text-h3 text-on-surface mb-4 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" />Severity by Location</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={sevData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e1e2ed" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="severity" fill="#ba1a1a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="urgency" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Prediction */}
        <div className="card">
          <h2 className="text-h3 text-on-surface mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" />AI Predictions</h2>
          {!prediction && !isPredicting && (
            <div className="text-center py-8">
              <p className="text-body-base text-on-surface-variant mb-4">Analyze recent events to predict upcoming community needs.</p>
              <button onClick={handlePredict} className="btn-primary"><Sparkles className="w-4 h-4" />Generate AI Prediction</button>
            </div>
          )}
          {isPredicting && (
            <div className="flex flex-col items-center py-8 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-body-base text-on-surface-variant">Gemini is analyzing patterns...</p>
            </div>
          )}
          {prediction && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-label-caps uppercase text-on-surface-variant">Risk Level:</span>
                <span className={`px-3 py-1 rounded-full text-body-sm font-medium ${riskColor[prediction.risk_level] || riskColor.moderate}`}>{prediction.risk_level}</span>
              </div>
              <p className="text-body-base text-on-surface italic">"{prediction.overall_trend}"</p>
              {prediction.predictions?.map((p, i) => (
                <div key={i} className="p-3 rounded-lg bg-surface-container-low border border-outline-variant">
                  <p className="text-body-base font-medium text-on-surface">{p.predicted_problem} — {p.likely_location}</p>
                  <p className="text-body-sm text-on-surface-variant mt-1">{p.reasoning}</p>
                  <p className="text-body-sm text-primary mt-1 font-medium">→ {p.recommended_action}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;
