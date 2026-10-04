const pool = require("../config/db");

// লগইন করা ইউজারের customerId token থেকে নেওয়া হয়।
// URL বা body তে যা-ই আসুক, ভরসা করা হয় না।
function getOwnCustomerId(req, res) {
  const customerId = req.user && req.user.customerId;

  if (!customerId) {
    res.status(403).json({ message: "No customer account linked" });
    return null;
  }

  return customerId;
}

// GET /api/cart/:customerId
async function getCart(req, res, next) {
  try {
    const customerId = getOwnCustomerId(req, res);
    if (!customerId) return;

    // URL এর id token এর সাথে না মিললে অন্যের cart দেখার চেষ্টা
    if (Number(req.params.customerId) !== Number(customerId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await pool.query(
      `SELECT
         cart_items.id,
         cart_items.product_id,
         products.name,
         products.price,
         products.image,
         cart_items.quantity,
         (products.price * cart_items.quantity) AS subtotal
       FROM cart_items
       JOIN products
         ON cart_items.product_id = products.id
       WHERE cart_items.customer_id = $1
       ORDER BY cart_items.id DESC`,
      [customerId]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// POST /api/cart
async function addToCart(req, res, next) {
  try {
    const customerId = getOwnCustomerId(req, res);
    if (!customerId) return;

    // customerId এখন body থেকে নেওয়া হয় না
    const { productId, quantity } = req.body;
    const qty = Number(quantity);

    if (!productId || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        message: "Product and valid quantity are required",
      });
    }

    const product = await pool.query(
      `SELECT id, stock
       FROM products
       WHERE id = $1`,
      [productId]
    );

    if (product.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const stock = Number(product.rows[0].stock);

    if (qty > stock) {
      return res.status(400).json({
        message: "Not enough stock",
      });
    }

    const existing = await pool.query(
      `SELECT *
       FROM cart_items
       WHERE customer_id = $1
       AND product_id = $2`,
      [customerId, productId]
    );

    if (existing.rows.length > 0) {
      const newQuantity = Number(existing.rows[0].quantity) + qty;

      if (newQuantity > stock) {
        return res.status(400).json({
          message: "Not enough stock",
        });
      }

      const result = await pool.query(
        `UPDATE cart_items
         SET quantity = $1
         WHERE customer_id = $2
         AND product_id = $3
         RETURNING *`,
        [newQuantity, customerId, productId]
      );

      return res.json(result.rows[0]);
    }

    const result = await pool.query(
      `INSERT INTO cart_items
       (customer_id, product_id, quantity)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [customerId, productId, qty]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/cart/:id
async function updateCartQuantity(req, res, next) {
  try {
    const customerId = getOwnCustomerId(req, res);
    if (!customerId) return;

    const qty = Number(req.body.quantity);

    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({
        message: "Valid quantity is required",
      });
    }

    // customer_id মেলানো হচ্ছে, তাই অন্যের item পাওয়া যাবে না
    const cartItem = await pool.query(
      `SELECT
         cart_items.product_id,
         products.stock
       FROM cart_items
       JOIN products
         ON cart_items.product_id = products.id
       WHERE cart_items.id = $1
       AND cart_items.customer_id = $2`,
      [req.params.id, customerId]
    );

    if (cartItem.rows.length === 0) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    const stock = Number(cartItem.rows[0].stock);

    if (qty > stock) {
      return res.status(400).json({
        message: "Not enough stock",
      });
    }

    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = $1
       WHERE id = $2
       AND customer_id = $3
       RETURNING *`,
      [qty, req.params.id, customerId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart/:id
async function removeFromCart(req, res, next) {
  try {
    const customerId = getOwnCustomerId(req, res);
    if (!customerId) return;

    const result = await pool.query(
      `DELETE FROM cart_items
       WHERE id = $1
       AND customer_id = $2
       RETURNING id`,
      [req.params.id, customerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    res.json({
      message: "Product removed from cart",
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart/customer/:customerId
async function clearCart(req, res, next) {
  try {
    const customerId = getOwnCustomerId(req, res);
    if (!customerId) return;

    if (Number(req.params.customerId) !== Number(customerId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    await pool.query(
      `DELETE FROM cart_items
       WHERE customer_id = $1`,
      [customerId]
    );

    res.json({
      message: "Cart cleared",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
};