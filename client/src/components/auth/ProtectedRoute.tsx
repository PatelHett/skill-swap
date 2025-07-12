// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  requiredRole?: 'user' | 'admin';
  userRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAuthenticated = false,
  requiredRole,
  userRole = 'user',
}) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiLock className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-[#333333] mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-[#2196F3] text-[#0A192F] rounded-lg hover:bg-opacity-80 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;