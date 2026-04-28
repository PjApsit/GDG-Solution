/**
 * Predict Routes — AI predictions for upcoming needs
 * POST /api/predict/needs — Analyze historical events and predict future needs
 */

import express from 'express';
import { predictNeeds } from '../services/gemini.js';
import geminiQueue from '../services/geminiQueue.js';

const router = express.Router();

router.post('/needs', async (req, res, next) => {
  try {
    const { events } = req.body;

    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ error: 'Provide an array of events in "events" field.' });
    }

    const prediction = await geminiQueue.add(() => predictNeeds(events));
    res.json(prediction);
  } catch (error) {
    next(error);
  }
});

export default router;
