import { http } from '../http';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * API service for mentions-related actions.
 */
export const mentionsApi = {
  /**
   * Fetch all mentions
   * @param {AbortSignal} signal - Abort signal for cancellation
   * @returns {Promise} Response data
   */
  fetchAll: signal => {
    return http
      .get(`${BASE_URL}/mentions`, { signal })
      .then(response => response.data);
  },

  /**
   * Update a mention
   * @param {string} id - Mention ID
   * @param {Object} mentionData - Data to update
   * @returns {Promise} Updated mention data
   */
  update: (id, mentionData) => {
    return http
      .put(`${BASE_URL}/mentions/${id}`, mentionData)
      .then(response => response.data);
  },

  /**
   * Send a reply to a mention
   * @param {string} id - Mention ID
   * @param {Object} replyData - Reply content
   * @returns {Promise} Response data
   */
  sendReply: (id, replyData) => {
    return http
      .post(`${BASE_URL}/mentions/${id}/reply`, replyData)
      .then(response => response.data);
  },
};
