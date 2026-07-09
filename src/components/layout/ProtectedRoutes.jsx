import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LoadingScreen } from '../common/LoadingScreen';

export const ProtectedRoutes = ({ children, requireProfileSetup = true }) => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (location.pathname === '/profile-setup') {
    // If they have completed profile setup, prevent access to profile setup page and redirect to dashboard
    if (userProfile && !userProfile.isNewUser && userProfile.college) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  }

  // Force profile setup if the profile details are incomplete or marked as new user
  const needsProfileSetup = userProfile?.isNewUser || !userProfile?.college;
  if (requireProfileSetup && needsProfileSetup) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
};
