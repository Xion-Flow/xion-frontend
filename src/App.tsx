import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { Navbar } from './components/Navbar';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { MyWorkPage } from './pages/MyWorkPage';
import { GuidePage } from './pages/GuidePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProfilePage } from './pages/ProfilePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; requireAdmin?: boolean; forbidAdmin?: boolean }> = ({ children, requireAdmin, forbidAdmin }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Authenticating session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  if (forbidAdmin && user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="app-container">
      {user && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace /> : <LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute forbidAdmin>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute forbidAdmin>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-work"
            element={
              <ProtectedRoute forbidAdmin>
                <MyWorkPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/guide"
            element={
              <ProtectedRoute>
                <GuidePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </main>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <AppContent />
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
