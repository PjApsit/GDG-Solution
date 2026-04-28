/**
 * Scan Routes — AI-powered survey scanning endpoints
 * POST /api/scan/survey  — Single image scan
 * POST /api/scan/batch   — Batch scan (up to 10 images)
 */

import express from 'express';
import { scanSurvey, scanBatch } from '../controllers/scan.js';

const router = express.Router();

router.post('/survey', scanSurvey);
router.post('/batch', scanBatch);

export default router;
