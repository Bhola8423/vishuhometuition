/**
 * Central API Endpoints Definition
 * All API routes and endpoint paths for Vishu Home Tuition are defined here in one place.
 */

export const API_ENDPOINTS = {
  // Public / General Endpoints
  HEALTH: '/api/health',
  SITE_CONTENT: '/api/site-content',
  SITE_MEDIA: '/api/site-media',
  STATUS: '/api/status',
  REGISTER: '/api/register',
  LEAD: '/api/lead',

  // Admin Endpoints
  ADMIN: {
    LIST: '/api/admin/list',
    DETAIL: '/api/admin/detail',
    UPDATE: '/api/admin/update',
    EDIT: '/api/admin/edit',
    CONTENT: '/api/admin/content',
    SYSTEM: '/api/admin/system',
    EMAIL_TEST: '/api/admin/email-test',
    SEND_CARD: '/api/admin/send-card',
    FILE: '/api/admin/file',
    MEDIA: {
      LIST: '/api/admin/media/list',
      UPLOAD: '/api/admin/media/upload',
      UPDATE: '/api/admin/media/update',
      DELETE: '/api/admin/media/delete',
      FILE: '/api/admin/media/file'
    }
  }
};
