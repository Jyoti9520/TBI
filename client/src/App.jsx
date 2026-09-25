import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Layouts
import { DashboardLayout } from './layouts/DashboardLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Explore } from './pages/Explore';
import { FindMyTbi } from './pages/FindMyTbi';
import { Nearby } from './pages/Nearby';
import { Universities } from './pages/Universities';
import { Categories } from './pages/Categories';
import { Compare } from './pages/Compare';
import { Saved } from './pages/Saved';
import { TbiDetails } from './pages/TbiDetails';
import { SuggestTbi } from './pages/SuggestTbi';
import { Settings } from './pages/Settings';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminTbis } from './pages/AdminTbis';
import { AdminUsers } from './pages/AdminUsers';
import { AdminImport } from './pages/AdminImport';
import { NotFound } from './pages/NotFound';

export const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Standalone Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Auth Pages */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Main Application with Top Bar & Sidebar */}
        <Route element={<DashboardLayout />}>
          {/* Public Discovery Routes in App Layout */}
          <Route path="/explore" element={<Explore />} />
          <Route path="/find-tbi" element={<FindMyTbi />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/tbi/:id" element={<TbiDetails />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/nearby" element={<Nearby />} />

          {/* Authenticated Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <Saved />
              </ProtectedRoute>
            }
          />
          <Route
            path="/suggest"
            element={
              <ProtectedRoute>
                <SuggestTbi />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/tbis"
            element={
              <AdminRoute>
                <AdminTbis />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/import"
            element={
              <AdminRoute>
                <AdminImport />
              </AdminRoute>
            }
          />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;
