import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ROUTE_LOGIN } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner'; // Assuming you have a spinner

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading indicator while checking auth status
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <LoadingSpinner text="Authenticating..." />
      </div>
    );
  }

  if (!user) {
    // User not authenticated, redirect to login page
    return <Navigate to={ROUTE_LOGIN} replace />;
  }

  // User is authenticated, render the children or Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
