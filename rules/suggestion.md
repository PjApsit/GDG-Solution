# 🧠 GDG Solution — NGO Decision Intelligence System
Below are some suggestions for the project. Consider these as optional guidelines for designing but consider the stich design as main source for designing.
---

# 🎯 Overview

This system is a **Decision Intelligence + Coordination Platform** for NGOs.

It transforms messy real-world data into:
- Clear visibility (heatmaps, dashboards)
- Intelligent prioritization (scoring engine)
- Actionable decisions (task assignment)
- Transparent communication (social layer)

👉 This is NOT:
- A simple dashboard
- A volunteer listing platform

👉 This IS:
A system that helps NGOs **decide, act, and communicate impact**

---

# 🧱 Tech Stack (MANDATORY)

Frontend:
- React.js (Vite)
- JavaScript
- Tailwind CSS

Backend:
- Node.js
- Express.js

Database:
- Supabase (PostgreSQL)

Maps:
- Leaflet (React-Leaflet)

Charts:
- Recharts / Chart.js

---

# 📦 Package Rules

- Use npm ONLY
- Use exact versions (no ^)

Command:
npm install <package> --save-exact

- Include:
  - package.json
  - package-lock.json
  - .nvmrc

Node version:
20

---

# 📁 Project Structure

/client → React frontend  
/server → Node backend  

---

## Frontend Structure

client/
 ├── src/
 │   ├── components/
 │   ├── pages/
 │   ├── layouts/
 │   ├── services/
 │   ├── hooks/
 │   ├── utils/
 │   └── App.jsx

Rules:
- Functional components only
- Tailwind only
- No class components

---

## Backend Structure

server/
 ├── controllers/
 ├── routes/
 ├── services/
 ├── models/
 ├── middleware/
 ├── utils/
 └── app.js

Rules:
- MVC pattern
- Async/await only

---

# 👥 User Roles

1. Admin
2. NGO (Data Manager / Program Manager)
3. Volunteer

---

# 🧠 Core System Layers

### 1. Data Layer
- Upload PDFs, CSVs, field data
- Parse into structured format

### 2. Decision Layer (CORE)
- Priority scoring engine
- Heatmap visualization
- “Why this area?” explanations

### 3. Execution Layer
- Task creation
- Volunteer assignment
- Task tracking

### 4. Social Layer
- NGO posts
- Volunteer engagement
- Public visibility

---

# 🗂 Data Schema (Core Table: events)

| Field | Description |
|------|------------|
| id | Primary key |
| location | Area name |
| latitude | GPS |
| longitude | GPS |
| problem_type | Disease / issue |
| severity | 1–10 |
| urgency | 1–10 |
| affected_count | Number |
| date_recorded | Date |
| data_age_days | Derived |
| source | pdf/csv/api/field |
| priority_score | Computed |
| why | Explanation |

---

# ⚙️ Priority Scoring Logic

Based on:
- Severity
- Urgency
- Recency
- Affected count
- Accessibility (optional)

Output:
- priority_score
- why (text explanation)

Example:
"High severity + recent spike + low accessibility"


# 🏢 NGO Dashboard

Sidebar:
- Dashboard
- Projects
- Data
- Updates
- Insights
- Social

---

## Dashboard

### Heatmap
- Shows priority by location
- Color coded

### Priority List
- Ranked areas
- Includes “why”

### Decision Insights
- Top 3 urgent areas
- Explanation

---

## Projects
- Create project
- Upload data
- View insights
- Manage volunteers

---

## Data
- View uploaded files
- Parsed insights

---

## Updates
- News + trends
- Graphs

---

## Insights
- Risk alerts
- Resource gaps

---

## Social

Purpose:
- Share structured updates

Features:
- Create posts
- Link to project/location
- Volunteers can join

---

# 👤 Volunteer Dashboard

Sidebar:
- Dashboard
- My Work
- Social

---

## Dashboard

### Trends
- Disease/disaster charts
- News

### Popular NGOs
- Follow
- Join

### Suggested Tasks
- Based on:
  - Skill
  - Location
  - Urgency

Includes:
- “Why you?” explanation

---

## My Work

### Joined NGOs
- List

### Tasks
- Priority ordered
- Accept / Decline

### Active Tasks
- Status tracking

---

## Social
- NGO posts feed
- Join initiatives

---

# 📌 Task System

Fields:
- task_id
- ngo_id
- volunteer_id
- priority
- status

Flow:
1. NGO creates task
2. System suggests volunteers
3. Volunteer accepts/declines
4. Track progress

---

# 🔐 Auth & Security

- Supabase Auth
- Role-based access
- Protected routes

---

# 🌍 Environment Setup

Files:
/client/.env  
/server/.env  

Never hardcode secrets

---

# 🚀 Setup Instructions

Install:
npm install  
cd client && npm install  
cd ../server && npm install  

Run:
cd server && npm run dev  
cd client && npm run dev  

---

# 🧠 AI Development Rules

AI MUST:
- Follow structure strictly
- Install dependencies
- Use exact versions
- Keep modular code

AI MUST NOT:
- Change stack
- Skip setup
- Mix frontend/backend

---

# 🎨 UI Rules

- Clean NGO dashboard style
- No clutter
- Use semantic colors only
- Always show “why”

---

# ✅ Acceptance Principles

- Every priority must show reasoning
- Every task must be actionable
- Every page must be simple and clear
- System must guide decisions, not just display data

---

# 💡 Final Principle

"The problem is not lack of resources,
it is lack of visibility."

This system solves that.
