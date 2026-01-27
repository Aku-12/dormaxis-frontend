import DOMPurify from 'dompurify';

/**
 * Sanitize HTML or plain text strings to prevent XSS attacks.
 * @param {string} dirty - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
export const sanitize = (dirty) => {
  if (typeof dirty !== 'string') return dirty;
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
};

/**
 * Sanitize plain text (removes all HTML tags).
 * @param {string} dirty - The string to sanitize.
 * @returns {string} - The sanitized plain text.
 */
export const sanitizeText = (dirty) => {
  if (typeof dirty !== 'string') return dirty;
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [] });
};
