import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCodeVerifier, clearCodeVerifier } from '../utils/pkceUtils';
import useAuthStore from '../store/useAuthStore';
import axiosClient from '../api/axios.client';
import { BuildingIcon, CheckIcon } from '../components/common/Icons';

const GoogleCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const hasRun = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      try {
        console.log('=== OAuth Callback Started ===');
        console.log('Full URL:', window.location.href);
        
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');

        console.log('Authorization code:', code ? `${code.substring(0, 30)}...` : 'NONE');
        console.log('Error param:', errorParam);

        if (errorParam) {
          const errorDesc = searchParams.get('error_description') || 'Google authentication was cancelled';
          console.error('OAuth Error from Google:', errorParam, errorDesc);
          setError(errorDesc);
          setStatus('error');
          return;
        }

        if (!code) {
          console.error('No authorization code in URL');
          setError('No authorization code received');
          setStatus('error');
          return;
        }

        // Get stored PKCE verifier
        const codeVerifier = getCodeVerifier();
        console.log('Code verifier from localStorage:', codeVerifier ? `${codeVerifier.substring(0, 15)}...` : 'NONE');

        if (!codeVerifier) {
          console.error('No code verifier found in localStorage');
          setError('No code verifier found. Please try signing in again.');
          setStatus('error');
          return;
        }

        console.log('Sending code exchange request to backend...');

        // Exchange code for tokens
        const response = await axiosClient.post('/auth/google/callback', {
          code,
          code_verifier: codeVerifier
        });

        console.log('Backend response:', response.data);

        // Clear verifier after use
        clearCodeVerifier();

        if (response.data.success) {

          // Update auth store
          const { user, token } = response.data.data;
          useAuthStore.setState({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            mfaRequired: false,
            mfaTempToken: null,
          });

          setStatus('success');
          
          // Redirect after short delay
          setTimeout(() => {
            if (user.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/');
            }
          }, 1500);
        } else {
          setError(response.data.error || 'Authentication failed');
          setStatus('error');
        }
      } catch (err) {
        console.error('Google callback error:', err);
        setError(err.response?.data?.error || 'Authentication failed. Please try again.');
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <BuildingIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">Dorm Axis</span>
        </div>

        {status === 'processing' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing Sign In</h2>
            <p className="text-gray-600">Please wait while we verify your Google account...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Sign In Successful!</h2>
            <p className="text-gray-600">Redirecting you to the dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">❌</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Sign In Failed</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Return to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
