import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const auth = React.useContext(require('../context/AuthContext').AuthContext);

  if (!auth?.token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
