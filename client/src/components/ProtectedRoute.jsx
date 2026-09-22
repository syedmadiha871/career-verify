import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    // Redirect unauthenticated general users to /auth page
    return <Navigate to="/auth" replace />;
  }

  return children;
}
