import express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { db } from "./db";

const router = express.Router();

// Use environment variable for secret key
const PAYMENT_SECRET_KEY = process.env.PAYMENT_SECRET_KEY;

// Middleware for audit logging
const auditLogger = (req, res, next) => {
  console.log(`Audit log: ${req.method} ${req.url}`);
  next();
};

// Input validation function
const validateInput = (input) => {
  // Basic validation example, should be replaced with a proper validation library like Joi or Zod
  if (!input.username || !input.email || !input.phone || !input.password) {
    throw new Error("Invalid input");
  }
};

// Hash function for PII
const hashPII = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Register route with auditLogger middleware
router.post("/register", auditLogger, async (req, res) => {
  try {
    validateInput(req.body);
    const { username, email, phone, password } = req.body;

    // Hash email and phone
    const hashedEmail = hashPII(email);
    const hashedPhone = hashPII(phone);

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username: username,
      email: hashedEmail,
      phone: hashedPhone,
      password: hashedPassword,
    };

    // Use parameterized query to prevent SQL injection
    const result = await db.query(
      "INSERT INTO users (username, email, phone, password) VALUES ($1, $2, $3, $4)",
      [username, hashedEmail, hashedPhone, hashedPassword]
    );

    const token = signToken(newUser, PAYMENT_SECRET_KEY);

    res.json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// User route with auditLogger middleware
router.get("/user/:id", auditLogger, async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      throw new Error("Invalid user ID");
    }

    // Use parameterized query to prevent SQL injection
    const user = await db.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    res.json(user.rows[0]);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;