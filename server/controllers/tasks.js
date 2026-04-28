/**
 * Tasks Controller — CRUD + assignment with Firestore transactions
 * WHY: Uses transaction-based assignment to prevent race conditions (Q12).
 * Falls back to dummy data if Firestore is not configured.
 */

import * as firestoreModel from '../models/firestore.js';
import * as dummyModel from '../models/dummy.js';
import { adminDb } from '../config/firebase-admin.js';

const useFirestore = !!adminDb;
const model = useFirestore ? firestoreModel : dummyModel;

export const getAllTasks = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.mine && req.user) filters.ngo_id = req.user.uid;
    if (req.query.volunteer && req.user) filters.volunteer_id = req.user.uid;

    const tasks = await model.getTasks(filters);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = useFirestore
      ? await firestoreModel.getTask(req.params.id)
      : null;
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const newTask = await model.addTask(req.body, req.user?.uid);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const assignTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const volunteerId = req.body.volunteerId || req.user?.uid;

    if (!volunteerId) {
      return res.status(400).json({ error: 'volunteerId required.' });
    }

    if (useFirestore) {
      // Transaction-based assignment (Q12)
      const result = await firestoreModel.assignTaskTransaction(id, volunteerId);
      res.json(result);
    } else {
      const updatedTask = await dummyModel.updateTask(id, {
        volunteer_id: volunteerId,
        status: 'in_progress',
      });
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(updatedTask);
    }
  } catch (error) {
    if (error.message === 'Task already assigned') {
      return res.status(409).json({ error: error.message });
    }
    next(error);
  }
};

export const completeTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const volunteerId = req.user?.uid;

    if (useFirestore) {
      const result = await firestoreModel.completeTask(id, volunteerId);
      res.json(result);
    } else {
      const updatedTask = await dummyModel.updateTask(id, { status: 'completed' });
      res.json(updatedTask);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/tasks/cleanup
 * Reset abandoned tasks — for cron job (Q30)
 */
export const cleanupTasks = async (req, res, next) => {
  try {
    if (!useFirestore) {
      return res.json({ reset: 0, message: 'Cleanup requires Firestore.' });
    }
    const result = await firestoreModel.cleanupAbandonedTasks();
    res.json(result);
  } catch (error) {
    next(error);
  }
};
