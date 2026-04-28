import express from 'express';
import { getAllEvents, getEventById, createEvent, updateEventById, deleteEventById, checkDuplicate } from '../controllers/events.js';

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', createEvent);
router.put('/:id', updateEventById);
router.delete('/:id', deleteEventById);
router.post('/check-duplicate', checkDuplicate);

export default router;
