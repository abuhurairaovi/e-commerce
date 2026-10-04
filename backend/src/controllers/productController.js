const pool = require("../config/db");

// GET /api/products
async function getProducts(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT
         p.*,
         c.name AS category_name
       FROM products p
       LEFT JOIN categories c
         ON p.category_id = c.id
       ORDER BY p.created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// GET /api/products/:id
async function getProductById(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT *
       FROM products
       WHERE id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// POST /api/products
// Admin only
async function createProduct(req, res, next) {
  try {
    const {
      name,
      price,
      stock,
      image,
      categoryId,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Name and price are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO products
       (name, price, stock, image, category_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        name,
        Number(price),
        Number(stock) || 0,
        image || "https://via.placeholder.com/100",
        categoryId || null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// PUT /api/products/:id
// Admin only
async function updateProduct(req, res, next) {
  try {
    const {
      name,
      price,
      stock,
      image,
      categoryId,
    } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET name = COALESCE($1, name),
           price = COALESCE($2, price),
           stock = COALESCE($3, stock),
           image = COALESCE($4, image),
           category_id = COALESCE($5, category_id)
       WHERE id = $6
       RETURNING *`,
      [
        name,
        price,
        stock,
        image,
        categoryId,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/products/:id
// Admin only
async function deleteProduct(req, res, next) {
  try {
    const result = await pool.query(
      `DELETE FROM products
       WHERE id = $1
       RETURNING id`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};