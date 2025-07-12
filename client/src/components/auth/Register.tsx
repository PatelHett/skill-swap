// src/components/auth/Register.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { registerUser, clearError } from '../../store/authSlice';
import { useUsernameCheck } from '../../hooks/useUsernameCheck';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');
  const username = watch('username');

  // Use the username check hook with debouncing
  const usernameCheck = useUsernameCheck(username, 500);

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    // Check if username is available before submitting
    if (usernameCheck.isAvailable === false) {
      toast.error('Please choose a different username');
      return;
    }

    if (usernameCheck.isChecking) {
      toast.error('Please wait while we check username availability');
      return;
    }

    try {
      // Filter out confirmPassword and acceptTerms before sending to API
      const { confirmPassword, acceptTerms, ...apiData } = data;
      
      await dispatch(registerUser(apiData)).unwrap();
      toast.success('Registration successful! Please login with your credentials.');
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error || 'Registration failed. Please try again.');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSubmit)(e);
  };

  // Function to get username input styling based on availability
  const getUsernameInputClasses = () => {
    let baseClasses = "block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white";
    
    if (usernameCheck.isAvailable === true) {
      return `${baseClasses} border-green-300 focus:ring-green-500`;
    } else if (usernameCheck.isAvailable === false) {
      return `${baseClasses} border-red-300 focus:ring-red-500`;
    } else {
      return `${baseClasses} border-gray-300 focus:ring-[#2196F3]`;
    }
  };

  // Function to render username status icon
  const renderUsernameStatusIcon = () => {
    if (usernameCheck.isChecking) {
      return <FiLoader className="h-5 w-5 text-blue-500 animate-spin" />;
    } else if (usernameCheck.isAvailable === true) {
      return <FiCheck className="h-5 w-5 text-green-500" />;
    } else if (usernameCheck.isAvailable === false) {
      return <FiX className="h-5 w-5 text-red-500" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A192F] to-[#112240] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0A192F] mb-2">Create Account</h2>
            <p className="text-[#333333] opacity-70">Join our skill exchange community</p>
          </div>

          {/* Form */}
          <form 
            onSubmit={handleFormSubmit}
            className="mt-8 space-y-5"
            noValidate
          >
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#333333] mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters',
                    },
                    maxLength: {
                      value: 20,
                      message: 'Username must be less than 20 characters',
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: 'Username can only contain letters, numbers, and underscores',
                    },
                    validate: () => {
                      if (usernameCheck.isAvailable === false) {
                        return 'Username is already taken';
                      }
                      return true;
                    },
                  })}
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="username"
                  className={getUsernameInputClasses()}
                  placeholder="Choose a username"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {renderUsernameStatusIcon()}
                </div>
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
              {/* Username availability message */}
              {!errors.username && usernameCheck.message && username && username.length >= 3 && (
                <p className={`mt-1 text-sm ${
                  usernameCheck.isAvailable === true 
                    ? 'text-green-600' 
                    : usernameCheck.isAvailable === false 
                    ? 'text-red-600' 
                    : 'text-gray-600'
                }`}>
                  {usernameCheck.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#333333] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain uppercase, lowercase, and number',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Create a password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-[#2196F3] transition-colors" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-[#2196F3] transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#333333] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowConfirmPassword(!showConfirmPassword);
                  }}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-[#2196F3] transition-colors" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-[#2196F3] transition-colors" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                {...register('acceptTerms', {
                  required: 'You must accept the terms and conditions',
                })}
                id="accept-terms"
                type="checkbox"
                className="h-4 w-4 text-[#2196F3] focus:ring-[#2196F3] border-gray-300 rounded mt-1"
                disabled={isLoading}
              />
              <label htmlFor="accept-terms" className="ml-2 block text-sm text-[#333333]">
                I agree to the{' '}
                <Link 
                  to="/terms" 
                  className="text-[#2196F3] hover:text-[#0A192F] transition-colors underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms and Conditions
                </Link>
                {' '}and{' '}
                <Link 
                  to="/privacy" 
                  className="text-[#2196F3] hover:text-[#0A192F] transition-colors underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="mt-1 text-sm text-red-600">{errors.acceptTerms.message}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || usernameCheck.isChecking || usernameCheck.isAvailable === false}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#0A192F] hover:bg-[#112240] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2196F3] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#333333]">Already have an account?</span>
              </div>
            </div>
          </div>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="font-medium text-[#2196F3] hover:text-[#0A192F] transition-colors"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;