import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Button from './common/Button';

interface NavLink {
  name: string;
  href: string;
  current?: boolean;
  type: 'link' | 'button';
}

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Mock authentication state - replace with your actual auth logic
  const isLoggedIn = true; // Change this to true to test logged in state
  const isLoginPage = location.pathname === '/login';

  const navigation: NavLink[] = [
    { name: 'Home', href: '/', current: location.pathname === '/', type: 'link' },
    { name: 'Swap requests', href: '/swap-requests', current: location.pathname === '/swap-requests', type: 'link' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white sticky top-0 shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">SkillSwap</span>
            </div>
          </div>

          {/* Desktop Navigation and Profile */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation Links - Only show if logged in */}
            {isLoggedIn && (
              <div className="hidden md:flex md:items-center md:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      item.current
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Profile Section - Only show if logged in */}
            {isLoggedIn ? (
              <div className="hidden md:flex md:items-center md:space-x-4">
                <Link to="/profile">
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt="Profile"
                    />
                    <span className="text-sm font-medium text-gray-700">John Doe</span>
                  </div>
                </div>
                </Link>
              </div>
            ) : (
              /* Login Button - Only show if not logged in */
              <div className="hidden md:block">
                {isLoginPage ? (
                  <Button to="/" variant="outline" size="sm">
                    Home
                  </Button>
                ) : (
                  <Button to="/login" variant="primary" size="sm">
                    Login
                  </Button>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
          {isLoggedIn ? (
            <>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    item.current
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Profile Section */}
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="Profile"
                  />
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">John Doe</div>
                    <div className="text-sm font-medium text-gray-500">john.doe@example.com</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Mobile Login Button - Only show if not logged in */
            <div className="px-4 py-3">
              {isLoginPage ? (
                <Button to="/" variant="outline" size="md" className="w-full">
                  Home
                </Button>
              ) : (
                <Button to="/login" variant="primary" size="md" className="w-full">
                  Login
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
