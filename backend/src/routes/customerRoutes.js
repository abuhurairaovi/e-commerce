const express = require("express");

const {
  getCustomers,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customerController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getCustomers
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateCustomer
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteCustomer
);

module.exports = router;