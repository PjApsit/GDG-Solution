import express from 'express';
import { getAllTasks, getTaskById, createTask, assignTask, completeTaskById, cleanupTasks } from '../controllers/tasks.js';

const router = express.Router();

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.post('/:id/assign', assignTask);
router.post('/:id/complete', completeTaskById);
router.post('/cleanup', cleanupTasks);

export default router;
