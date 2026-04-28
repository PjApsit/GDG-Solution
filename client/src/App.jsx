import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NGOLayout from './layouts/NGOLayout';
import VolunteerLayout from './layouts/VolunteerLayout';

// Auth Pages
import Landing from './pages/Landing';
import Login from './pages/Login';

// NGO Pages
import NGODashboard from './pages/ngo/Dashboard';
import NGOSocial from './pages/ngo/Social';
import ScanSurvey from './pages/ngo/ScanSurvey';
import DataUpload from './pages/ngo/DataUpload';
import DataManagement from './pages/ngo/DataManagement';
import Projects from './pages/ngo/Projects';
import Insights from './pages/ngo/Insights';
import Updates from './pages/ngo/Updates';

// Volunteer Pages
import VolunteerDashboard from './pages/volunteer/Dashboard';
import MyWork from './pages/volunteer/MyWork';
import Certificate from './pages/volunteer/Certificate';
import ReportNeed from './pages/volunteer/ReportNeed';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* NGO Routes — Protected */}
          <Route path="/ngo" element={<NGOLayout />}>
            <Route path="dashboard" element={<NGODashboard />} />
            <Route path="scan" element={<DataUpload />} />
            <Route path="projects" element={<Projects />} />
            <Route path="data" element={<DataManagement />} />
            <Route path="updates" element={<Updates />} />
            <Route path="insights" element={<Insights />} />
            <Route path="social" element={<NGOSocial />} />
          </Route>

          {/* Volunteer Routes — Protected */}
          <Route path="/volunteer" element={<VolunteerLayout />}>
            <Route path="dashboard" element={<VolunteerDashboard />} />
            <Route path="work" element={<MyWork />} />
            <Route path="report" element={<ReportNeed />} />
            <Route path="certificate" element={<Certificate />} />
            <Route path="social" element={<NGOSocial />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
