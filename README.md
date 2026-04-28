# NGO Decision Intelligence & Coordination Platform

This system transforms messy real-world data into clear visibility, intelligent prioritization, and actionable decisions for NGOs.

## 🧱 Architecture
- **Frontend**: React.js (Vite), Tailwind CSS, Leaflet (Maps)
- **Backend**: Node.js, Express.js (REST API)
- **Database**: Supabase (PostgreSQL - Configured with mock data for now)
- **Design System**: Civil Intelligence System (Minimalist / Corporate Modern)

## 🚀 Setup Instructions

### Prerequisites
- Node.js version 20 (specified in `.nvmrc`)

### 1. Install Dependencies
Open a terminal and install dependencies for both client and server:

```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Environment Variables
Dummy `.env` files are already provided for the server to run locally without a real Supabase database.
For the client, you can create `client/.env` if you want to connect to a real Supabase instance:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run the Application
You need two terminals to run the frontend and backend simultaneously.

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
```
*(Server runs on http://localhost:3001)*

**Terminal 2 (Frontend React App):**
```bash
cd client
npm run dev
```
*(Client runs on http://localhost:5173)*

## 🧠 Core Features Implemented
1. **NGO Dashboard (`/ngo/dashboard`)**: Heatmap visualization, Decision Insights (top 3 urgent areas), and Priority Ranking with explicit "Why" explanations.
2. **Volunteer Dashboard (`/volunteer/dashboard`)**: Personalized task recommendations based on priority scoring.
3. **Social System (`/ngo/social` & `/volunteer/social`)**: NGO posts to mobilize volunteers.
4. **Task System**: Actionable tasks linked to priority events.
5. **Priority Scoring Engine**: Backend and frontend logic calculating scores based on severity, urgency, recency, and impact.

## 🧭 Code Walkthrough

### 1. App entry points
- `client/src/main.jsx` boots the React app and mounts `App` into the root DOM node.
- `client/src/App.jsx` defines the full route map with `react-router-dom`.
- The landing page lives at `/`, while NGO and volunteer experiences are split into nested routes under `/ngo/*` and `/volunteer/*`.

### 2. Frontend structure
- `client/src/layouts/NGOLayout.jsx` and `client/src/layouts/VolunteerLayout.jsx` provide the shared shell for each role.
- Each layout renders a fixed sidebar, role-specific navigation, and an `Outlet` where child pages appear.
- `client/src/pages/ngo/Dashboard.jsx` combines the main intelligence widgets: stats, heatmap, priority list, and decision insights.
- `client/src/pages/volunteer/Dashboard.jsx` focuses on suggested tasks and volunteer impact metrics.
- `client/src/pages/ngo/Social.jsx` reuses the social feed pattern for NGO communication.

### 3. Shared UI and data
- `client/src/components/` contains the reusable presentation blocks such as stat cards, task cards, heatmaps, and insight panels.
- `client/src/data/mockData.js` is the current source of truth for demo events, tasks, posts, NGOs, volunteers, and dashboard counts.
- The frontend is already structured so these mock objects can later be replaced by live API responses without changing the page layout logic.

### 4. Backend request flow
- `server/app.js` starts the Express server, enables CORS and JSON parsing, and mounts the API routers.
- `server/routes/events.js` and `server/routes/tasks.js` expose the event and task endpoints.
- `server/controllers/events.js` adds priority scoring when a new event is created.
- `server/controllers/tasks.js` handles task listing, creation, and volunteer assignment.
- `server/services/priority.js` contains the scoring engine that turns event data into a numeric `priority_score` plus a human-readable `why` explanation.

### 5. End-to-end data flow
1. A user opens the frontend and lands on `client/src/App.jsx`.
2. The chosen layout loads and renders the correct dashboard or social screen.
3. Dashboard pages read from `mockData.js` for the current demo state.
4. When the backend receives new event data, `calculatePriority()` scores it before storing the record.
5. The returned score and explanation are meant to drive ranking, task suggestions, and decision support views.

### 6. What is still placeholder
- Several routes in `client/src/App.jsx` are intentionally stubbed with a `Coming Soon` placeholder.
- `client/src/services/api.js` already defines the API client shape for events, tasks, social posts, and volunteers, but not every backend route is implemented yet.
- This means the app is visually complete for the main demo flows, while the deeper CRUD features are still being staged.

### 7. Suggested reading order
- Start with `README.md` for the product summary.
- Then open `client/src/App.jsx` to see the route map.
- Next read `client/src/pages/ngo/Dashboard.jsx` and `server/services/priority.js` together to understand how priority decisions are built.
- Finish with `server/app.js` and the controllers to see how the API layer is wired.
