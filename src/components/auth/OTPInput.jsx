import React, { useState, useRef, useEffect } from 'react';

/**
 * OTP Input Component
 * 6-digit input for MFA verification
 */
const OTPInput = ({ length = 6, onComplete, disabled = false, error = false }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element, index) => {
    const value = element.value;
    
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);

    // Move to next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Check if complete
    const otpString = newOtp.join('');
    if (otpString.length === length && !newOtp.includes('')) {
      onComplete(otpString);
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, '').slice(0, length);
        const newOtp = [...otp];
        digits.split('').forEach((digit, i) => {
          if (i < length) newOtp[i] = digit;
        });
        setOtp(newOtp);
        
        // Focus last filled or next empty
        const lastFilledIndex = newOtp.findLastIndex(d => d !== '');
        const focusIndex = Math.min(lastFilledIndex + 1, length - 1);
        inputRefs.current[focusIndex].focus();
        
        if (digits.length === length) {
          onComplete(digits);
        }
      });
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, length);
    
    const newOtp = [...otp];
    digits.split('').forEach((digit, i) => {
      if (i < length) newOtp[i] = digit;
    });
    setOtp(newOtp);
    
    if (digits.length === length) {
      onComplete(digits);
    }
  };

  const handleFocus = (index) => {
    inputRefs.current[index].select();
  };

  return (
    <div className="flex gap-3 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => (inputRefs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          onFocus={() => handleFocus(index)}
          disabled={disabled}
          className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-[#4A90B8] focus:border-transparent
            transition-all duration-200
            ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
        />
      ))}
    </div>
  );
};

export default OTPInput;
