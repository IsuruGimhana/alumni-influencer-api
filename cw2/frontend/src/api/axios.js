import axios from "axios";

/**
 * Fetches a CSRF token from the backend if one is not already available.
 * This ensures that all sensitive requests are protected against CSRF attacks.
 */
import { ensureCsrfToken } from "./csrfService";

/**
 * Retrieves the currently stored CSRF token from frontend state (memory/storage).
 */
import { getCsrfToken } from "../state/csrfState";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,

  /**
   * Ensures cookies (such as authentication/session cookies)
   * are automatically included in every request.
   */
  withCredentials: true,
});

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  const isMutationRequest =
    method === "post" || method === "put" || method === "delete";

  /**
   * CSRF protection is only required for requests that modify data on the server.
   * GET requests are considered safe and do not need CSRF validation.
   */
  if (!isMutationRequest) {
    return config;
  }

  /**
   * If no CSRF token exists in memory, request one from the backend.
   * This ensures every sensitive request has protection against CSRF attacks.
   */
  if (!getCsrfToken()) {
    await ensureCsrfToken();
  }

  const token = getCsrfToken();
  if (token) {
    config.headers = config.headers ?? {};

    /**
     * Attach the CSRF token to the request header.
     * The backend will verify this token to ensure the request is legitimate
     * and not coming from a malicious third-party site.
     */
    config.headers["x-csrf-token"] = token;
  }

  return config;
});

export default api;