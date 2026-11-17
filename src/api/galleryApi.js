/**
 * Gallery API service for fetching student & tuition media from DB
 */
import { apiFetch, apiUrl } from './config';
import { API_ENDPOINTS } from './endpoints';

/**
 * Fetch public gallery media list from database
 * @param {string} [kind='student-gallery']
 * @returns {Promise<Array>}
 */
export const fetchGalleryMedia = async (kind = 'student-gallery') => {
  try {
    const endpoint = API_ENDPOINTS.SITE_MEDIA || '/api/site-media';
    const res = await apiFetch(`${endpoint}?kind=${encodeURIComponent(kind)}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.warn(`Gallery media request returned status ${res.status}`);
      return [];
    }
    
    const data = await res.json().catch(() => ({}));
    return Array.isArray(data.items) ? data.items : [];
  } catch (err) {
    console.warn('Could not fetch gallery media from server, falling back to local defaults:', err);
    return [];
  }
};

/**
 * Convert relative or backend media URLs into valid full paths
 * @param {string} url
 * @returns {string}
 */
export const getMediaImageUrl = (url) => {
  if (!url) return '';
  if (
    url.startsWith('http://') || 
    url.startsWith('https://') || 
    url.startsWith('data:') || 
    url.startsWith('blob:')
  ) {
    return url;
  }
  return apiUrl(url);
};
