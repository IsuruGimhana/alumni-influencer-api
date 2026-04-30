import axios from "axios";

/**
 * Functions to get and store CSRF token in frontend state.
 */
import { getCsrfToken, setCsrfToken } from "../state/csrfState";


/**
 * Holds the current CSRF fetch promise to prevent multiple
 * simultaneous requests for the token.
 */
let csrfFetchPromise = null;


/**
 * Fetches a CSRF token from the backend server.
 *
 * Flow:
 * - Calls backend `/auth/csrf-token` endpoint
 * - Backend returns a CSRF token
 * - Token is stored in frontend state
 *
 * Why needed:
 * - This token is required to protect POST/PUT/DELETE requests
 *   from CSRF (Cross-Site Request Forgery) attacks.
 */
export async function fetchCsrfToken() {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/auth/csrf-token`,
    {
      withCredentials: true,
    }
  );

  const token = data?.csrfToken ?? null;
  // Save token in frontend state for later use
  setCsrfToken(token);

  return token;
}

/**
 * Ensures a CSRF token exists before making secure requests.
 *
 * Flow:
 * - If token already exists → return it immediately
 * - If token is being fetched → reuse same promise (avoid duplicate calls)
 * - If not fetching yet → start fetching token
 *
 * Why important:
 * - Prevents multiple API calls from requesting CSRF token at the same time
 * - Ensures all requests share the same token fetch process
 */
export async function ensureCsrfToken() {
  const currentToken = getCsrfToken();
  // If token already exists, no need to fetch again
  if (currentToken) return currentToken;

  if (!csrfFetchPromise) {
    csrfFetchPromise = fetchCsrfToken().finally(() => {
      // Reset promise after completion so future calls can refetch if needed
      csrfFetchPromise = null;
    });
  }

  return csrfFetchPromise;
}
