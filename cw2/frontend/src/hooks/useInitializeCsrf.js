import { useEffect } from "react";
/**
 * Ensures a CSRF token is available by calling the CSRF service.
 * This prepares the app for secure API requests.
 */
import { ensureCsrfToken } from "../api/csrfService";

/**
 * Custom React hook to initialize CSRF protection when the app loads.
 *
 * Purpose:
 * - Fetches a CSRF token early in the app lifecycle
 * - So that POST/PUT/DELETE requests work without delay
 * - Improves UX by avoiding token fetch at request time
 */
export function useInitializeCsrf() {
  useEffect(() => {
    // Prime CSRF token early so mutating requests work transparently.
    ensureCsrfToken().catch(() => {
      // Interceptor-level fetch still runs on demand for mutation requests.
    });
  }, []);
}
