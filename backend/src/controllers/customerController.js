const pool = require("../config/db");

// GET /api/customers
async function getCustomers(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT c.id, c.name, c.email, c.phone, c.address, c.created_at,
              COUNT(o.id)::int AS orders
       FROM customers c
       LEFT JOIN orders o ON o.customer_id = c.id
       GROUP BY c.id
       ORDER BY c.created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/customers/:id
async function getCustomerById(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT *
       FROM customers
       WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/customers/:id
async function updateCustomer(req, res, next) {
  try {
    const { name, phone, email, address } = req.body;

    const result = await pool.query(
      `UPDATE customers
       SET name = COALESCE($1, name),
           phone = COALESCE($2, phone),
           email = COALESCE($3, email),
           address = COALESCE($4, address)
       WHERE id = $5
       RETURNING *`,
      [name, phone, email, address, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/customers/:id
async function deleteCustomer(req, res, next) {
  try {
    const result = await pool.query(
      `DELETE FROM customers
       WHERE id = $1
       RETURNING id`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.json({
      message: "Customer deleted",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};