import express from 'express';
import { getAllTasks, createTask, assignTask } from '../controllers/tasks.js';

const router = express.Router();

router.get('/', getAllTasks);
router.post('/', createTask);
router.post('/:id/assign', assignTask);

export default router;
