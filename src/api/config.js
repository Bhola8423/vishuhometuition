/**
 * Central API Configuration & HTTP Client
 * - Single source of truth for base URL
 * - Universal fetch wrapper with automatic token management
 */

// Base API URL:
// In local development (localhost / 127.0.0.1), relative URL '' routes through
// the Vite proxy in vite.config.js to bypass browser cross-origin CORS checks.
// In production, it defaults to 'https://vishuhometuition.in'.
// Base API URL:
// In local development or on the official domain (vishuhometuition.in),
// relative URL '' routes directly to the same-origin backend.
// Otherwise (e.g. Firebase hosting or preview deployments), it uses 'https://vishuhometuition.in'.
export const API_BASE = (typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.endsWith('vishuhometuition.in')
))
  ? (import.meta.env?.VITE_API_BASE ?? '')
  : (import.meta.env?.VITE_API_BASE || 'https://vishuhometuition.in');

/**
 * Get stored admin token from sessionStorage
 */
export const getAdminToken = () => {
  if (typeof window === 'undefined') return '';
  return (sessionStorage.getItem('vht_admin_token') || '').trim();
};

/**
 * Save or clear admin token in sessionStorage
 */
export const setAdminToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token) {
    sessionStorage.setItem('vht_admin_token', token.trim());
  } else {
    sessionStorage.removeItem('vht_admin_token');
  }
};

/**
 * Construct full URL from path
 */
export const apiUrl = (path = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
};

/**
 * Universal API fetcher:
 * Automatically injects authorization header (Bearer <token>) matching standard production API requests.
 */
export const apiFetch = async (path, options = {}) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Extract token from options.headers or sessionStorage
  let token = '';
  if (options.headers) {
    if (typeof options.headers.get === 'function') {
      token = (options.headers.get('authorization') || options.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
    } else {
      const auth = options.headers['Authorization'] || options.headers['authorization'] || '';
      token = String(auth).replace(/^Bearer\s+/i, '').trim();
    }
  }
  if (!token) {
    token = getAdminToken();
  }

  // Ensure headers object exists
  const headers = (options.headers && typeof options.headers.entries === 'function')
    ? Object.fromEntries(options.headers.entries())
    : { ...(options.headers || {}) };

  if (token) {
    if (!headers['Authorization'] && !headers['authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Construct target URL cleanly without injecting query passcodes
  const url = `${API_BASE}${cleanPath}`;

  return await fetch(url, {
    ...options,
    headers
  });
};

