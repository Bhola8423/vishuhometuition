/**
 * Enquiry / Lead API Service
 * Dedicated functions for Quick Enquiry and Leads from the website.
 */

import { apiFetch } from './config';
import { API_ENDPOINTS } from './endpoints';

/**
 * Submit an enquiry / tuition lead
 * @param {object} leadData - { name, phone, studentClass, board, subject, area, locality, preferredTime, time, details, note }
 */
export const submitLead = async (leadData) => {
  const res = await apiFetch(API_ENDPOINTS.LEAD, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to submit enquiry.');
  }
  return data;
};
