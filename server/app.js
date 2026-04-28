import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventsRouter from './routes/events.js';
import tasksRouter from './routes/tasks.js';
import scanRouter from './routes/scan.js';
import matchingRouter from './routes/matching.js';
import exportRouter from './routes/export.js';
import predictRouter from './routes/predict.js';
import volunteersRouter from './routes/volunteers.js';
import { errorHandler } from './middleware/error.js';
import { optionalAuth } from './middleware/auth.js';
import { adminDb } from './config/firebase-admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased for base64 image uploads

// Optional auth on all routes — attaches req.user if token present
app.use(optionalAuth);

// Routes
app.use('/api/events', eventsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/scan', scanRouter);
app.use('/api/matching', matchingRouter);
app.use('/api/export', exportRouter);
app.use('/api/predict', predictRouter);
app.use('/api/volunteers', volunteersRouter);

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'ImpactFlow AI Server is running.',
    firebase: adminDb ? 'connected' : 'not configured (using dummy data)',
    gemini: !!process.env.GEMINI_API_KEY ? 'configured' : 'not configured',
  });
});

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Firebase: ${adminDb ? '✓ Connected' : '✗ Not configured (using dummy data)'}`);
  console.log(`Gemini: ${process.env.GEMINI_API_KEY ? '✓ Configured' : '✗ Not configured'}`);
});
