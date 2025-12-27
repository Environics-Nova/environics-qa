import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface ApiClientOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
}

/**
 * Custom hook that provides an authenticated API client using Clerk JWT tokens.
 * The token is automatically refreshed by Clerk when needed.
 *
 * @returns Object containing the fetch wrapper and loading state
 */
export function useApiClient() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  /**
   * Makes an authenticated API request with the Clerk JWT token.
   * Automatically includes the Authorization header with Bearer token.
   *
   * @param endpoint - API endpoint path (e.g., "/api/v1/users")
   * @param options - Fetch options (method, body, etc.)
   * @returns Promise resolving to the parsed JSON response
   * @throws ApiError if the request fails
   */
  const apiFetch = useCallback(
    async <T = unknown>(endpoint: string, options: ApiClientOptions = {}): Promise<T> => {
      // Get fresh token from Clerk (handles refresh automatically)
      const token = await getToken();

      const { headers: customHeaders, ...restOptions } = options;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...customHeaders,
      };

      // Add Authorization header if token is available
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...restOptions,
        headers,
      });

      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = "An error occurred";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }

        const error: ApiError = {
          message: errorMessage,
          status: response.status,
        };
        throw error;
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return undefined as T;
      }

      return response.json();
    },
    [getToken]
  );

  /**
   * Convenience method for GET requests
   */
  const get = useCallback(
    <T = unknown>(endpoint: string, options?: ApiClientOptions): Promise<T> => {
      return apiFetch<T>(endpoint, { ...options, method: "GET" });
    },
    [apiFetch]
  );

  /**
   * Convenience method for POST requests
   */
  const post = useCallback(
    <T = unknown>(endpoint: string, data?: unknown, options?: ApiClientOptions): Promise<T> => {
      return apiFetch<T>(endpoint, {
        ...options,
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [apiFetch]
  );

  /**
   * Convenience method for PUT requests
   */
  const put = useCallback(
    <T = unknown>(endpoint: string, data?: unknown, options?: ApiClientOptions): Promise<T> => {
      return apiFetch<T>(endpoint, {
        ...options,
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [apiFetch]
  );

  /**
   * Convenience method for PATCH requests
   */
  const patch = useCallback(
    <T = unknown>(endpoint: string, data?: unknown, options?: ApiClientOptions): Promise<T> => {
      return apiFetch<T>(endpoint, {
        ...options,
        method: "PATCH",
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [apiFetch]
  );

  /**
   * Convenience method for DELETE requests
   */
  const del = useCallback(
    <T = unknown>(endpoint: string, options?: ApiClientOptions): Promise<T> => {
      return apiFetch<T>(endpoint, { ...options, method: "DELETE" });
    },
    [apiFetch]
  );

  return {
    apiFetch,
    get,
    post,
    put,
    patch,
    del,
    isLoaded,
    isSignedIn,
  };
}
