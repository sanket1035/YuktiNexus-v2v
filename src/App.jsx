import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Guard
import { ProtectedRoutes } from './components/layout/ProtectedRoutes';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfileSetupPage } from './pages/ProfileSetupPage';
import { DashboardPage } from './pages/DashboardPage';
import { CareerIntelligencePage } from './pages/CareerIntelligencePage';
import { OpportunityHubPage } from './pages/OpportunityHubPage';



// Scroll to top on route change helper
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      
      {/* Route Definitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <MainLayout>
                <LandingPage />
              </MainLayout>
            }
          />
          <Route
            path="/login"
            element={
              <MainLayout>
                <LoginPage />
              </MainLayout>
            }
          />
          <Route
            path="/register"
            element={
              <MainLayout>
                <RegisterPage />
              </MainLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <MainLayout>
                <ForgotPasswordPage />
              </MainLayout>
            }
          />

          {/* Secure Profile Setup (Requires Auth but bypasses completed-profile checks) */}
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoutes requireProfileSetup={false}>
                <MainLayout>
                  <ProfileSetupPage />
                </MainLayout>
              </ProtectedRoutes>
            }
          />

          {/* Secure Dashboard Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes requireProfileSetup={true}>
                <DashboardLayout>
                  <DashboardPage />
                </DashboardLayout>
              </ProtectedRoutes>
            }
          />

          {/* Secure AI Career Intelligence Route */}
          <Route
            path="/roadmap"
            element={
              <ProtectedRoutes requireProfileSetup={true}>
                <DashboardLayout>
                  <CareerIntelligencePage />
                </DashboardLayout>
              </ProtectedRoutes>
            }
          />

          {/* Secure Opportunity Hub Route */}
          <Route
            path="/opportunities"
            element={
              <ProtectedRoutes requireProfileSetup={true}>
                <DashboardLayout>
                  <OpportunityHubPage />
                </DashboardLayout>
              </ProtectedRoutes>
            }
          />

          {/* Fallback Redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
