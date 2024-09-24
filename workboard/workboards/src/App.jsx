import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import BoardsPage from './pages/BoardsPage';
import CreateBoardPage from './pages/CreateBoardPage';
import { CSRFToken } from './components/CSRFToken';
import BoardDetailPage from './pages/BoardDetailPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route
      path="/boards"
      element={
        <ProtectedRoute>
          <BoardsPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/create-board"
      element={
        <ProtectedRoute>
          <CreateBoardPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/boards/:id"
      element={
        <ProtectedRoute>
          <BoardDetailPage />
        </ProtectedRoute>
      }
    />
    <Route path="/" element={<Navigate to="/boards" replace />} />
  </Routes>
);

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CSRFToken />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;