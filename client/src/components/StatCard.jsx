import React from 'react';

/**
 * StatCard — Key metric display tile
 * WHY: Large tabular numbers with clear labels for rapid scanning.
 * Per Civil Intelligence design: uses tonal surface backgrounds.
 */
const StatCard = ({ label, value, subtitle, icon: Icon, trend, trendUp }) => {
  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-label-caps uppercase text-on-surface-variant tracking-wider">
          {label}
        </span>
        {Icon && (
          <div className="flex items-center justify-center w-8 h-8 rounded bg-surface-container">
            <Icon className="w-4 h-4 text-on-surface-variant" strokeWidth={2} />
          </div>
        )}
      </div>
      <p className="text-h1 text-on-surface font-bold tabular-nums">{value}</p>
      {(subtitle || trend) && (
        <div className="flex items-center gap-2 text-body-sm">
          {trend && (
            <span className={trendUp ? 'text-primary' : 'text-error'}>
              {trendUp ? '↑' : '↓'} {trend}
            </span>
          )}
          {subtitle && <span className="text-on-surface-variant">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
