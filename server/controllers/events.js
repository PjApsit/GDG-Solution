import { getEvents, getEvent, addEvent } from '../models/dummy.js';
import { calculatePriority } from '../services/priority.js';

export const getAllEvents = async (req, res, next) => {
  try {
    const events = await getEvents();
    res.json(events);
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const event = await getEvent(req.params.id);
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
    // Generate priority score and why explanation
    const { priority_score, why } = calculatePriority(req.body);
    
    const newEvent = await addEvent({
      ...req.body,
      priority_score,
      why
    });
    
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
};
