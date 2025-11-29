import type { Author } from "../../types/data";
import { apiRequest } from "./client";

export const authorsApi = {
  /**
   * Fetch all authors.
   * @returns {Promise<Author[]>} - Array of authors.
   * @example
   * const authors = await authorsApi.getAll();
   */
  getAll: (): Promise<Author[]> => apiRequest<Author[]>("/authors"),

  /**
   * Fetch a single author by ID.
   *
   * @param {number} id - The unique ID of the author to retrieve.
   * @returns {Promise<Author>} A promise that resolves to the author object.
   *
   * @example
   * const author = await authorsApi.get(5);
   */
  get: (id: Number): Promise<Author> => apiRequest<Author>("/authors/" + id),
};
