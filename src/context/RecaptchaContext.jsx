import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const RecaptchaContext = createContext(null);

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export const RecaptchaProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't load if no site key is configured
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('reCAPTCHA site key not configured. Set VITE_RECAPTCHA_SITE_KEY in your .env file.');
      return;
    }

    // Check if script is already loaded
    if (window.grecaptcha) {
      setIsLoaded(true);
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Wait for grecaptcha to be ready
      window.grecaptcha.ready(() => {
        setIsLoaded(true);
      });
    };

    script.onerror = () => {
      setError('Failed to load reCAPTCHA');
      console.error('Failed to load reCAPTCHA script');
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      // Don't remove the script on unmount as it might be needed
    };
  }, []);

  /**
   * Execute reCAPTCHA and get a token
   * @param {string} action - The action name (e.g., 'login', 'register', 'contact')
   * @returns {Promise<string|null>} The reCAPTCHA token or null if not available
   */
  const executeRecaptcha = useCallback(async (action) => {
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('reCAPTCHA not configured, skipping verification');
      return null;
    }

    if (!isLoaded || !window.grecaptcha) {
      console.warn('reCAPTCHA not loaded yet');
      return null;
    }

    try {
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
      return token;
    } catch (err) {
      console.error('reCAPTCHA execution failed:', err);
      return null;
    }
  }, [isLoaded]);

  const value = {
    isLoaded,
    error,
    executeRecaptcha,
    isConfigured: !!RECAPTCHA_SITE_KEY,
  };

  return (
    <RecaptchaContext.Provider value={value}>
      {children}
    </RecaptchaContext.Provider>
  );
};

/**
 * Custom hook to use reCAPTCHA
 * @returns {{ isLoaded: boolean, error: string|null, executeRecaptcha: (action: string) => Promise<string|null>, isConfigured: boolean }}
 */
export const useRecaptcha = () => {
  const context = useContext(RecaptchaContext);
  if (!context) {
    throw new Error('useRecaptcha must be used within a RecaptchaProvider');
  }
  return context;
};

export default RecaptchaContext;
