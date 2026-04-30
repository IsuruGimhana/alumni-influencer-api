/**
 * Role-Based Authorization Middleware
 *
 * Restricts access to routes based on user roles.
 *
 * Logic:
 * - Accepts allowed roles as parameters.
 * - Checks if authenticated user's role is permitted.
 * - Blocks request if role is not authorized.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) { // Check if user's role is in the allowed roles
      return res.status(403).json({ 
        msg: `Role ${req.user.role} is not authorized to access this route` 
      });
    }
    next();
  };
};

export default authorize;