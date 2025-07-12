// src/components/auth/ForgotPassword.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      // TODO: Integrate with backend
      console.log('Forgot password data:', data);
      setIsEmailSent(true);
      toast.success('Reset link sent to your email!');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A192F] to-[#112240] px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <FiMail className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#0A192F] mb-4">Check Your Email</h2>
            <p className="text-[#333333] mb-6">
              We've sent a password reset link to{' '}
              <span className="font-medium text-[#2196F3]">{getValues('email')}</span>
            </p>
            <p className="text-sm text-gray-600 mb-8">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setIsEmailSent(false)}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg text-[#333333] hover:bg-gray-50 transition-colors"
              >
                Try Again
              </button>
              <Link
                to="/login"
                className="flex items-center justify-center w-full py-3 px-4 bg-[#0A192F] text-white rounded-lg hover:bg-[#112240] transition-colors"
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A192F] to-[#112240] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#0A192F] mb-2">Forgot Password?</h2>
            <p className="text-[#333333] opacity-70">
              Don't worry, we'll send you reset instructions.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3] focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#0A192F] hover:bg-[#112240] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2196F3] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="flex items-center justify-center text-sm font-medium text-[#2196F3] hover:text-[#0A192F] transition-colors"
            >  
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;