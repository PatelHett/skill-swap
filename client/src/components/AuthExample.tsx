// src/components/AuthExample.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginUser, logout } from '../store/authSlice';

const AuthExample: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const handleLogin = async () => {
    try {
      await dispatch(loginUser({ 
        email: 'user@example.com', 
        password: 'password123' 
      })).unwrap();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="p-6">
      {isAuthenticated ? (
        <div>
          <h2 className="text-xl font-bold text-[#0A192F]">Welcome, {user?.name}!</h2>
          <button
            onClick={handleLogout}
            className="mt-4 bg-[#0A192F] text-white px-4 py-2 rounded hover:bg-opacity-90"
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-[#0A192F]">Please Login</h2>
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="mt-4 bg-[#64FFDA] text-[#0A192F] px-4 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default AuthExample;