const pool = require("../config/db");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const generateToken = require("../utils/generateToken");
const { sendVerificationEmail } = require("../utils/emailService");

// ========================
// REGISTER
// ========================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check all fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Token expires after 30 minutes
    const verificationExpires = new Date(
      Date.now() + 30 * 60 * 1000
    );

    // Insert user into database
    const result = await pool.query(
      `INSERT INTO users
       (name, email, password, role, is_verified, verification_token, verification_expires)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, name, email, role, is_verified`,
      [
        name,
        email,
        hashedPassword,
        "customer",
        false,
        verificationToken,
        verificationExpires,
      ]
    );

    const newUser = result.rows[0];

    // Create matching customer record
    await pool.query(
      `INSERT INTO customers (name, email, user_id)
       VALUES ($1, $2, $3)`,
      [name, email, newUser.id]
    );

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
      user: newUser,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ========================
// VERIFY EMAIL
// ========================
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const result = await pool.query(
      `SELECT * FROM users
       WHERE verification_token = $1
       AND verification_expires > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired verification token",
      });
    }

    const user = result.rows[0];

    // Mark email as verified
    await pool.query(
      `UPDATE users
       SET is_verified = TRUE,
           verification_token = NULL,
           verification_expires = NULL
       WHERE id = $1`,
      [user.id]
    );

    res.status(200).json({
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ========================
// LOGIN
// ========================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // Check email verification
    if (!user.is_verified) {
      return res.status(403).json({
        message: "Please verify your email before login",
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Get matching customer record
    const customerResult = await pool.query(
      "SELECT id FROM customers WHERE user_id = $1",
      [user.id]
    );

    const customerId = customerResult.rows[0]?.id || null;

    // Generate JWT token
    const token = generateToken({ ...user, customerId });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        customerId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
};