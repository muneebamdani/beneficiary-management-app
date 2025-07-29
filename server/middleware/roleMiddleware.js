module.exports = function roleMiddleware(...requiredRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Unauthorized: No user role found' });
    }

    const userRole = req.user.role.toLowerCase().trim();
    const allowedRoles = requiredRoles.map(role => role.toLowerCase().trim());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }

    next();
  };
};
