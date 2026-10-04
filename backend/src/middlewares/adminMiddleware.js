
const adminMiddleware = (req, res, next) => {
  // Check if user is logged in
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized. Please login first.",
    });
  }

  // Check if user is admin
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin only.",
    });
  }

  // User is admin
  next();
};

module.exports = adminMiddleware;

