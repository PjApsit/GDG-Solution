/**
 * Dummy data models for development without valid Supabase keys.
 * In a real environment, this would use the @supabase/supabase-js client.
 */

let dummyEvents = [
  {
    id: 'evt-001',
    location: 'Dharavi, Mumbai',
    latitude: 19.0430,
    longitude: 72.8553,
    problem_type: 'Dengue Outbreak',
    severity: 9,
    urgency: 8,
    affected_count: 1200,
    date_recorded: '2026-04-20',
    data_age_days: 7,
    source: 'field',
    priority_score: 92,
    why: 'High severity (9/10) + recent data (7 days) + large affected population (1,200).',
  }
];

let dummyTasks = [
  {
    task_id: 'tsk-001',
    title: 'Emergency Medical Camp Setup',
    description: 'Set up a temporary medical camp.',
    ngo_id: 'ngo-001',
    ngo_name: 'HealthFirst India',
    volunteer_id: null,
    priority: 'critical',
    status: 'open',
    location: 'Dharavi, Mumbai',
    event_id: 'evt-001',
    created_at: '2026-04-21',
    why: 'Linked to highest-priority event (score 92).',
  }
];

export const getEvents = async () => {
  return dummyEvents;
};

export const getEvent = async (id) => {
  return dummyEvents.find(e => e.id === id);
};

export const addEvent = async (event) => {
  const newEvent = { ...event, id: `evt-${Date.now()}` };
  dummyEvents.push(newEvent);
  return newEvent;
};

export const getTasks = async () => {
  return dummyTasks;
};

export const addTask = async (task) => {
  const newTask = { ...task, task_id: `tsk-${Date.now()}`, status: 'open', created_at: new Date().toISOString() };
  dummyTasks.push(newTask);
  return newTask;
};

export const updateTask = async (id, updates) => {
  const index = dummyTasks.findIndex(t => t.task_id === id);
  if (index !== -1) {
    dummyTasks[index] = { ...dummyTasks[index], ...updates };
    return dummyTasks[index];
  }
  return null;
};
