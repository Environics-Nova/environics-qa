import { useAuth, useOrganization } from "@clerk/clerk-react";
import { useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface ApiClientOptions extends Omit<RequestInit, "headers"> {
  headers?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: string;
  pagination?: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

/**
 * Custom hook that provides an authenticated API client using Clerk JWT tokens.
 * The token is automatically refreshed by Clerk when needed.
 * Includes organization context from Clerk Organizations.
 *
 * @returns Object containing the fetch wrapper and loading state
 */
export function useApiClient() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { organization } = useOrganization();

  /**
   * Makes an authenticated API request with the Clerk JWT token.
   * Automatically includes the Authorization header with Bearer token.
   * The JWT token includes organization context when user has selected an organization.
   *
   * @param endpoint - API endpoint path (e.g., "/api/v1/users")
   * @param options - Fetch options (method, body, etc.)
   * @returns Promise resolving to the parsed JSON response
   * @throws ApiError if the request fails
   */
  const apiFetch = useCallback(
    async <T = unknown>(endpoint: string, options: ApiClientOptions = {}): Promise<T> => {
      // Get fresh token from Clerk with organization context
      // When user has selected an organization, we need to explicitly request a token for that org
      const token = await getToken({ organizationId: organization?.id });

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
        let errorCode: string | undefined;
        
        try {
          const errorData = await response.json();
          // Handle nested error structure: { success: false, error: { code, message } }
          if (errorData.error && typeof errorData.error === 'object') {
            errorMessage = errorData.error.message || errorMessage;
            errorCode = errorData.error.code;
          } else {
            errorMessage = errorData.error || errorData.message || errorMessage;
            errorCode = errorData.code;
          }
        } catch {
          errorMessage = response.statusText || errorMessage;
        }

        // Special handling for 400 - no organization context
        if (response.status === 400 && errorMessage.toLowerCase().includes("organization")) {
          errorMessage = "Please select an organization to continue. Use the organization switcher in the sidebar.";
        }

        const error: ApiError = {
          message: errorMessage,
          status: response.status,
          code: errorCode,
        };
        throw error;
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return undefined as T;
      }

      return response.json();
    },
    [getToken, organization]
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

  /**
   * Check if user has an organization selected
   */
  const hasOrganization = !!organization;

  return {
    apiFetch,
    get,
    post,
    put,
    patch,
    del,
    isLoaded,
    isSignedIn,
    hasOrganization,
    organizationId: organization?.id,
    organizationName: organization?.name,
  };
}
