// src/App.tsx
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store/store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import { useAppSelector } from './hooks/redux';
import './App.css';

// Temporary Dashboard component for authenticated users
const Dashboard = () => {
 return (
   <div className="bg-white py-16">
     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
       
       {/* Add more content to test scrolling */}
       <div className="mt-16 space-y-8">
         <div className="bg-gray-50 p-8 rounded-lg">
           <h2 className="text-2xl font-bold text-[#0A192F] mb-4">Recent Activity</h2>
           <p className="text-[#333333]">This is some sample content to test scrolling and footer visibility.</p>
         </div>
         
         <div className="bg-gray-50 p-8 rounded-lg">
           <h2 className="text-2xl font-bold text-[#0A192F] mb-4">Your Skills</h2>
           <p className="text-[#333333]">Manage your skills and find people to swap with.</p>
         </div>
         
         <div className="bg-gray-50 p-8 rounded-lg">
           <h2 className="text-2xl font-bold text-[#0A192F] mb-4">Community</h2>
           <p className="text-[#333333]">Connect with other members and share your expertise.</p>
         </div>
         
         <div className="bg-gray-50 p-8 rounded-lg">
           <h2 className="text-2xl font-bold text-[#0A192F] mb-4">Settings</h2>
           <p className="text-[#333333]">Customize your profile and preferences.</p>
         </div>
         
         <div className="bg-gray-50 p-8 rounded-lg">
           <h2 className="text-2xl font-bold text-[#0A192F] mb-4">Help & Support</h2>
           <p className="text-[#333333]">Get help with using the platform and find answers to common questions.</p>
         </div>
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
         <Navbar />
         <main className="flex-grow">
           <AuthRoutes />
         </main>
         <Footer />
       </div>
     </Router>
   </Provider>
 );
}
export default App;
