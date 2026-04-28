/**
 * Volunteers Controller — Volunteer matching and management
 * WHY: Handles volunteer-to-task matching using Firestore data.
 */

import { getVolunteers, getUser } from '../models/firestore.js';
import { getTasks } from '../models/firestore.js';
import { getTopMatches, calculateMatchScore, inferSkills } from '../services/matching.js';
import { adminDb } from '../config/firebase-admin.js';

/**
 * GET /api/volunteers
 * Returns all active volunteers
 */
export const getAllVolunteers = async (req, res, next) => {
  try {
    if (!adminDb) {
      return res.status(501).json({
        error: 'Volunteer endpoints require Firestore configuration.',
        hint: 'Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in server/.env',
      });
    }
    const volunteers = await getVolunteers();
    res.json(volunteers);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/volunteers/:id
 * Returns a specific volunteer
 */
export const getVolunteerById = async (req, res, next) => {
  try {
    if (!adminDb) {
      return res.status(501).json({
        error: 'Volunteer endpoints require Firestore configuration.',
        hint: 'Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in server/.env',
      });
    }
    const volunteer = await getUser(req.params.id);
    if (!volunteer || volunteer.role !== 'volunteer') {
      return res.status(404).json({ error: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/volunteers/suggested/:taskId
 * Returns top 5 volunteer matches for a task
 */
export const getSuggestedVolunteers = async (req, res, next) => {
  try {
    if (!adminDb) {
      return res.status(501).json({
        error: 'Volunteer endpoints require Firestore configuration.',
        hint: 'Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in server/.env',
      });
    }
    const { taskId } = req.params;
    const tasks = await getTasks();
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const volunteers = await getVolunteers();
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
