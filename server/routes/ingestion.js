import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadFiles } from '../controllers/ingestion.js';

const router = express.Router();

const MAX_FILES = 25;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const supportedExtensions = new Set([
  '.csv',
  '.xlsx',
  '.xls',
  '.pdf',
  '.txt',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: MAX_FILES,
    fileSize: MAX_FILE_SIZE_BYTES,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (!supportedExtensions.has(ext)) {
      const error = new Error(`Unsupported file type: ${file.originalname}`);
      error.statusCode = 400;
      cb(error);
      return;
    }
    cb(null, true);
  },
});

router.post('/upload', (req, res, next) => {
  upload.array('files', MAX_FILES)(req, res, (error) => {
    if (!error) {
      uploadFiles(req, res, next);
      return;
    }

    if (error instanceof multer.MulterError) {
      error.statusCode = 400;
      if (error.code === 'LIMIT_FILE_SIZE') {
        error.message = 'Each file must be 10 MB or smaller.';
      } else if (error.code === 'LIMIT_FILE_COUNT') {
        error.message = `Upload up to ${MAX_FILES} files at a time.`;
      }
    }

    next(error);
  });
});

export default router;
