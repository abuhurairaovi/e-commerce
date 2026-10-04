const pool = require("../config/db");

// GET /api/orders  (শুধু admin, route এ adminMiddleware আছে)
async function getOrders(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT
         o.id,
         o.customer_id,
         c.name AS customer,
         o.total_price,
         o.payment_method,
         o.shipping_address,
         o.status,
         o.created_at
       FROM orders o
       LEFT JOIN customers c ON o.customer_id = c.id
       ORDER BY o.created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/my-orders
async function getMyOrders(req, res, next) {
  try {
    const customerId = req.user.customerId;

    const result = await pool.query(
      `SELECT *
       FROM orders
       WHERE customer_id = $1
       ORDER BY created_at DESC`,
      [customerId]
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id  (admin সব দেখতে পারে, customer শুধু নিজেরটা)
async function getOrderById(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT * FROM orders WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = result.rows[0];

    if (req.user.role !== "admin" && order.customer_id !== req.user.customerId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
}

// POST /api/orders
// দাম ব্যাকএন্ডে cart_items + products থেকে হিসাব হয়, ফ্রন্টএন্ডের দাম বিশ্বাস করা হয় না
async function createOrder(req, res, next) {
  const client = await pool.connect();

  try {
    const customerId = req.user.customerId;
    const { paymentMethod, shippingAddress } = req.body;

    if (!customerId || !shippingAddress) {
      return res.status(400).json({
        message: "Customer and shipping address are required",
      });
    }

    await client.query("BEGIN");

    // cart এর item গুলো আসল দামসহ। FOR UPDATE দিয়ে product row lock করা হয়,
    // যাতে একসাথে দুজন একই stock না কিনতে পারে
    const cartResult = await client.query(
      `SELECT ci.product_id, ci.quantity,
              p.name, p.price, p.stock
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.customer_id = $1
       FOR UPDATE OF p`,
      [customerId]
    );

    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;

    for (const item of cartResult.rows) {
      if (item.stock < item.quantity) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          message: `"${item.name}" এর stock যথেষ্ট নেই (আছে ${item.stock}টি)`,
        });
      }
      total += Number(item.price) * item.quantity;
    }

    const orderResult = await client.query(
      `INSERT INTO orders
       (customer_id, total_price, payment_method, shipping_address, status)
       VALUES ($1, $2, $3, $4, 'Pending')
       RETURNING *`,
      [
        customerId,
        total,
        paymentMethod || "Cash on Delivery",
        shippingAddress,
      ]
    );

    const order = orderResult.rows[0];

    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items
         (order_id, product_id, product_name, price, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.product_id, item.name, item.price, item.quantity]
      );

      await client.query(
        `UPDATE products SET stock = stock - $1 WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query(
      `DELETE FROM cart_items WHERE customer_id = $1`,
      [customerId]
    );

    await client.query("COMMIT");

    res.status(201).json(order);
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
}

// PUT /api/orders/:id/status  (শুধু admin, route এ adminMiddleware আছে)
async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const result = await pool.query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/orders/:id  (admin যেকোনোটা, customer শুধু নিজের Pending order)
async function cancelOrder(req, res, next) {
  try {
    const found = await pool.query(
      `SELECT * FROM orders WHERE id = $1`,
      [req.params.id]
    );

    if (found.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = found.rows[0];
    const isAdmin = req.user.role === "admin";

    if (!isAdmin && order.customer_id !== req.user.customerId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!isAdmin && order.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending orders can be cancelled",
      });
    }

    const result = await pool.query(
      `UPDATE orders SET status = 'Cancelled' WHERE id = $1 RETURNING *`,
      [req.params.id]
    );

    res.json({ message: "Order cancelled", order: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getOrders,
  getMyOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
};