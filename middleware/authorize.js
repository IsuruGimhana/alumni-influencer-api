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