let csrfToken = null;

export function getCsrfToken() {
  return csrfToken;
}

export function setCsrfToken(token) {
  csrfToken = token ?? null;
}

export function clearCsrfToken() {
  csrfToken = null;
}
