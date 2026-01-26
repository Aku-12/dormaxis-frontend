import React, { useState } from 'react';

/**
 * QR Code Display Component
 * Shows QR code for MFA setup with manual secret option
 */
const QRCodeDisplay = ({ qrCode, secret, onContinue, loading }) => {
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="text-center">
      {/* QR Code */}
      <div className="bg-white p-4 rounded-xl inline-block shadow-md mb-6">
        <img
          src={qrCode}
          alt="MFA QR Code"
          className="w-48 h-48 mx-auto"
        />
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Scan with your authenticator app
        </h3>
        <p className="text-gray-600 text-sm">
          Use Google Authenticator, Authy, or any TOTP-compatible app
        </p>
      </div>

      {/* Manual Entry Option */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowSecret(!showSecret)}
          className="text-sm text-[#4A90B8] hover:text-[#3A7A9A] flex items-center justify-center gap-1 mx-auto"
        >
          {showSecret ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              Hide secret key
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Can't scan? Enter key manually
            </>
          )}
        </button>

        {showSecret && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Secret Key (enter this in your app):</p>
            <div className="flex items-center justify-center gap-2">
              <code className="font-mono text-sm bg-white px-3 py-2 rounded border select-all">
                {secret}
              </code>
              <button
                type="button"
                onClick={copySecret}
                className="p-2 text-gray-500 hover:text-[#4A90B8] transition-colors"
                title="Copy to clipboard"
              >
                {copied ? (
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <button
        type="button"
        onClick={onContinue}
        disabled={loading}
        className="w-full bg-[#4A90B8] text-white py-3 rounded-lg font-semibold hover:bg-[#3A7A9A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            Continue to Verification
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
};

export default QRCodeDisplay;
