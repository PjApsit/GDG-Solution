/**
 * Matching Controller — Smart volunteer-to-task matching
 * WHY: Uses multi-factor scoring (skills, proximity, fatigue, experience)
 * to find optimal volunteer-task pairings.
 * 
 * Uses Firestore when configured, otherwise falls back to in-memory mock data.
 */

import { getTopMatches, calculateMatchScore, inferSkills } from '../services/matching.js';

// Dynamic model loading
const getModel = async () => {
  if (process.env.FIREBASE_PROJECT_ID) {
    return await import('../models/firestore.js');
  }
  return null;
};

// Mock volunteer data for development (used when Firestore is not configured)
const mockVolunteers = [
  { id: 'vol-001', name: 'Arun Sharma', skills: ['Logistics', 'First Aid'], latitude: 22.5726, longitude: 88.3639, tasks_completed: 7, last_task_completed_at: '2026-04-25T10:00:00Z' },
  { id: 'vol-002', name: 'Priya Desai', skills: ['Water Management', 'Community Outreach'], latitude: 26.9124, longitude: 75.7873, tasks_completed: 12, last_task_completed_at: '2026-04-20T15:00:00Z' },
  { id: 'vol-003', name: 'Kabir Ahmed', skills: ['Medical', 'Data Entry'], latitude: 19.076, longitude: 72.8777, tasks_completed: 5, last_task_completed_at: null },
  { id: 'vol-004', name: 'Sneha Patel', skills: ['Teaching', 'Community Outreach', 'First Aid'], latitude: 23.0225, longitude: 72.5714, tasks_completed: 3, last_task_completed_at: '2026-04-27T08:00:00Z' },
  { id: 'vol-005', name: 'Ravi Kumar', skills: ['Construction', 'Logistics', 'Disaster Relief'], latitude: 11.0168, longitude: 76.9558, tasks_completed: 9, last_task_completed_at: '2026-04-22T12:00:00Z' },
];

const mockTasks = [
  { task_id: 'tsk-001', title: 'Emergency Medical Camp Setup', problem_type: 'Dengue Outbreak', priority: 'critical', latitude: 19.043, longitude: 72.8553, location: 'Dharavi, Mumbai' },
  { task_id: 'tsk-002', title: 'Flood Relief Distribution', problem_type: 'Flood Displacement', priority: 'high', latitude: 21.9497, longitude: 89.1833, location: 'Sundarbans, West Bengal' },
  { task_id: 'tsk-003', title: 'Water Tanker Deployment', problem_type: 'Water Scarcity', priority: 'medium', latitude: 26.2389, longitude: 70.605, location: 'Thar Desert, Rajasthan' },
  { task_id: 'tsk-004', title: 'Landslide Preparedness Survey', problem_type: 'Landslide Risk', priority: 'medium', latitude: 11.6854, longitude: 76.132, location: 'Wayanad, Kerala' },
];

/**
 * GET /api/matching/task/:taskId
 * Returns top 5 volunteer matches for a specific task
 */
export const getMatchesForTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const model = await getModel();

    let task, volunteers;

    if (model) {
      const tasks = await model.getTasks();
      task = tasks.find(t => t.id === taskId);
      volunteers = await model.getVolunteers();
    } else {
      task = mockTasks.find(t => t.task_id === taskId);
      volunteers = mockVolunteers;
    }

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const matches = getTopMatches(task, volunteers, 5);
    res.json({
      task_id: taskId,
      task_title: task.title,
      matches: matches.map(m => ({
        id: m.id,
        name: m.displayName || m.name,
        skills: m.skills,
        matchScore: m.matchScore,
        matchedSkills: m.matchedSkills,
        tasks_completed: m.tasks_completed || 0,
      })),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/matching/volunteer/:volunteerId
 * Returns top 5 task suggestions for a specific volunteer
 */
export const getMatchesForVolunteer = async (req, res, next) => {
  try {
    const { volunteerId } = req.params;
    const model = await getModel();

    let volunteer, tasks;

    if (model) {
      volunteer = await model.getUser(volunteerId);
      const allTasks = await model.getTasks();
      tasks = allTasks.filter(t => t.status === 'open');
    } else {
      volunteer = mockVolunteers.find(v => v.id === volunteerId);
      tasks = mockTasks;
    }

    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }

    const scored = tasks.map(task => ({
      ...task,
      matchScore: calculateMatchScore(volunteer, task),
      requiredSkills: inferSkills(task.problem_type),
      matchedSkills: (volunteer.skills || []).filter(s => inferSkills(task.problem_type).includes(s)),
    }));

    scored.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      volunteer_id: volunteerId,
      volunteer_name: volunteer.displayName || volunteer.name,
      suggestions: scored.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};
