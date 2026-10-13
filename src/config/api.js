// Base API URL for backend calls:
// In local development (Vite dev server), relative URL '' routes through
// the local dev proxy configured in vite.config.js (/api -> https://vishuhometuition.in),
// which completely bypasses browser cross-origin CORS checks.
// In production at https://vishuhometuition.in, relative URLs are also same-origin.
export const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? (import.meta.env?.VITE_API_BASE ?? '')
  : (import.meta.env?.VITE_API_BASE || 'https://vishuhometuition.in');

/**
 * Universal API fetcher:
 * Handles token authorization via Bearer header, x-admin-token, and URL passcode fallback.
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
  if (!token && typeof window !== 'undefined') {
    token = (sessionStorage.getItem('vht_admin_token') || '').trim();
  }

  // Ensure headers object exists
  const headers = (options.headers && typeof options.headers.entries === 'function')
    ? Object.fromEntries(options.headers.entries())
    : { ...(options.headers || {}) };

  if (token) {
    if (!headers['Authorization'] && !headers['authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (!headers['x-admin-token']) {
      headers['x-admin-token'] = token;
    }
  }

  // Build target URL
  let url = `${API_BASE}${cleanPath}`;
  if (token && cleanPath.startsWith('/api/admin/')) {
    const separator = url.includes('?') ? '&' : '?';
    if (!url.includes('passcode=')) {
      url = `${url}${separator}passcode=${encodeURIComponent(token)}`;
    }
  }

  return await fetch(url, {
    ...options,
    headers
  });
};

export const apiUrl = (path = '') => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
};
