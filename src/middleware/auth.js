const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { query } = require('../../config/database');

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    // Get user from database to ensure user still exists and is active
    const userResult = await query(
      'SELECT id, user_email, user_name, user_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.',
      });
    }

    if (!userResult.rows[0].user_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.',
      });
    }

    req.user = {
      id: decoded.userId,
      email: userResult.rows[0].user_email,
      name: userResult.rows[0].user_name,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.',
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// Check if user is admin
const requireAdmin = async (req, res, next) => {
  try {
    const userResult = await query(
      'SELECT user_role FROM users WHERE id = $1',
      [req.user.id]
    );

    if (
      userResult.rows.length === 0 ||
      userResult.rows[0].user_role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.jwt.secret);

    const userResult = await query(
      'SELECT id, user_email, user_name, user_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length > 0 && userResult.rows[0].user_active) {
      req.user = {
        id: decoded.userId,
        email: userResult.rows[0].user_email,
        name: userResult.rows[0].user_name,
      };
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

module.exports = {
  verifyToken,
  requireAdmin,
  optionalAuth,
};
