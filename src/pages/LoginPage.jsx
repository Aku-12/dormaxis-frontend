import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import OTPInput from '../components/auth/OTPInput';

const LoginPage = () => {
  const navigate = useNavigate();
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
    clearError();

    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (result.success && !result.mfaRequired) {
      handleLoginSuccess();
    }
  };

  const handleMFAComplete = async (otpCode) => {
    clearError();
    const result = await verifyMFA(otpCode);
    
    if (result.success) {
      handleLoginSuccess();
    }
  };

  const handleBackupCodeSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    const result = await useBackupCode(backupCode);
    
    if (result.success) {
      handleLoginSuccess();
    }
  };

  const handleLoginSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
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
            <div className="w-10 h-10 bg-[#4A90B8] rounded-lg flex items-center justify-center text-white text-xl">
              🔐
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90B8]"></div>
                </div>
              )}

              <div className="text-center space-y-4">
                <button
                  type="button"
                  onClick={() => setShowBackupInput(true)}
                  className="text-sm text-[#4A90B8] hover:text-[#3A7A9A]"
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
                  className="w-full px-4 py-3 text-center text-lg font-mono uppercase tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90B8] focus:border-transparent"
                  maxLength={8}
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={loading || backupCode.length < 8}
                  className="w-full bg-[#4A90B8] text-white py-3 rounded-lg font-semibold hover:bg-[#3A7A9A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="text-sm text-[#4A90B8] hover:text-[#3A7A9A]"
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
            <div className="w-10 h-10 bg-[#4A90B8] rounded-lg flex items-center justify-center text-white text-xl">
              🏠
            </div>
            <span className="text-xl font-bold text-gray-800">Dorm Axis</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600 mb-8">Log in to find your ideal dorm</p>

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
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90B8] focus:border-transparent"
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
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90B8] focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
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
                    className="w-4 h-4 text-[#4A90B8] border-gray-300 rounded focus:ring-[#4A90B8]"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-[#4A90B8] hover:text-[#3A7A9A]">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4A90B8] text-white py-3 rounded-lg font-semibold hover:bg-[#3A7A9A] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Log In
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-gray-600">
              New to Urban homes?{' '}
              <Link to="/signup" className="text-[#4A90B8] hover:text-[#3A7A9A] font-medium">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block md:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400">
          <div className="w-full h-full flex items-center justify-center text-8xl">
            🏠
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed bottom-8 right-8 bg-white shadow-lg rounded-lg p-4 flex items-center gap-3 border border-green-200 animate-slide-in">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-700">Login Successful!</span>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
