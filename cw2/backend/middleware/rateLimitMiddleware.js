import rateLimit from "express-rate-limit";

/**
 * Rate limiter middleware for authentication routes.
 *
 * Purpose:
 * - Prevents abuse of login/register endpoints
 * - Protects server from brute-force attacks (e.g. password guessing)
 *
 * How it works:
 * - Limits number of requests from a single IP within a time window
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //time window of 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers (deprecated)
  message: { msg: "Too many requests, please try again later" }, 
});
