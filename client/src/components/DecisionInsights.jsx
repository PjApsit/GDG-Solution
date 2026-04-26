import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * DecisionInsights — Top 3 urgent areas panel
 * WHY: Quick-scan panel for the most critical decisions.
 * Shows top 3 events with explanations so decision-makers can act fast.
 */
const DecisionInsights = ({ events }) => {
  const top3 = [...events]
    .sort((a, b) => b.priority_score - a.priority_score)
    .slice(0, 3);

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-tertiary" />
        <h2 className="text-h3 text-on-surface">Decision Insights</h2>
      </div>
      <p className="text-body-sm text-on-surface-variant mb-4">
        Top 3 areas requiring immediate attention. Each includes automated reasoning.
      </p>

      <div className="space-y-3">
        {top3.map((event, idx) => (
          <div
            key={event.id}
            className="flex items-start gap-3 p-3 rounded border border-outline-variant bg-surface-container-low"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-tertiary-container text-on-tertiary-container text-label-caps font-bold shrink-0">
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-body-base font-semibold text-on-surface truncate">
                  {event.location}
                </p>
                <span className="text-label-caps text-tertiary">
                  Score {event.priority_score}
                </span>
              </div>
              <p className="text-body-sm text-on-surface-variant">{event.problem_type}</p>
              <p className="text-body-sm text-on-surface mt-1 italic">"{event.why}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DecisionInsights;
