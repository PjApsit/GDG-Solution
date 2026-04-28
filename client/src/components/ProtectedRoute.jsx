/**
 * ProtectedRoute — Auth route guard
 * WHY: Prevents unauthenticated users from accessing dashboard pages.
 * Also enforces role-based access (NGO pages vs Volunteer pages).
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isProfileComplete, role, loading } = useAuth();
  const location = useLocation();

  // Show nothing while auth state is loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-body-base text-on-surface-variant">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but no profile → redirect to role selection
  if (!isProfileComplete) {
    return <Navigate to="/login" state={{ needsRole: true }} replace />;
  }

  // Check role if required
  if (requiredRole && role !== requiredRole) {
    const redirectPath = role === 'ngo' ? '/ngo/dashboard' : '/volunteer/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
