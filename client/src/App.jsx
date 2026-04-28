import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NGOLayout from './layouts/NGOLayout';
import VolunteerLayout from './layouts/VolunteerLayout';

// NGO Pages
import NGODashboard from './pages/ngo/Dashboard';
import NGOSocial from './pages/ngo/Social';
import NGODataUpload from './pages/ngo/DataUpload';

// Volunteer Pages
import VolunteerDashboard from './pages/volunteer/Dashboard';

// Placeholder for unbuilt pages
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-64 border-2 border-dashed border-outline-variant rounded">
    <h2 className="text-h2 text-on-surface-variant">{title} - Coming Soon</h2>
  </div>
);

import Landing from './pages/Landing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        
        {/* NGO Routes */}
        <Route path="/ngo" element={<NGOLayout />}>
          <Route path="dashboard" element={<NGODashboard />} />
          <Route path="projects" element={<Placeholder title="Projects" />} />
          <Route path="data" element={<NGODataUpload />} />
          <Route path="updates" element={<Placeholder title="Updates" />} />
          <Route path="insights" element={<Placeholder title="Deep Insights" />} />
          <Route path="social" element={<NGOSocial />} />
        </Route>

        {/* Volunteer Routes */}
        <Route path="/volunteer" element={<VolunteerLayout />}>
          <Route path="dashboard" element={<VolunteerDashboard />} />
          <Route path="work" element={<Placeholder title="My Work" />} />
          <Route path="social" element={<NGOSocial />} /> {/* Reuse social for now */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
