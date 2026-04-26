/**
 * Priority Scoring Utilities
 * WHY: The scoring engine must be transparent. Every score has a "why".
 * This mirrors the backend logic for offline/preview calculations.
 */

/**
 * Compute a priority score (0–100) with a human-readable explanation.
 *
 * Weights:
 *  - severity:       30%  (how bad is the situation)
 *  - urgency:        25%  (how time-sensitive)
 *  - recency:        20%  (how fresh the data is)
 *  - affected_count: 20%  (scale of impact)
 *  - accessibility:   5%  (optional — how hard to reach)
 */
export function calculatePriority(event) {
  const {
    severity = 0,
    urgency = 0,
    data_age_days = 0,
    affected_count = 0,
    accessibility = 5, // default mid-range if not provided
  } = event;

  // Normalize each factor to 0–10
  const recency = Math.max(0, 10 - data_age_days * 0.5); // newer = higher
  const impactNorm = Math.min(10, affected_count / 1000);  // 10k+ maxes out
  const accessNorm = 10 - accessibility;                    // lower accessibility = higher priority

  const score = Math.round(
    severity * 3.0 +
    urgency * 2.5 +
    recency * 2.0 +
    impactNorm * 2.0 +
    accessNorm * 0.5
  );

  const clampedScore = Math.min(100, Math.max(0, score));

  // Build "why" explanation
  const reasons = [];
  if (severity >= 8) reasons.push(`High severity (${severity}/10)`);
  else if (severity >= 5) reasons.push(`Moderate severity (${severity}/10)`);
  else reasons.push(`Low severity (${severity}/10)`);

  if (urgency >= 8) reasons.push(`extreme urgency (${urgency}/10)`);
  else if (urgency >= 5) reasons.push(`moderate urgency (${urgency}/10)`);

  if (data_age_days <= 3) reasons.push(`very recent data (${data_age_days} days)`);
  else if (data_age_days <= 7) reasons.push(`recent data (${data_age_days} days)`);
  else reasons.push(`older data (${data_age_days} days)`);

  if (affected_count >= 1000) reasons.push(`large affected population (${affected_count.toLocaleString()})`);
  else if (affected_count >= 100) reasons.push(`${affected_count.toLocaleString()} people affected`);

  const why = reasons.join(' + ') + '.';

  return { priority_score: clampedScore, why };
}

/**
 * Get severity label + color class for a priority score.
 */
export function getPriorityLevel(score) {
  if (score >= 80) return { label: 'Critical', className: 'badge-critical', dot: 'bg-error' };
  if (score >= 60) return { label: 'High', className: 'badge-warning', dot: 'bg-tertiary' };
  if (score >= 40) return { label: 'Medium', className: 'badge-success', dot: 'bg-primary' };
  return { label: 'Low', className: 'badge-neutral', dot: 'bg-secondary' };
}

/**
 * Format a date string to relative time (e.g., "3 days ago").
 */
export function timeAgo(dateString) {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  return `${Math.floor(days / 30)} months ago`;
}
