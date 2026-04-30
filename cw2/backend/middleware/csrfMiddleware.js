
/**
 * CSRF Protection Middleware
 *
 * This middleware protects the server from Cross-Site Request Forgery (CSRF) attacks.
 *
 * How it works:
 * - The frontend sends a CSRF token in the request header ("x-csrf-token")
 * - The server also stores a CSRF token in a cookie ("XSRF-TOKEN")
 * - Both tokens must match for the request to be considered valid
 */
export const verifyCSRF = (req, res, next) => {
  const csrfTokenFromHeader = req.headers["x-csrf-token"];
  const csrfTokenFromCookie = req.cookies["XSRF-TOKEN"];

  if (!csrfTokenFromHeader || !csrfTokenFromCookie) {
    return res.status(403).json({ msg: "Invalid CSRF token" });
  }

  if (csrfTokenFromHeader !== csrfTokenFromCookie) {
    return res.status(403).json({ msg: "Invalid CSRF token" });
  }

  next();
};
