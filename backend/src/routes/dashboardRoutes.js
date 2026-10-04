
const express = require("express");

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

module.exports = router;

