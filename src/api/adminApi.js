/**
 * Admin API Service
 * Dedicated functions for all Admin panel operations.
 */

import { apiFetch, apiUrl } from './config';
import { API_ENDPOINTS } from './endpoints';

/**
 * Fetch all registrations for the admin panel
 * @param {string} token - Admin authorization token
 * @param {object} [params] - Optional query parameters: { type, status, q }
 */
export const fetchAdminRegistrations = async (token, params = {}) => {
  const query = new URLSearchParams();
  if (params.type) query.set('type', params.type);
  if (params.status) query.set('status', params.status);
  if (params.q) query.set('q', params.q);

  const qs = query.toString() ? `?${query.toString()}` : '';
  const res = await apiFetch(`${API_ENDPOINTS.ADMIN.LIST}${qs}`, {
    headers: {
      'authorization': `Bearer ${token}`
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to fetch registrations.');
  }
  return data;
};

/**
 * Fetch full details for a specific registration
 * @param {string} id - Registration ID (e.g. VHT-T2500)
 * @param {string} token - Admin authorization token
 */
export const fetchAdminRegistrationDetail = async (id, token) => {
  const res = await apiFetch(`${API_ENDPOINTS.ADMIN.DETAIL}?id=${encodeURIComponent(id)}`, {
    headers: {
      'authorization': `Bearer ${token}`
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Could not fetch registration details.');
  }
  return data;
};

/**
 * Update operational status of a registration
 * @param {object} payload - { id, status, active, paymentStatus, note }
 * @param {string} token - Admin authorization token
 */
export const updateRegistrationStatus = async ({ id, status, active = true, paymentStatus, note }, token) => {
  const body = { id, status, active };
  if (paymentStatus !== undefined) body.paymentStatus = paymentStatus;
  if (note !== undefined) body.note = note;

  const res = await apiFetch(API_ENDPOINTS.ADMIN.UPDATE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update status.');
  }
  return data;
};

/**
 * Edit registration record details
 * @param {object} payload - { id, name, phone, email, payload }
 * @param {string} token - Admin authorization token
 */
export const editRegistrationDetails = async (payload, token) => {
  const res = await apiFetch(API_ENDPOINTS.ADMIN.EDIT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save edited details.');
  }
  return data;
};

/**
 * Fetch live website settings/content (CMS)
 * @param {string} token - Admin authorization token
 */
export const fetchAdminWebsiteContent = async (token) => {
  const res = await apiFetch(API_ENDPOINTS.ADMIN.CONTENT, {
    headers: {
      'authorization': `Bearer ${token}`
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to load website content.');
  }
  return data;
};

/**
 * Save updated website settings/content (CMS)
 * @param {object} settingsPayload - Full settings object
 * @param {string} token - Admin authorization token
 */
export const saveAdminWebsiteContent = async (settingsPayload, token) => {
  const res = await apiFetch(API_ENDPOINTS.ADMIN.CONTENT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify(settingsPayload)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save website content.');
  }
  return data;
};

/**
 * Fetch media list
 * @param {string} [kind='student-gallery'] - Media type
 * @param {string} token - Admin authorization token
 */
export const fetchAdminMediaList = async (kind = 'student-gallery', token) => {
  const res = await apiFetch(`${API_ENDPOINTS.ADMIN.MEDIA.LIST}?kind=${encodeURIComponent(kind)}`, {
    headers: {
      'authorization': `Bearer ${token}`
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to load gallery photos.');
  }
  return data;
};

/**
 * Upload a media photo
 * @param {FormData} formData - Form data with file and metadata
 * @param {string} token - Admin authorization token
 */
export const uploadAdminMedia = async (formData, token) => {
  const res = await apiFetch(API_ENDPOINTS.ADMIN.MEDIA.UPLOAD, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`
    },
    body: formData
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Upload failed.');
  }
  return data;
};

/**
 * Update media photo metadata/visibility
 * @param {object} payload - { id, published, sortOrder, title, caption, altText, kind }
 * @param {string} token - Admin authorization token
 */
export const updateAdminMedia = async (payload, token) => {
  const res = await apiFetch(API_ENDPOINTS.ADMIN.MEDIA.UPDATE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update photo state.');
  }
  return data;
};

/**
 * Delete a media photo
 * @param {string} id - Photo ID
 * @param {string} token - Admin authorization token
 */
export const deleteAdminMedia = async (id, token) => {
  const res = await apiFetch(API_ENDPOINTS.ADMIN.MEDIA.DELETE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ id })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to delete photo.');
  }
  return data;
};

/**
 * Fetch system information & environment status
 * @param {string} token - Admin authorization token
 */
export const fetchAdminSystemInfo = async (token) => {
  const res = await apiFetch(API_ENDPOINTS.ADMIN.SYSTEM, {
    headers: {
      'authorization': `Bearer ${token}`
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to load system information.');
  }
  return data;
};

/**
 * Trigger transactional email test
 * @param {string} token - Admin authorization token
 */
export const sendAdminTestEmail = async (token) => {
  const res = await apiFetch(API_ENDPOINTS.ADMIN.EMAIL_TEST, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${token}`
    }
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Check RESEND_API_KEY configuration.');
  }
  return data;
};

/**
 * Construct URL to view uploaded registration document
 * @param {string} id - Registration ID
 * @param {string} field - Document field name (photo, resumeDoc, identityDoc, paymentProof)
 */
export const getAdminFileUrl = (id, field) => {
  return apiUrl(`${API_ENDPOINTS.ADMIN.FILE}?id=${encodeURIComponent(id)}&field=${encodeURIComponent(field)}`);
};
