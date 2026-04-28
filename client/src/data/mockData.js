/**
 * Mock Data Layer
 * All static text, sample data, and placeholder content lives here.
 * WHY: Decouples data from components for easier testing and future API integration.
 */

// ── Events (core intelligence data) ──
export const mockEvents = [
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
    why: 'High severity (9/10) + recent data (7 days) + large affected population (1,200). Dense urban settlement limits medical access.',
  },
  {
    id: 'evt-002',
    location: 'Sundarbans, West Bengal',
    latitude: 21.9497,
    longitude: 89.1833,
    problem_type: 'Flood Displacement',
    severity: 8,
    urgency: 9,
    affected_count: 3400,
    date_recorded: '2026-04-22',
    data_age_days: 5,
    source: 'csv',
    priority_score: 89,
    why: 'Extreme urgency (9/10) + massive displacement (3,400 people) + low accessibility due to waterlogged terrain.',
  },
  {
    id: 'evt-003',
    location: 'Thar Desert, Rajasthan',
    latitude: 26.2389,
    longitude: 70.6050,
    problem_type: 'Water Scarcity',
    severity: 7,
    urgency: 7,
    affected_count: 8500,
    date_recorded: '2026-04-15',
    data_age_days: 12,
    source: 'pdf',
    priority_score: 78,
    why: 'Very large affected population (8,500) + chronic severity (7/10). Data is moderately aged (12 days), reducing immediacy.',
  },
  {
    id: 'evt-004',
    location: 'Wayanad, Kerala',
    latitude: 11.6854,
    longitude: 76.1320,
    problem_type: 'Landslide Risk',
    severity: 8,
    urgency: 6,
    affected_count: 450,
    date_recorded: '2026-04-25',
    data_age_days: 2,
    source: 'api',
    priority_score: 74,
    why: 'High severity (8/10) + very recent data (2 days). Moderate urgency (6/10) because monsoon onset is still 3 weeks away.',
  },
  {
    id: 'evt-005',
    location: 'Patna, Bihar',
    latitude: 25.6093,
    longitude: 85.1376,
    problem_type: 'Cholera Cases',
    severity: 6,
    urgency: 5,
    affected_count: 320,
    date_recorded: '2026-04-10',
    data_age_days: 17,
    source: 'field',
    priority_score: 52,
    why: 'Moderate severity (6/10) + lower urgency (5/10). Older data (17 days) and smaller cluster (320) reduce priority.',
  },
];

// ── Tasks ──
export const mockTasks = [
  {
    task_id: 'tsk-001',
    title: 'Emergency Medical Camp Setup',
    description: 'Set up a temporary medical camp with dengue testing kits and rehydration supplies.',
    ngo_id: 'ngo-001',
    ngo_name: 'HealthFirst India',
    volunteer_id: null,
    priority: 'critical',
    status: 'open',
    location: 'Dharavi, Mumbai',
    event_id: 'evt-001',
    created_at: '2026-04-21',
    why: 'Linked to highest-priority event (score 92). Immediate medical intervention needed for 1,200 affected.',
  },
  {
    task_id: 'tsk-002',
    title: 'Flood Relief Distribution',
    description: 'Coordinate distribution of food, water, and tarps to displaced families in Sundarbans.',
    ngo_id: 'ngo-002',
    ngo_name: 'Relief Wave',
    volunteer_id: 'vol-001',
    priority: 'high',
    status: 'in_progress',
    location: 'Sundarbans, West Bengal',
    event_id: 'evt-002',
    created_at: '2026-04-23',
    why: 'Extreme displacement (3,400 people) with limited road access. Requires waterway logistics.',
  },
  {
    task_id: 'tsk-003',
    title: 'Water Tanker Deployment',
    description: 'Deploy 5 water tankers to affected villages in Thar Desert region.',
    ngo_id: 'ngo-001',
    ngo_name: 'HealthFirst India',
    volunteer_id: 'vol-002',
    priority: 'medium',
    status: 'in_progress',
    location: 'Thar Desert, Rajasthan',
    event_id: 'evt-003',
    created_at: '2026-04-18',
    why: 'Large affected population (8,500) but chronic issue — not new emergency. Priority: sustained support.',
  },
  {
    task_id: 'tsk-004',
    title: 'Landslide Preparedness Survey',
    description: 'Conduct door-to-door survey for evacuation readiness in high-risk zones.',
    ngo_id: 'ngo-003',
    ngo_name: 'GreenEarth Foundation',
    volunteer_id: null,
    priority: 'medium',
    status: 'open',
    location: 'Wayanad, Kerala',
    event_id: 'evt-004',
    created_at: '2026-04-26',
    why: 'Preventive action — monsoon onset in 3 weeks. Early survey saves lives if landslides occur.',
  },
];

// ── Social Posts ──
export const mockPosts = [
  {
    id: 'post-001',
    ngo_id: 'ngo-001',
    ngo_name: 'HealthFirst India',
    ngo_avatar: 'HF',
    title: 'Dengue Response: Dharavi Update',
    content: 'Our medical team has screened 340 patients in the last 48 hours. 28 confirmed dengue cases have been referred to municipal hospitals. We urgently need more volunteers for community awareness drives.',
    location: 'Dharavi, Mumbai',
    project: 'Dharavi Health Initiative',
    created_at: '2026-04-25T10:30:00Z',
    likes: 45,
    comments: 12,
    volunteers_joined: 8,
  },
  {
    id: 'post-002',
    ngo_id: 'ngo-002',
    ngo_name: 'Relief Wave',
    ngo_avatar: 'RW',
    title: 'Sundarbans Flood: Day 5 Report',
    content: 'We have established 3 relief camps housing 1,200 displaced families. Food supplies are running low — requesting donations and volunteer support for logistics coordination.',
    location: 'Sundarbans, West Bengal',
    project: 'Sundarbans Flood Relief 2026',
    created_at: '2026-04-24T14:15:00Z',
    likes: 89,
    comments: 34,
    volunteers_joined: 23,
  },
  {
    id: 'post-003',
    ngo_id: 'ngo-003',
    ngo_name: 'GreenEarth Foundation',
    ngo_avatar: 'GE',
    title: 'Wayanad Preparedness Drive Launch',
    content: 'Launching a pre-monsoon preparedness campaign across 12 villages in Wayanad. Volunteers will help distribute emergency kits and conduct awareness sessions on evacuation routes.',
    location: 'Wayanad, Kerala',
    project: 'Monsoon Readiness 2026',
    created_at: '2026-04-26T09:00:00Z',
    likes: 23,
    comments: 7,
    volunteers_joined: 5,
  },
];

// ── NGOs ──
export const mockNGOs = [
  { id: 'ngo-001', name: 'HealthFirst India', sector: 'Healthcare', volunteers: 156, projects: 12, avatar: 'HF' },
  { id: 'ngo-002', name: 'Relief Wave', sector: 'Disaster Relief', volunteers: 230, projects: 8, avatar: 'RW' },
  { id: 'ngo-003', name: 'GreenEarth Foundation', sector: 'Environment', volunteers: 89, projects: 15, avatar: 'GE' },
];

// ── Volunteers ──
export const mockVolunteers = [
  { id: 'vol-001', name: 'Arun Sharma', skills: ['Logistics', 'First Aid'], location: 'Kolkata', active_tasks: 1, completed_tasks: 7 },
  { id: 'vol-002', name: 'Priya Desai', skills: ['Water Management', 'Community Outreach'], location: 'Jaipur', active_tasks: 1, completed_tasks: 12 },
  { id: 'vol-003', name: 'Kabir Ahmed', skills: ['Medical', 'Data Entry'], location: 'Mumbai', active_tasks: 0, completed_tasks: 5 },
];

// ── Dashboard Stats ──
export const dashboardStats = {
  totalEvents: 5,
  criticalAreas: 2,
  activeVolunteers: 47,
  tasksCompleted: 34,
  tasksOpen: 8,
  dataSourcesActive: 4,
};

// ── Sidebar Navigation ──
export const ngoSidebarLinks = [
  { label: 'Dashboard', path: '/ngo/dashboard', icon: 'LayoutDashboard' },
  { label: 'Scan Survey', path: '/ngo/scan', icon: 'ScanLine' },
  { label: 'Projects', path: '/ngo/projects', icon: 'FolderKanban' },
  { label: 'Data', path: '/ngo/data', icon: 'Database' },
  { label: 'Updates', path: '/ngo/updates', icon: 'Bell' },
  { label: 'Insights', path: '/ngo/insights', icon: 'TrendingUp' },
  { label: 'Social', path: '/ngo/social', icon: 'MessageSquare' },
];

export const volunteerSidebarLinks = [
  { label: 'Dashboard', path: '/volunteer/dashboard', icon: 'LayoutDashboard' },
  { label: 'My Work', path: '/volunteer/work', icon: 'ClipboardList' },
  { label: 'Certificate', path: '/volunteer/certificate', icon: 'Award' },
  { label: 'Social', path: '/volunteer/social', icon: 'MessageSquare' },
];

// ── Chart Data ──
export const trendData = [
  { month: 'Jan', dengue: 12, flood: 3, cholera: 5 },
  { month: 'Feb', dengue: 19, flood: 2, cholera: 8 },
  { month: 'Mar', dengue: 25, flood: 8, cholera: 6 },
  { month: 'Apr', dengue: 42, flood: 15, cholera: 11 },
];
