import express from 'express';
import { getAllEvents, getEventById, createEvent } from '../controllers/events.js';

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', createEvent);

export default router;
