import React, { useState } from 'react';
import { getPriorityLevel, timeAgo } from '../utils/priority';
import { MapPin, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * PriorityList — Ranked list of areas by priority score
 * WHY: Every priority MUST show reasoning. The "why" field is mandatory per acceptance principles.
 * This component makes the scoring engine's logic transparent to decision-makers.
 */
const PriorityList = ({ events }) => {
  const [expandedId, setExpandedId] = useState(null);

  const sorted = [...events].sort((a, b) => b.priority_score - a.priority_score);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-h3 text-on-surface">Priority Areas</h2>
        <span className="text-label-caps uppercase text-on-surface-variant">
          {sorted.length} areas ranked
        </span>
      </div>

      <div className="space-y-1">
        {sorted.map((event, index) => {
          const level = getPriorityLevel(event.priority_score);
          const isExpanded = expandedId === event.id;

          return (
            <div
              key={event.id}
              className="border border-outline-variant rounded transition-colors hover:bg-surface-container-low"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : event.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
                id={`priority-item-${event.id}`}
              >
                {/* Rank number */}
                <span className="text-tabular font-semibold text-on-surface-variant w-6 text-right shrink-0">
                  {index + 1}
                </span>

                {/* Status dot */}
                <span className={`w-1.5 h-1.5 rounded-full ${level.dot} shrink-0`} />

                {/* Location + problem */}
                <div className="flex-1 min-w-0">
                  <p className="text-body-base font-medium text-on-surface truncate">
                    {event.location}
                  </p>
                  <p className="text-body-sm text-on-surface-variant">{event.problem_type}</p>
                </div>

                {/* Score badge */}
                <span className={level.className}>
                  <span className={`w-1.5 h-1.5 rounded-full ${level.dot}`} />
                  {event.priority_score}
                </span>

                {/* Affected count */}
                <span className="text-tabular text-on-surface-variant w-16 text-right shrink-0">
                  {event.affected_count.toLocaleString()}
                </span>

                {/* Expand toggle */}
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-on-surface-variant shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-on-surface-variant shrink-0" />
                )}
              </button>

              {/* WHY explanation — the core of the system */}
              {isExpanded && (
                <div className="px-4 pb-3 pl-14 border-t border-outline-variant">
                  <div className="flex items-start gap-2 mt-3 p-3 bg-surface-container rounded">
                    <AlertTriangle className="w-4 h-4 text-tertiary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-label-caps uppercase text-on-surface-variant mb-1">
                        Why this priority?
                      </p>
                      <p className="text-body-base text-on-surface">{event.why}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-body-sm text-on-surface-variant">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {event.latitude.toFixed(2)}, {event.longitude.toFixed(2)}
                    </span>
                    <span>Source: {event.source}</span>
                    <span>{timeAgo(event.date_recorded)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PriorityList;
