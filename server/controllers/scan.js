/**
 * Scan Controller — Handles AI-powered survey scanning
 * WHY: Processes paper survey images through Gemini for data extraction,
 * then calculates priority and saves to Firestore.
 */

import { extractSurveyData } from '../services/gemini.js';
import geminiQueue from '../services/geminiQueue.js';
import { calculatePriority } from '../services/priority.js';

/**
 * POST /api/scan/survey
 * Accepts a base64 image, queues Gemini extraction, returns structured data
 */
export const scanSurvey = async (req, res, next) => {
  try {
    const { image, mimeType } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image data provided. Send base64 image in "image" field.' });
    }

    // Strip data URL prefix if present
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const type = mimeType || 'image/jpeg';

    // Queue the Gemini call to respect rate limits
    const extracted = await geminiQueue.add(() => extractSurveyData(base64Data, type));

    if (extracted.error) {
      return res.status(422).json({ error: extracted.error });
    }

    // Calculate priority score
    const { priority_score, why } = calculatePriority({
      severity: extracted.severity,
      urgency: extracted.urgency,
      affected_count: extracted.affected_count,
      data_age_days: 0, // just scanned = fresh data
    });

    const result = {
      ...extracted,
      priority_score,
      why,
      source: 'photo_scan',
      date_recorded: new Date().toISOString(),
      data_age_days: 0,
      is_active: true,
      schema_version: 1,
    };

    res.json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/scan/batch
 * Accepts an array of base64 images, processes sequentially
 */
export const scanBatch = async (req, res, next) => {
  try {
    const { images } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Provide an array of images in "images" field.' });
    }

    if (images.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 images per batch.' });
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < images.length; i++) {
      try {
        const base64Data = images[i].replace(/^data:image\/\w+;base64,/, '');
        const extracted = await geminiQueue.add(() => extractSurveyData(base64Data));

        if (extracted.error) {
          errors.push({ index: i, error: extracted.error });
        } else {
          const { priority_score, why } = calculatePriority({
            severity: extracted.severity,
            urgency: extracted.urgency,
            affected_count: extracted.affected_count,
            data_age_days: 0,
          });

          results.push({
            index: i,
            ...extracted,
            priority_score,
            why,
            source: 'photo_scan',
            date_recorded: new Date().toISOString(),
            data_age_days: 0,
          });
        }
      } catch (err) {
        errors.push({ index: i, error: err.message });
      }
    }

    res.json({ results, errors, total: images.length, successful: results.length });
  } catch (error) {
    next(error);
  }
};
