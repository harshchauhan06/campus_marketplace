const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// @route   POST /api/auth/register
// @desc    Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, department, year } = req.body;

    // 1. Check if user already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Insert user into the database
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash, department, year) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, is_verified',
      [name, email, passwordHash, department, year]
    );

    // 4. Return success response (we could return a JWT here, but forcing login is also fine)
    res.status(201).json({
      message: 'User registered successfully',
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error('Error in registerUser:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // 2. Compare passwords
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // 3. Generate JWT
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    // 4. Return user and token
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_verified: user.is_verified,
      }
    });
  } catch (error) {
    console.error('Error in loginUser:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// @route   GET /api/auth/me
// @desc    Get current logged in user
const getMe = async (req, res) => {
  try {
    const userResult = await pool.query('SELECT id, name, email, department, year, profile_image, is_verified, created_at FROM users WHERE id = $1', [req.user.id]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userResult.rows[0]);
  } catch (error) {
    console.error('Error in getMe:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
