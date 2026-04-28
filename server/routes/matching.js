/**
 * Matching Routes — Smart volunteer-task matching endpoints
 * GET /api/matching/task/:taskId          — Top 5 volunteers for a task
 * GET /api/matching/volunteer/:volunteerId — Top 5 tasks for a volunteer
 */

import express from 'express';
import { getMatchesForTask, getMatchesForVolunteer } from '../controllers/matching.js';

const router = express.Router();

router.get('/task/:taskId', getMatchesForTask);
router.get('/volunteer/:volunteerId', getMatchesForVolunteer);

export default router;
