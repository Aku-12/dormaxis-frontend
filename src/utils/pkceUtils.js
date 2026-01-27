/**
 * PKCE (Proof Key for Code Exchange) utilities for OAuth 2.0
 */

/**
 * Generate a cryptographically random code verifier
 * @returns {string} Base64URL encoded code verifier
 */
export const generateCodeVerifier = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
};

/**
 * Generate code challenge from verifier using SHA-256
 * @param {string} verifier - The code verifier
 * @returns {Promise<string>} Base64URL encoded code challenge
 */
export const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(digest));
};

/**
 * Base64URL encode a Uint8Array
 * @param {Uint8Array} buffer 
 * @returns {string}
 */
const base64URLEncode = (buffer) => {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Store PKCE verifier in localStorage (persists across page navigation)
 * @param {string} verifier 
 */
export const storeCodeVerifier = (verifier) => {
  localStorage.setItem('oauth_code_verifier', verifier);
};

/**
 * Get PKCE verifier from localStorage
 * @returns {string|null}
 */
export const getCodeVerifier = () => {
  return localStorage.getItem('oauth_code_verifier');
};

/**
 * Remove PKCE verifier from localStorage
 */
export const clearCodeVerifier = () => {
  localStorage.removeItem('oauth_code_verifier');
};


/**
 * Generate state parameter for CSRF protection
 * @returns {string}
 */
export const generateState = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
};

/**
 * Store state in localStorage (persists across page navigation)
 * @param {string} state 
 */
export const storeState = (state) => {
  localStorage.setItem('oauth_state', state);
};

/**
 * Get and remove state from localStorage
 * @returns {string|null}
 */
export const getState = () => {
  const state = localStorage.getItem('oauth_state');
  localStorage.removeItem('oauth_state');
  return state;
};

