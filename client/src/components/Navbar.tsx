// src/components/Navbar.tsx
import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { logoutUser } from '../store/authSlice';
import Button from './common/Button';

interface NavLink {
  name: string;
  href: string;
  current?: boolean;
  type: 'link' | 'button';
}

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Get auth state from Redux
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);
  
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isAuthPage = isLoginPage || isRegisterPage;

  const navigation: NavLink[] = [
    { name: 'Dashboard', href: '/dashboard', current: location.pathname === '/dashboard', type: 'link' },
    { name: 'Browse Skills', href: '/browse', current: location.pathname === '/browse', type: 'link' },
    { name: 'My Requests', href: '/requests', current: location.pathname === '/requests', type: 'link' },
    { name: 'Profile', href: '/profile', current: location.pathname === '/profile', type: 'link' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
      console.error('Logout error:', error);
    }
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Get user display name
  const getUserDisplayName = () => {
    return user?.username || 'User';
  };

  // Get user avatar (use first letter of username as fallback)
  const getUserAvatar = () => {
    if (user?.profilePhoto) {
      return user.profilePhoto;
    }
    return null;
  };

  const getUserInitial = () => {
    return getUserDisplayName().charAt(0).toUpperCase();
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-[#2196F3] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="ml-2 text-xl font-bold text-[#0A192F]">SkillSwap</span>
            </Link>
          </div>

          {/* Desktop Navigation and Profile */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation Links - Only show if logged in */}
            {isAuthenticated && (
              <div className="hidden md:flex md:items-center md:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      item.current
                        ? 'border-[#2196F3] text-[#0A192F]'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Profile Section - Only show if logged in */}
            {isAuthenticated ? (
              <div className="hidden md:flex md:items-center md:space-x-4">
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2196F3] p-1 hover:bg-gray-50 transition-colors duration-200"
                  >
                    {getUserAvatar() ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={getUserAvatar()!}
                        alt="Profile"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-[#2196F3] flex items-center justify-center">
                        <span className="text-white font-medium text-sm">{getUserInitial()}</span>
                      </div>
                    )}
                    <span className="font-medium text-[#333333]">{getUserDisplayName()}</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        disabled={isLoading}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
                      >
                        {isLoading ? 'Signing out...' : 'Sign out'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Auth Buttons - Only show if not logged in */
              <div className="hidden md:flex md:items-center md:space-x-3">
                {isAuthPage ? (
                  <Button to="/dashboard" variant="outline" size="sm">
                    Home
                  </Button>
                ) : (
                  <>
                    <Button to="/login" variant="outline" size="sm">
                      Login
                    </Button>
                    <Button to="/register" variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2196F3] transition-colors duration-200"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
          {/* Mobile Navigation Links - Only show if logged in */}
          {isAuthenticated ? (
            <>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${
                    item.current
                      ? 'bg-blue-50 border-[#2196F3] text-[#2196F3]'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Profile Section */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4 mb-3">
                  {getUserAvatar() ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={getUserAvatar()!}
                      alt="Profile"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-[#2196F3] flex items-center justify-center">
                      <span className="text-white font-medium">{getUserInitial()}</span>
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{getUserDisplayName()}</div>
                    <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                  </div>
                </div>
                
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    disabled={isLoading}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
                  >
                    {isLoading ? 'Signing out...' : 'Sign out'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Mobile Auth Buttons - Only show if not logged in */
            <div className="px-4 py-3 space-y-2">
              {isAuthPage ? (
                <Button to="/dashboard" variant="outline" size="md" className="w-full">
                  Home
                </Button>
              ) : (
                <>
                  <Button to="/login" variant="outline" size="md" className="w-full">
                    Login
                  </Button>
                  <Button to="/register" variant="primary" size="md" className="w-full">
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;