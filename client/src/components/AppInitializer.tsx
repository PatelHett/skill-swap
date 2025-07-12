// src/components/AppInitializer.tsx
import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getCurrentUser } from '../store/authSlice';

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { token, user, isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once when component mounts and we have a token but no user
    if (token && !user && !hasInitialized.current && !isLoading) {
      hasInitialized.current = true;
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, user, isLoading]);

  // Reset the flag when token changes (user logs out/in)
  useEffect(() => {
    if (!token) {
      hasInitialized.current = false;
    }
  }, [token]);

  // Show loading spinner while fetching user data on initial load
  if (token && !user && isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2196F3] mx-auto"></div>
          <p className="mt-4 text-[#333333]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppInitializer;