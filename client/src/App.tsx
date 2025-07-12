// src/App.tsx
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store/store';
import { Toaster } from 'react-hot-toast';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import { useAppSelector } from './hooks/redux';
import './App.css';

// Temporary Dashboard component for authenticated users
const Dashboard = () => {
 return (
   <div className="min-h-screen bg-white flex items-center justify-center">
     <div className="text-center">
       <h1 className="text-3xl font-bold text-[#0A192F] mb-4">Welcome to Skill Swap!</h1>
       <p className="text-[#333333] mb-6">You are successfully logged in.</p>
       <button
         onClick={() => {
           localStorage.removeItem('token');
           window.location.reload();
         }}
         className="px-6 py-3 bg-[#0A192F] text-white rounded-lg hover:bg-[#112240] transition-colors"
       >
         Logout
       </button>
     </div>
   </div>
 );
};

// Auth Routes Component
const AuthRoutes = () => {
 const { isAuthenticated } = useAppSelector((state) => state.auth);

 return (
   <Routes>
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
     <Route 
       path="/dashboard" 
       element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} 
     />
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
               color: '#0A192F',
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
       <AuthRoutes />
     </Router>
   </Provider>
 );
}

export default App;