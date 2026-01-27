import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import OTPInput from '../components/auth/OTPInput';
import {
  LockIcon,
  EmailIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
  ChevronRightIcon,
  BuildingIcon
} from '../components/common/Icons';
import { useRecaptcha } from '../context/RecaptchaContext';
import axiosClient from '../api/axios.client';
import {
  generateCodeVerifier,
  generateCodeChallenge,
  storeCodeVerifier
} from '../utils/pkceUtils';
import { sanitizeText } from '../utils/xssUtils';



const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { executeRecaptcha } = useRecaptcha();
  const {
    login,
    verifyMFA,
    useBackupCode,
    cancelMFA,
    loading,
    error: authError,
    clearError,
    mfaRequired,
    mfaMethod
  } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBackupInput, setShowBackupInput] = useState(false);
  const [backupCode, setBackupCode] = useState('');
  const [sessionMessage, setSessionMessage] = useState('');

  useEffect(() => {
    // Check if redirected with a message or from a protected route
    if (location.state?.from) {
      setSessionMessage('Please log in to continue booking.');
    }
    if (location.state?.message) {
      setSessionMessage(location.state.message);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    clearError(); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('--- Login Form Submitted ---');
    console.log('Email:', formData.email);
    clearError();

    // Get reCAPTCHA token
    const recaptchaToken = await executeRecaptcha('login');
    console.log('reCAPTCHA token obtained');

    const result = await login({
      email: sanitizeText(formData.email),
      password: formData.password,
    }, recaptchaToken);

    console.log('Login result:', result);

    if (result.success && !result.mfaRequired) {
      console.log('Login successful, no MFA required. Redirecting...');
      handleLoginSuccess();
    } else if (result.mfaRequired) {
      console.log('MFA required. Switching to MFA screen.');
    }
  };

  const handleMFAComplete = async (otpCode) => {
    console.log('--- MFA Code Entered ---');
    clearError();
    const result = await verifyMFA(otpCode);
    console.log('MFA verification result:', result);
    
    if (result.success) {
      console.log('MFA successful. Redirecting...');
      handleLoginSuccess();
    }
  };

  const handleBackupCodeSubmit = async (e) => {
    e.preventDefault();
    console.log('--- Backup Code Submitted ---');
    clearError();
    
    const result = await useBackupCode(backupCode);
    console.log('Backup code result:', result);
    
    if (result.success) {
      console.log('Backup code successful. Redirecting...');
      handleLoginSuccess();
    }
  };

  const handleLoginSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      // Prioritize redirecting back to where the user came from
      if (location.state?.from) {
        navigate(location.state.from);
        return;
      }

      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state?.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    }, 1500);
  };

  const handleCancelMFA = () => {
    cancelMFA();
    setShowBackupInput(false);
    setBackupCode('');
  };


  // MFA Verification Screen
  if (mfaRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
              <LockIcon className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-800">Two-Factor Authentication</span>
          </div>

          {!showBackupInput ? (
            <>
              <p className="text-center text-gray-600 mb-6">
                Enter the 6-digit code from your authenticator app
              </p>

              {authError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                  {authError}
                </div>
              )}

              <div className="mb-8">
                <OTPInput
                  length={6}
                  onComplete={handleMFAComplete}
                  disabled={loading}
                  error={!!authError}
                />
              </div>

              {loading && (
                <div className="flex justify-center mb-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}

              <div className="text-center space-y-4">
                <button
                  type="button"
                  onClick={() => setShowBackupInput(true)}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  Use backup code instead
                </button>
                <div>
                  <button
                    type="button"
                    onClick={handleCancelMFA}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel and return to login
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-center text-gray-600 mb-6">
                Enter one of your backup codes
              </p>

              {authError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                  {authError}
                </div>
              )}

              <form onSubmit={handleBackupCodeSubmit} className="space-y-6">
                <input
                  type="text"
                  value={backupCode}
                  onChange={(e) => setBackupCode(e.target.value.toUpperCase())}
                  placeholder="Enter backup code"
                  className="w-full px-4 py-3 text-center text-lg font-mono uppercase tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  maxLength={8}
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading || backupCode.length < 8}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                  ) : (
                    'Verify Backup Code'
                  )}
                </button>
              </form>

              <div className="text-center mt-6 space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBackupInput(false);
                    setBackupCode('');
                    clearError();
                  }}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  Use authenticator app instead
                </button>
                <div>
                  <button
                    type="button"
                    onClick={handleCancelMFA}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel and return to login
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col bg-white">
        {/* Logo */}
        <div className="p-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg border-2 border-primary flex items-center justify-center">
              <BuildingIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Dorm Axis</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            {sessionMessage ? (
              <div className="mb-8 p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-center">
                <h1 className="text-2xl font-bold text-yellow-800 mb-2">Login Required</h1>
                <p className="text-yellow-700">{sessionMessage}</p>
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-600 mb-8">Log in to find your ideal dorm</p>
              </>
            )}

            {authError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {authError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <EmailIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-dark">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Log In
                    <ChevronRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      // Generate PKCE parameters
                      const verifier = generateCodeVerifier();
                      const challenge = await generateCodeChallenge(verifier);
                      
                      // Store for callback verification
                      storeCodeVerifier(verifier);
                      
                      // Get OAuth URL from backend
                      const response = await axiosClient.get('/auth/google/url', {
                        params: {
                          code_challenge: challenge,
                          code_challenge_method: 'S256'
                        }
                      });
                      
                      if (response.data.success) {
                        // Redirect to Google
                        window.location.href = response.data.data.authUrl;
                      }
                    } catch (error) {
                      console.error('Google Sign-In error:', error);
                    }
                  }}
                  className="flex items-center justify-center gap-3 w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">Continue with Google</span>
                </button>
              </div>

            </form>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-gray-600">
              New to Dorm Axis?{' '}
              <Link to="/signup" className="text-primary hover:text-primary-dark font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Room Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=1600&fit=crop&q=80"
          alt="Modern living room"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed bottom-8 right-8 bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 border border-green-200 animate-slide-in">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <CheckIcon className="w-5 h-5 text-green-600" />
          </div>
          <span className="text-sm font-medium text-gray-700">Login Successful!</span>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
