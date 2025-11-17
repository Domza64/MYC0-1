import { toast } from "react-hot-toast";

const API_BASE = "/api";

type RequestOptions = RequestInit & {
  showToastError?: boolean;
  toastSuccessMessage?: string;
  onSuccess?: (data: any) => void;
};

/**
 * Makes an HTTP request to the backend API with JSON handling, credentials,
 * error handling, and optional toast notifications.
 *
 * @template T - The expected type of the response data.
 * @template R - The return type after conversion (defaults to T).
 * @param {string} endpoint - The API endpoint relative to API_BASE (e.g., "/playlists").
 * @param {RequestOptions} [options] - Optional request configuration.
 * @param {boolean} [options.showToastError=true] - Whether to show a toast on errors.
 * @param {string} [options.toastSuccessMessage] - Optional success toast message.
 * @param {(data: any) => void} [options.onSuccess] - Callback executed after a successful request.
 * @param {(data: any) => R} [options.converter] - Optional function to convert the response data.
 * @returns {Promise<R>} - Resolves with the parsed JSON data (converted if converter is provided).
 *
 * @example
 * // Basic usage
 * const playlists = await apiRequest<Playlist[]>('/playlists');
 *
 * // With converter
 * const songs = await apiRequest<any[], Song[]>('/songs', {
 *   converter: (data) => data.map(item => new Song(item))
 * });
 *
 * // Single item conversion
 * const song = await apiRequest<any, Song>('/songs/1', {
 *   converter: (data) => new Song(data)
 * });
 */
export async function apiRequest<T = any, R = T>(
  endpoint: string,
  options: RequestOptions & { converter?: (data: T) => R } = {}
): Promise<R> {
  const showToastError = options.showToastError ?? true;
  const { converter, ...fetchOptions } = options;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
      credentials: "include",
      ...fetchOptions,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const message =
        errorData.detail || res.statusText || `Error ${res.status}`;

      if (showToastError) {
        toast.error(message);
      }

      throw new Error(`HTTP_${res.status}:${message}`);
    }

    const data = await res.json().catch(() => ({}));

    // Apply converter if provided
    const result = converter ? converter(data) : data;

    fetchOptions.onSuccess?.(data);

    if (options.toastSuccessMessage) {
      toast.success(options.toastSuccessMessage);
    }

    return result as R;
  } catch (err: any) {
    if (showToastError && !String(err.message).startsWith("HTTP_")) {
      toast.error("Something went wrong.");
    }
    throw err;
  }
}
