const express = require("express");

const {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// পুরো cart দেখা
router.get("/:customerId", authMiddleware, getCart);

// cart এ product যোগ করা (customerId body তে যাবে)
router.post("/", authMiddleware, addToCart);

// cart এর কোনো item এর quantity বদলানো (cart item এর id)
router.put("/:id", authMiddleware, updateCartQuantity);

// cart থেকে একটা item মুছে ফেলা (cart item এর id)
router.delete("/:id", authMiddleware, removeFromCart);

// customer এর পুরো cart খালি করা
router.delete("/customer/:customerId", authMiddleware, clearCart);

module.exports = router;