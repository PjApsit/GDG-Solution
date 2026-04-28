/**
 * Events Controller — CRUD for community need events
 * WHY: Uses Firestore model layer with priority scoring.
 * Falls back to dummy data if Firestore is not configured.
 */

import * as firestoreModel from '../models/firestore.js';
import * as dummyModel from '../models/dummy.js';
import { calculatePriority } from '../services/priority.js';
import { getGeohash } from '../services/geohash.js';
import { isDuplicate } from '../services/geohash.js';
import { adminDb } from '../config/firebase-admin.js';

// Use Firestore only if Admin SDK initialized successfully
const useFirestore = !!adminDb;
const model = useFirestore ? firestoreModel : dummyModel;

export const getAllEvents = async (req, res, next) => {
  try {
    const events = await model.getEvents(req.user ? { ngo_id: req.query.mine ? req.user.uid : undefined } : {});
    res.json(events);
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const event = await model.getEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { priority_score, why } = calculatePriority(req.body);

    // Add geohash if lat/lng provided
    let geohash = null;
    if (req.body.latitude && req.body.longitude) {
      geohash = getGeohash(req.body.latitude, req.body.longitude);
    }

    const newEvent = await model.addEvent({
      ...req.body,
      priority_score,
      why,
      geohash,
    }, req.user?.uid);

    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
};

export const updateEventById = async (req, res, next) => {
  try {
    if (!useFirestore) {
      return res.status(501).json({ error: 'Update requires Firestore configuration.' });
    }
    const updated = await model.updateEvent(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteEventById = async (req, res, next) => {
  try {
    if (!useFirestore) {
      return res.status(501).json({ error: 'Delete requires Firestore configuration.' });
    }
    await model.softDeleteEvent(req.params.id);
    res.json({ message: 'Event deactivated.' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/events/check-duplicate
 * Check if a new report is within 50m of existing events (Q22)
 */
export const checkDuplicate = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'latitude and longitude required.' });
    }

    const events = await model.getEvents();
    const existingPoints = events
      .filter(e => e.latitude && e.longitude)
      .map(e => ({ id: e.id, latitude: e.latitude, longitude: e.longitude, location: e.location }));

    const result = isDuplicate({ latitude, longitude }, existingPoints);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
