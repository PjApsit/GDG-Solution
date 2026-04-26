/**
 * Priority Scoring Engine (Backend)
 * Mirrors the logic defined in the frontend, but acts as the single source of truth
 * when processing newly ingested data.
 */

export const calculatePriority = (event) => {
  const {
    severity = 0,
    urgency = 0,
    data_age_days = 0,
    affected_count = 0,
    accessibility = 5,
  } = event;

  const recency = Math.max(0, 10 - data_age_days * 0.5);
  const impactNorm = Math.min(10, affected_count / 1000);
  const accessNorm = 10 - accessibility;

  const score = Math.round(
    severity * 3.0 +
    urgency * 2.5 +
    recency * 2.0 +
    impactNorm * 2.0 +
    accessNorm * 0.5
  );

  const priority_score = Math.min(100, Math.max(0, score));

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

  return { priority_score, why };
};
