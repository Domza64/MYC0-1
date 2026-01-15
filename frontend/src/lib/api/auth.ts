import { apiRequest } from "./client";
import type { User } from "../../types/user";

export const authApi = {
  /**
   * Log out the user by sending a POST request to /auth/logout.
   * @returns {Promise<void>} - Resolves after the request has been sent.
   * @example
   * await authApi.logout();
   */
  logout: (): Promise<void> =>
    apiRequest<void>("/auth/logout", {
      method: "POST",
    }),

  /**
   * Retrieve the currently logged-in user's data.
   * @returns {Promise<User>} - The currently logged-in user.
   * @example
   * const user = await authApi.getUserData();
   */
  getUserData: (): Promise<User> =>
    apiRequest<User>("/auth/user", {
      showToastError: false,
    }),

  /**
   * Login to the application.
   * @param {string} username - The username to log in with.
   * @param {string} password - The password to log in with.
   * @returns {Promise<User>} - The logged-in user.
   * @example
   * const user = await authApi.login("username", "password");
   */
  login: (username: string, password: string): Promise<User> =>
    apiRequest<User>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      showToastError: false,
    }),
};
