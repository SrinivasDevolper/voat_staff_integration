// Role-based authorization middleware
const authorize = (roles) => {
  // console.log("roles", roles);
  return (req, res, next) => {
    // console.log("rolesNextg", roles);
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};

module.exports = authorize;
