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
 * @param {string} endpoint - The API endpoint relative to API_BASE (e.g., "/playlists").
 * @param {RequestOptions} [options] - Optional request configuration.
 * @param {boolean} [options.showToastError=true] - Whether to show a toast on errors.
 * @param {string} [options.toastSuccessMessage] - Optional success toast message.
 * @param {(data: any) => void} [options.onSuccess] - Callback executed after a successful request.
 * @returns {Promise<T>} - Resolves with the parsed JSON data.
 *
 * @example
 * const playlists = await apiRequest<Playlist[]>('/playlists');
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const showToastError = options.showToastError ?? true;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
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
    options.onSuccess?.(data);
    return data as T;
  } catch (err: any) {
    if (showToastError && !String(err.message).startsWith("HTTP_")) {
      toast.error("Something went wrong.");
    }
    throw err;
  }
}
