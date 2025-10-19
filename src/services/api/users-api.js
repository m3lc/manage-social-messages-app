import { http } from '../http';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * API service for user-related actions.
 */
export const usersApi = {
  /**
   * Login user
   * @param {Object} credentials - User credentials (e.g., { email: string })
   * @returns {Promise} Login response with user data and token
   */
  login: credentials => {
    return http
      .post(`${BASE_URL}/users/login`, credentials)
      .then(response => response.data);
  },

  /**
   * Fetch all users
   * @param {AbortSignal} signal - Abort signal for cancellation
   * @returns {Promise<Array>} Array of users
   */
  fetchAll: signal => {
    return http
      .get(`${BASE_URL}/users`, { signal })
      .then(response => response.data.result || response.data || []);
  },
};
