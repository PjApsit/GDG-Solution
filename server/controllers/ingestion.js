import { processIngestionBatch } from '../services/ingestion.js';

export const uploadFiles = async (req, res, next) => {
  try {
    const files = req.files || [];

    if (files.length === 0) {
      return res.status(400).json({ error: 'At least one supported file is required.' });
    }

    const result = await processIngestionBatch(files);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
