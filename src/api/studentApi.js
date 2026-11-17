/**
 * Student API Service
 * Dedicated functions for Student Registration operations.
 */

import { apiFetch } from './config';
import { API_ENDPOINTS } from './endpoints';

/**
 * Submit student tuition requirement registration
 * @param {FormData} formData - Multi-part form data containing student fields and documents
 */
export const submitStudentRegistration = async (formData) => {
  const res = await apiFetch(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: formData
  });

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    if (res.status === 413) throw new Error('File sizes are too large to upload together.');
    throw new Error('Registration endpoint unavailable.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok || !data.id) {
    throw new Error(data.error || 'Registration failed to save.');
  }
  return data;
};

/**
 * Check registration status by Registration ID
 * @param {string} id - Registration ID
 */
export const checkStudentStatus = async (id) => {
  const cleanId = String(id || '').trim().toUpperCase();
  const res = await apiFetch(`${API_ENDPOINTS.STATUS}?id=${encodeURIComponent(cleanId)}`, {
    headers: { 'accept': 'application/json' }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Registration ID not found in database.');
  }
  return data;
};
