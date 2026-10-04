const express = require("express");
const router = express.Router();

const {
  getOrders,
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// লগইন করা customer এর নিজের সব order
router.get("/my-orders", authMiddleware, getMyOrders);

// সব order দেখা: শুধু admin
router.get("/", authMiddleware, adminMiddleware, getOrders);

// একটি order এর বিস্তারিত (controller এ ownership চেক লাগবে, নিচে দেখুন)
router.get("/:id", authMiddleware, getOrderById);

// নতুন order তৈরি: লগইন করা customer
router.post("/", authMiddleware, createOrder);

// status বদলানো: শুধু admin
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

// order cancel: লগইন করা ইউজার (controller এ ownership চেক লাগবে)
router.delete("/:id", authMiddleware, cancelOrder);

module.exports = router;