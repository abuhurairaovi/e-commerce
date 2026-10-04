const pool = require("../config/db");

// GET /api/dashboard/stats
async function getDashboardStats(req, res, next) {
  try {
    const productsResult = await pool.query(
      `SELECT COUNT(*) AS total_products
       FROM products`
    );

    const customersResult = await pool.query(
      `SELECT COUNT(*) AS total_customers
       FROM customers`
    );

    const ordersResult = await pool.query(
      `SELECT COUNT(*) AS total_orders
       FROM orders`
    );

    const revenueResult = await pool.query(
      `SELECT COALESCE(SUM(total_price), 0) AS total_revenue
       FROM orders
       WHERE status <> 'Cancelled'`
    );

    const lowStockResult = await pool.query(
      `SELECT COUNT(*) AS low_stock
       FROM products
       WHERE stock > 0
       AND stock <= 3`
    );

    const outOfStockResult = await pool.query(
      `SELECT COUNT(*) AS out_of_stock
       FROM products
       WHERE stock = 0`
    );

    res.json({
      totalProducts: Number(
        productsResult.rows[0].total_products
      ),

      totalCustomers: Number(
        customersResult.rows[0].total_customers
      ),

      totalOrders: Number(
        ordersResult.rows[0].total_orders
      ),

      totalRevenue: Number(
        revenueResult.rows[0].total_revenue
      ),

      lowStock: Number(
        lowStockResult.rows[0].low_stock
      ),

      outOfStock: Number(
        outOfStockResult.rows[0].out_of_stock
      ),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboardStats,
};