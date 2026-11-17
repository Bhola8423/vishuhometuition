/**
 * Status Verification API Service
 * Dedicated functions for verifying registration IDs and card validity.
 */

import { apiFetch } from './config';
import { API_ENDPOINTS } from './endpoints';

/**
 * Verify registration ID and fetch approval status details
 * @param {string} id - Registration ID to verify
 */
export const verifyRegistrationStatus = async (id) => {
  const cleanId = String(id || '').trim().toUpperCase();
  if (!cleanId) {
    throw new Error('Please enter a valid Registration ID.');
  }

  const res = await apiFetch(`${API_ENDPOINTS.STATUS}?id=${encodeURIComponent(cleanId)}`, {
    headers: { 'accept': 'application/json' }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Registration ID not found in database.');
  }
  return data;
};
