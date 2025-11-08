import { toast } from "react-hot-toast";

const API_BASE = "/api";

type RequestOptions = RequestInit & {
  showToastError?: boolean;
  toastSuccessMessage?: string;
  onSuccess?: (data: any) => void;
};

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
