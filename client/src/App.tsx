// src/App.tsx
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store/store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import { useAppSelector } from './hooks/redux';
import AppInitializer from './components/AppInitializer';
import './App.css';
import Profile from './pages/Profile';
import SwapRequestsPage from './pages/SwapRequestsPage';
import ShowSkills from './pages/ShowSkills';
import Login from './components/auth/Login';


// Temporary Dashboard component for authenticated users
const Dashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#0A192F] mb-4">
            Welcome back, {user?.username || 'User'}!
          </h1>
          <p className="text-[#333333] mb-6">You are successfully logged in.</p>
          
          {/* Display user info */}
          {user && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
              <h3 className="font-semibold text-[#0A192F] mb-3">Your Profile Summary</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>
                <p><strong>Profile:</strong> {user.isPublic ? 'Public' : 'Private'}</p>
                <p><strong>Skills Offered:</strong> {user.skillsOffered?.length || 0}</p>
                <p><strong>Skills Wanted:</strong> {user.skillsWanted?.length || 0}</p>
                <p><strong>Availability:</strong> {user.availability}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Auth Routes Component
const AuthRoutes = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} 
      />
      <Route 
        path="/forgot-password" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword />} 
      />
      
      {/* Protected routes */}
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/profile" 
        element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/show-user-profile" 
        element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/browse-skills" 
        element={isAuthenticated ? <ShowSkills /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/swap-request"
        element={isAuthenticated ? <SwapRequestsPage /> : <Navigate to="/login" replace />}
      />
      
      {/* Default routes */}
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
      <Route 
        path="*" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppInitializer>
          <div className="flex flex-col min-h-screen">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#2196F3',
                    color: '#FFFFFF',
                  },
                },
                error: {
                  style: {
                    background: '#f56565',
                    color: '#fff',
                  },
                },
              }}
            />
            <Navbar />
            <main className="flex-grow">
              <AuthRoutes />
            </main>
            <Footer />
          </div>
        </AppInitializer>
      </Router>
    </Provider>
  );
}

export default App;