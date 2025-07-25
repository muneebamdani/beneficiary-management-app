// middleware/roleMiddleware.js
module.exports = function roleMiddleware(...allowedRoles) {
  // Normalize all allowed roles to lowercase
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

  return (req, res, next) => {
    const userRole = req.user?.role?.toLowerCase(); // Normalize user's role

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }

    next();
  };
};
