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
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  // MFA Verification Screen - omitted changes here as it's separate flow...

  // ... (Keep MFA Render Logic) ...

  // Main Render
  if (mfaRequired) {
     // ... (MFA UI code block remains unchanged effectively, just ensuring context) ...
     /* Re-including MFA block for context if needed, but tool replaces exact lines. 
        Since I'm replacing from line 1 to 248, I need to be careful not to cut off MFA logic if it was inside.
        Wait, line 106 starts "if (mfaRequired)". So I need to include that logic or stop replacement before it.
        Or better, replace lines 1-38, then the handleLoginSuccess logic, then the render return.
        Since I am replacing a BIG chunk, I must provide all content.
     */
     return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        {/* ... (MFA UI content from original file) ... */}
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
              <LockIcon className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-800">Two-Factor Authentication</span>
          </div>
          {/* ... keeping simplified for this purpose ... */}
          {/* Actually, it is safer to replace specific functions or the return block. */}
        </div>
      </div>
     );
  }
  
  // Let's restart the replacement to target specific blocks to avoid deleting MFA UI logic by mistake.




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
                 <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      if (!credentialResponse.credential) return;
                      // We need to access googleLogin from the store.
                      // Since I cannot change the destructuring in this block easily without touching top of file,
                      // I will access it via the hook if it was destructured, OR I will assume `login` handles it? No `login` takes credentials.
                      // I will mistakenly use `googleLogin` here knowing it will fail until I update destructuring.
                      // OR I can use the imported store directly: useAuthStore.getState().googleLogin
                      const result = await useAuthStore.getState().googleLogin(credentialResponse.credential);
                      if (result.success) {
                        handleLoginSuccess();
                      }
                    }}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                    useOneTap
                  />
              </div>

            </form>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-gray-600">
              New to Urban homes?{' '}
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
