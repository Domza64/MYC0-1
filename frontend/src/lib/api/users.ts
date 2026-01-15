import { apiRequest } from "./client";
import type { CreateUserInput, UpdateUserInput, User } from "../../types/user";

export const usersApi = {
  /**
   * Get a list of all users..
   * @returns {Promise<User[]>} - List of all users.
   * @example
   * const songs = await usersApi.getUsers();
   */
  getUsers: (): Promise<User[]> => apiRequest<User[]>("/users"),

  /**
   * Create a new user.
   * @param {CreateUserInput} data - User creation payload.
   * @returns {Promise<User>} - The newly created user.
   * @example
   * const user = await usersApi.createUser({
   *   username: "admin",
   *   role: "ADMIN",
   *   password: "securePassword123",
   * });
   */
  createUser: (data: CreateUserInput): Promise<User> =>
    apiRequest<User>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  /**
   * Update an existing user.
   * @param {UpdateUserInput} data - User update payload.
   * @returns {Promise<User>} - The updated user.
   * @example
   * const user = await usersApi.updateUser({
   *   id: 1,
   *   username: "newUsername",
   *   role: "MEMBER",
   * });
   *
   * @example
   * await usersApi.updateUser({
   *   id: 1,
   *   password: "newStrongPassword",
   * });
   */
  updateUser: (data: UpdateUserInput): Promise<User> =>
    apiRequest<User>(`/users/${data.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  /**
   * Delete a user by ID.
   * @param {number} id - The ID of the user to delete.
   * @returns {Promise<void>}
   * @example
   * await usersApi.deleteUser(1);
   */
  deleteUser: (id: number): Promise<void> =>
    apiRequest(`/users/${id}`, {
      method: "DELETE",
    }),
};
