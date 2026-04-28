# NGO Decision Intelligence & Coordination Platform

This system transforms messy real-world data into clear visibility, intelligent prioritization, and actionable decisions for NGOs.

## 🧱 Architecture
- **Frontend**: React.js (Vite), Tailwind CSS, Firebase Auth, Firestore, Leaflet (Maps)
- **Backend**: Node.js, Express.js (REST API)
- **AI**: Google Gemini 1.5 Flash
- **Database**: Firestore with mock-data fallback when Firebase is not configured
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
Copy the example files first:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Then fill in the Firebase and Gemini values.

Client `client/.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Server `server/.env`:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="your_private_key_here"
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

## 🔌 Runtime APIs
- `GET /api/health`
- `GET /api/events`, `GET /api/events/:id`, `POST /api/events`, `PUT /api/events/:id`, `DELETE /api/events/:id`, `POST /api/events/check-duplicate`
- `GET /api/tasks`, `GET /api/tasks/:id`, `POST /api/tasks`, `POST /api/tasks/:id/assign`, `POST /api/tasks/:id/complete`, `POST /api/tasks/cleanup`
- `POST /api/scan/survey`, `POST /api/scan/batch`
- `GET /api/matching/task/:taskId`, `GET /api/matching/volunteer/:volunteerId`
- `GET /api/export/events`, `GET /api/export/tasks`
- `POST /api/predict/needs`
- `GET /api/volunteers`, `GET /api/volunteers/:id`, `GET /api/volunteers/suggested/:taskId`

Note: the client has a social UI, but there is no `/api/social` router mounted yet.

## 📦 PWA + Deployment (Phase 5)

### PWA (Client)
The client is configured as a PWA using `vite-plugin-pwa` and a web manifest.

Build and preview the PWA:
```bash
cd client
npm run build
npm run preview
```

Installable PWA requires HTTPS in production. Local dev uses Vite's dev server.

### Deployment
- **Client**: Deploy the Vite `dist/` folder to any static host (Vercel, Netlify, Firebase Hosting).
- **Server**: Deploy the Express API to a Node-compatible host (Render, Railway, Fly.io).
- Ensure `client` has `VITE_FIREBASE_*` env vars in the build environment.
- Ensure `server` has `FIREBASE_*` and `GEMINI_API_KEY` set at runtime.

### Dark Mode
The UI supports light/dark themes via CSS variables. Toggle theme from the sidebar.
