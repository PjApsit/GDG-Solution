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
