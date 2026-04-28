/**
 * Volunteer Routes
 * GET /api/volunteers           — List all volunteers
 * GET /api/volunteers/:id       — Get specific volunteer
 * GET /api/volunteers/suggested/:taskId — Top matches for a task
 */

import express from 'express';
import { getAllVolunteers, getVolunteerById, getSuggestedVolunteers } from '../controllers/volunteers.js';

const router = express.Router();

router.get('/', getAllVolunteers);
router.get('/suggested/:taskId', getSuggestedVolunteers);
router.get('/:id', getVolunteerById);

export default router;
