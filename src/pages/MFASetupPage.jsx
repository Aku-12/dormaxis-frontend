import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mfaAPI } from '../api';
import useAuthStore from '../store/useAuthStore';
import QRCodeDisplay from '../components/auth/QRCodeDisplay';
import OTPInput from '../components/auth/OTPInput';

const MFASetupPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuthStore();

  const [step, setStep] = useState(1); // 1: QR Code, 2: Verify, 3: Backup Codes
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [qrData, setQrData] = useState(null);
  const [backupCodes, setBackupCodes] = useState([]);
  const [mfaStatus, setMfaStatus] = useState(null);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchMFAStatus();
  }, [isAuthenticated, navigate]);

  const fetchMFAStatus = async () => {
    try {
      const response = await mfaAPI.getStatus();
      if (response.success) {
        setMfaStatus(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch MFA status:', err);
    }
  };

  const handleSetupStart = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await mfaAPI.setup();
      if (response.success) {
        setQrData({
          qrCode: response.data.qrCode,
          secret: response.data.secret
        });
        setStep(1);
      } else {
        setError(response.error || 'Failed to start MFA setup');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start MFA setup');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (code) => {
    setLoading(true);
    setError('');

    try {
      const response = await mfaAPI.verifySetup(code);
      if (response.success) {
        setBackupCodes(response.data.backupCodes);
        setStep(3);
        updateUser({ mfaEnabled: true });
      } else {
        setError(response.error || 'Invalid verification code');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMFA = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await mfaAPI.disable(disablePassword);
      if (response.success) {
        setMfaStatus({ ...mfaStatus, mfaEnabled: false });
        setShowDisableModal(false);
        setDisablePassword('');
        updateUser({ mfaEnabled: false });
      } else {
        setError(response.error || 'Failed to disable MFA');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to disable MFA');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    const password = prompt('Enter your password to regenerate backup codes:');
    if (!password) return;

    setLoading(true);
    setError('');

    try {
      const response = await mfaAPI.regenerateBackupCodes(password);
      if (response.success) {
        setBackupCodes(response.data.backupCodes);
        setStep(3);
        setMfaStatus(null); // Reset to show backup codes
      } else {
        setError(response.error || 'Failed to regenerate backup codes');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to regenerate backup codes');
    } finally {
      setLoading(false);
    }
  };

  const copyBackupCodes = async () => {
    try {
      await navigator.clipboard.writeText(backupCodes.join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadBackupCodes = () => {
    const content = `DormAxis - MFA Backup Codes
Generated: ${new Date().toLocaleString()}
Account: ${user?.email}

Keep these codes safe! Each code can only be used once.

${backupCodes.map((code, i) => `${i + 1}. ${code}`).join('\n')}

If you lose access to your authenticator app, use one of these codes to log in.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dormaxis-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // If MFA is already enabled, show status page
  if (mfaStatus?.mfaEnabled && step !== 3) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Two-Factor Authentication</h1>
            <p className="text-green-600 font-medium mt-2">Enabled</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Status Info */}
            <div className="mb-6">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Method</span>
                <span className="font-medium text-gray-800 capitalize">
                  {mfaStatus.mfaMethod === 'totp' ? 'Authenticator App' : 'Email'}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-gray-600">Backup Codes Remaining</span>
                <span className={`font-medium ${mfaStatus.remainingBackupCodes < 3 ? 'text-orange-600' : 'text-gray-800'}`}>
                  {mfaStatus.remainingBackupCodes} / 10
                </span>
              </div>
            </div>

            {/* Warning if low backup codes */}
            {mfaStatus.remainingBackupCodes < 3 && (
              <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-orange-800 text-sm">
                  <strong>Warning:</strong> You have few backup codes left. Generate new ones to ensure account access.
                </p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleRegenerateBackupCodes}
                disabled={loading}
                className="w-full py-3 border border-[#4A90B8] text-[#4A90B8] rounded-lg font-medium hover:bg-[#4A90B8] hover:text-white transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Generate New Backup Codes'}
              </button>

              <button
                onClick={() => setShowDisableModal(true)}
                className="w-full py-3 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-500 hover:text-white transition-colors"
              >
                Disable 2FA
              </button>
            </div>

            {/* Back Link */}
            <div className="mt-6 text-center">
              <Link to="/profile" className="text-sm text-gray-500 hover:text-gray-700">
                Back to Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Disable Modal */}
        {showDisableModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Disable Two-Factor Authentication</h3>
              <p className="text-gray-600 mb-6">
                This will make your account less secure. Enter your password to confirm.
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleDisableMFA}>
                <input
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-4"
                  required
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDisableModal(false);
                      setDisablePassword('');
                      setError('');
                    }}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !disablePassword}
                    className="flex-1 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Disabling...' : 'Disable 2FA'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#4A90B8] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
            {step === 3 ? (
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span>🔐</span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {step === 3 ? 'Setup Complete!' : 'Setup Two-Factor Authentication'}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 1 && 'Scan the QR code with your authenticator app'}
            {step === 2 && 'Enter the code from your authenticator app'}
            {step === 3 && 'Save your backup codes in a secure location'}
          </p>
        </div>

        {/* Progress Steps */}
        {step !== 3 && (
          <div className="flex items-center justify-center mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#4A90B8] text-white' : 'bg-gray-200 text-gray-500'}`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-[#4A90B8]' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#4A90B8] text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: QR Code */}
          {step === 1 && !qrData && (
            <div className="text-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-4xl">
                  <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Add extra security to your account
                </h3>
                <p className="text-gray-600 text-sm">
                  Two-factor authentication adds an extra layer of security by requiring a code from your phone when you log in.
                </p>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>You'll need:</strong> Google Authenticator, Authy, or any TOTP-compatible app
                </p>
              </div>

              <button
                onClick={handleSetupStart}
                disabled={loading}
                className="w-full bg-[#4A90B8] text-white py-3 rounded-lg font-semibold hover:bg-[#3A7A9A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    Get Started
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

          {step === 1 && qrData && (
            <QRCodeDisplay
              qrCode={qrData.qrCode}
              secret={qrData.secret}
              onContinue={() => setStep(2)}
              loading={loading}
            />
          )}

          {/* Step 2: Verify */}
          {step === 2 && (
            <div>
              <div className="mb-8">
                <OTPInput
                  length={6}
                  onComplete={handleVerify}
                  disabled={loading}
                  error={!!error}
                />
              </div>

              {loading && (
                <div className="flex justify-center mb-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90B8]"></div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-gray-500 hover:text-gray-700 text-sm"
              >
                Back to QR Code
              </button>
            </div>
          )}

          {/* Step 3: Backup Codes */}
          {step === 3 && (
            <div>
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-yellow-800 font-medium">Save these backup codes</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      If you lose your phone, you can use these codes to access your account. Each code can only be used once.
                    </p>
                  </div>
                </div>
              </div>

              {/* Backup Codes Grid */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="font-mono text-sm bg-gray-50 px-3 py-2 rounded text-center border"
                  >
                    {code}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={copyBackupCodes}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={downloadBackupCodes}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>

              <button
                onClick={() => navigate('/profile')}
                className="w-full bg-[#4A90B8] text-white py-3 rounded-lg font-semibold hover:bg-[#3A7A9A] transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Back Link */}
        {step !== 3 && (
          <div className="mt-6 text-center">
            <Link to="/profile" className="text-sm text-gray-500 hover:text-gray-700">
              Cancel and return to Profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MFASetupPage;
