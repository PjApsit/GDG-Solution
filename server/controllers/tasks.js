import { getTasks, addTask, updateTask } from '../models/dummy.js';

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await getTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    // A real implementation would fetch the related event to generate the 'why' if not provided
    const newTask = await addTask(req.body);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const assignTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { volunteerId } = req.body;
    
    const updatedTask = await updateTask(id, { 
      volunteer_id: volunteerId,
      status: 'in_progress' 
    });
    
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};
