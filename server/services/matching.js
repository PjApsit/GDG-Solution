/**
 * Smart Volunteer Matching Service
 * WHY: Intelligently matches volunteers to tasks based on:
 *   1. Skill match (40 pts)
 *   2. Proximity (30 pts) — uses Haversine distance
 *   3. Availability / Fatigue (20 pts)
 *   4. Experience (10 pts)
 */

/**
 * Maps problem types to required skills
 */
const SKILL_MAP = {
  'Health': ['Medical', 'First Aid', 'Counseling'],
  'Dengue Outbreak': ['Medical', 'First Aid', 'Community Outreach'],
  'Cholera Cases': ['Medical', 'First Aid', 'Water Management'],
  'Flood': ['Logistics', 'Disaster Relief', 'Transportation'],
  'Flood Displacement': ['Logistics', 'Disaster Relief', 'Food Distribution'],
  'Water': ['Water Management', 'Logistics'],
  'Water Scarcity': ['Water Management', 'Logistics', 'Community Outreach'],
  'Sanitation': ['Water Management', 'Construction', 'Community Outreach'],
  'Education': ['Teaching', 'Community Outreach', 'Data Entry'],
  'Infrastructure': ['Construction', 'Logistics'],
  'Landslide Risk': ['Disaster Relief', 'Logistics', 'Community Outreach'],
  'Other': ['Logistics', 'Community Outreach'],
};

/**
 * Infer required skills from a problem type
 */
export const inferSkills = (problemType) => {
  return SKILL_MAP[problemType] || SKILL_MAP['Other'];
};

/**
 * Calculate Haversine distance between two lat/lng points in km
 */
export const getDistanceBetween = (loc1, loc2) => {
  if (!loc1?.latitude || !loc2?.latitude) return Infinity;

  const R = 6371; // Earth radius in km
  const dLat = toRad(loc2.latitude - loc1.latitude);
  const dLon = toRad(loc2.longitude - loc1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.latitude)) * Math.cos(toRad(loc2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

function toRad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Calculate match score (0-100) between a volunteer and a task
 */
export const calculateMatchScore = (volunteer, task) => {
  let score = 0;

  // 1. Skill Match (0-40 points)
  const requiredSkills = inferSkills(task.problem_type || task.priority);
  const volunteerSkills = volunteer.skills || [];
  const matchedSkills = volunteerSkills.filter(s => requiredSkills.includes(s));
  if (requiredSkills.length > 0) {
    score += (matchedSkills.length / requiredSkills.length) * 40;
  }

  // 2. Proximity (0-30 points) — uses Haversine distance
  const volunteerLoc = { latitude: volunteer.latitude, longitude: volunteer.longitude };
  const taskLoc = { latitude: task.latitude, longitude: task.longitude };
  const distanceKm = getDistanceBetween(volunteerLoc, taskLoc);

  if (distanceKm <= 2) score += 30;
  else if (distanceKm <= 5) score += 25;
  else if (distanceKm <= 10) score += 15;
  else if (distanceKm <= 20) score += 5;

  // 3. Availability / Fatigue (0-20 points)
  const lastCompleted = volunteer.last_task_completed_at;
  if (lastCompleted) {
    const hoursSinceLastTask = (Date.now() - new Date(lastCompleted).getTime()) / 3600000;
    if (hoursSinceLastTask > 24) score += 20;
    else if (hoursSinceLastTask > 8) score += 15;
    else if (hoursSinceLastTask > 2) score += 5;
  } else {
    // Never completed a task — fully available
    score += 20;
  }

  // 4. Experience (0-10 points)
  score += Math.min(10, volunteer.tasks_completed || 0);

  return Math.round(score);
};

/**
 * Get top N volunteer matches for a task, sorted by match score descending
 */
export const getTopMatches = (task, volunteers, limit = 5) => {
  const scored = volunteers.map(v => ({
    ...v,
    matchScore: calculateMatchScore(v, task),
    matchedSkills: (v.skills || []).filter(s => inferSkills(task.problem_type).includes(s)),
  }));

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, limit);
};
