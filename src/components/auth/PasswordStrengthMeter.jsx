import React, { useMemo } from 'react';
import zxcvbn from 'zxcvbn';

/**
 * Password Strength Meter Component
 * Provides real-time visual feedback on password strength
 */
const PasswordStrengthMeter = ({ password, showRequirements = true }) => {
  // Calculate password strength using zxcvbn
  const strength = useMemo(() => {
    if (!password) return { score: 0, feedback: null };
    return zxcvbn(password);
  }, [password]);

  // Password requirements
  const requirements = [
    {
      id: 'length',
      label: 'At least 12 characters',
      met: password?.length >= 12,
    },
    {
      id: 'uppercase',
      label: 'One uppercase letter (A-Z)',
      met: /[A-Z]/.test(password || ''),
    },
    {
      id: 'lowercase',
      label: 'One lowercase letter (a-z)',
      met: /[a-z]/.test(password || ''),
    },
    {
      id: 'number',
      label: 'One number (0-9)',
      met: /\d/.test(password || ''),
    },
    {
      id: 'symbol',
      label: 'One special character (!@#$%^&*)',
      met: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password || ''),
    },
  ];

  const allRequirementsMet = requirements.every(req => req.met);

  // Strength configuration
  const strengthConfig = {
    0: { label: 'Very Weak', color: '#dc2626', bgColor: '#fecaca', width: '20%' },
    1: { label: 'Weak', color: '#ea580c', bgColor: '#fed7aa', width: '40%' },
    2: { label: 'Fair', color: '#ca8a04', bgColor: '#fef08a', width: '60%' },
    3: { label: 'Strong', color: '#16a34a', bgColor: '#bbf7d0', width: '80%' },
    4: { label: 'Very Strong', color: '#059669', bgColor: '#a7f3d0', width: '100%' },
  };

  const currentStrength = strengthConfig[strength.score] || strengthConfig[0];

  if (!password) {
    return showRequirements ? (
      <div className="mt-2">
        <p className="text-sm text-gray-500 mb-2">Password must contain:</p>
        <ul className="space-y-1">
          {requirements.map((req) => (
            <li key={req.id} className="flex items-center text-sm text-gray-400">
              <span className="w-4 h-4 mr-2 flex items-center justify-center">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                </svg>
              </span>
              {req.label}
            </li>
          ))}
        </ul>
      </div>
    ) : null;
  }

  return (
    <div className="mt-2">
      {/* Strength Bar */}
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300 ease-out rounded-full"
            style={{
              width: currentStrength.width,
              backgroundColor: currentStrength.color,
            }}
          />
        </div>
        <span
          className="text-xs font-medium min-w-[80px] text-right"
          style={{ color: currentStrength.color }}
        >
          {currentStrength.label}
        </span>
      </div>

      {/* Strength Segments */}
      <div className="flex gap-1 mb-3">
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className="h-1 flex-1 rounded-full transition-colors duration-200"
            style={{
              backgroundColor: strength.score >= level 
                ? strengthConfig[level].color 
                : '#e5e7eb',
            }}
          />
        ))}
      </div>

      {/* Requirements Checklist */}
      {showRequirements && (
        <ul className="space-y-1">
          {requirements.map((req) => (
            <li
              key={req.id}
              className={`flex items-center text-sm transition-colors duration-200 ${
                req.met ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <span className="w-4 h-4 mr-2 flex items-center justify-center">
                {req.met ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  </svg>
                )}
              </span>
              {req.label}
            </li>
          ))}
        </ul>
      )}

      {/* zxcvbn Feedback */}
      {strength.feedback?.warning && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-700">
          ⚠️ {strength.feedback.warning}
        </div>
      )}

      {strength.feedback?.suggestions?.length > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          💡 {strength.feedback.suggestions[0]}
        </div>
      )}

      {/* All requirements met indicator */}
      {allRequirementsMet && strength.score >= 3 && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Password meets all security requirements
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
