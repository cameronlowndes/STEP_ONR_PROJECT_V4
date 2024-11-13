// src/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Use AuthContext to get current user

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth(); // Access current user from AuthContext
  
  if (!currentUser) {
    // If the user is not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return children; // Render the protected route if user is logged in
};

export default ProtectedRoute;
