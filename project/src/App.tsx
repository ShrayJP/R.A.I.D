import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import ResourceManagement from './pages/resource-management';
import Dashboard from './pages/Dashboard';
import DisasterIdentifier from './pages/DisasterIdentifier';
import ResourcePage from './pages/ResourcePage';
import AdminPanel from './pages/AdminPanel';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/','/login'];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/disaster-identifier" 
          element={
            <ProtectedRoute>
              <DisasterIdentifier />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/resource" 
          element={
            <ProtectedRoute>
              <ResourcePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/resource-management" 
          element={
            <ProtectedRoute>
              <ResourceManagement />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
