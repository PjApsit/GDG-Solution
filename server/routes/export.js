/**
 * Export Routes — CSV export for events and tasks
 * GET /api/export/events — Export all events as CSV
 * GET /api/export/tasks  — Export all tasks as CSV
 */

import express from 'express';
import { adminDb } from '../config/firebase-admin.js';

const router = express.Router();

// Dynamic import — use Firestore if configured, else dummy
const getModel = async () => {
  if (adminDb) {
    return await import('../models/firestore.js');
  }
  return await import('../models/dummy.js');
};

/**
 * Convert array of objects to CSV string
 */
function toCSV(data) {
  if (!data || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(h => {
      const val = row[h];
      if (val === null || val === undefined) return '';
      const str = String(val).replace(/"/g, '""');
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str;
    }).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
}

router.get('/events', async (req, res, next) => {
  try {
    const model = await getModel();
    const events = await model.getEvents();
    const csv = toCSV(events);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="events_export.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

router.get('/tasks', async (req, res, next) => {
  try {
    const model = await getModel();
    const tasks = await model.getTasks();
    const csv = toCSV(tasks);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="tasks_export.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
});

export default router;
