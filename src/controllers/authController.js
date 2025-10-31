const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const { asyncHandler } = require('../middleware/errorHandler');

// Generate JWT token
const generateToken = userId => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

// Register new user
const register = asyncHandler(async (req, res) => {
  const { user_email, user_password, user_name, user_gender, user_birth } =
    req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(user_email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists',
    });
  }

  // Create new user
  const user = await User.create({
    user_email,
    user_password,
    user_name,
    user_gender,
    user_birth,
  });

  // Generate token
  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        email: user.user_email,
        name: user.user_name,
        gender: user.user_gender,
        birth: user.user_birth,
        active: user.user_active,
        created_at: user.created_at,
      },
      token,
    },
  });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { user_email, user_password } = req.body;

  // Find user by email
  const user = await User.findByEmail(user_email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Check if user is active
  if (!user.user_active) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated',
    });
  }

  // Verify password
  const isPasswordValid = await User.verifyPassword(
    user_password,
    user.user_password
  );
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  // Generate token
  const token = generateToken(user.id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.user_email,
        name: user.user_name,
        gender: user.user_gender,
        birth: user.user_birth,
        active: user.user_active,
        created_at: user.created_at,
        role: user.user_role,
      },
      token,
    },
  });
});

// Get current user profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.user_email,
        name: user.user_name,
        gender: user.user_gender,
        birth: user.user_birth,
        active: user.user_active,
        role: user.user_role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    },
  });
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const { user_name, user_gender, user_birth } = req.body;

  const updateData = {};
  if (user_name !== undefined) {
    updateData.user_name = user_name;
  }
  if (user_gender !== undefined) {
    updateData.user_gender = user_gender;
  }
  if (user_birth !== undefined) {
    updateData.user_birth = user_birth;
  }

  const user = await User.update(req.user.id, updateData);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user.id,
        email: user.user_email,
        name: user.user_name,
        gender: user.user_gender,
        birth: user.user_birth,
        active: user.user_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    },
  });
});

// Change password
const changePassword = asyncHandler(async (req, res) => {
  const { current_password, new_password } = req.body;

  // Get current user
  const user = await User.findByEmail(req.user.email);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Verify current password
  const isCurrentPasswordValid = await User.verifyPassword(
    current_password,
    user.user_password
  );
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect',
    });
  }

  // Hash new password
  const bcrypt = require('bcryptjs');
  const saltRounds = 12;
  const hashedNewPassword = await bcrypt.hash(new_password, saltRounds);

  // Update password
  await User.update(req.user.id, { user_password: hashedNewPassword });

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

// Logout (client-side token removal)
const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

// Admin functions for user management

// Get all users (admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  let result;
  if (search) {
    result = await User.search(search, parseInt(page), parseInt(limit));
  } else {
    result = await User.getAll(parseInt(page), parseInt(limit));
  }

  res.json({
    success: true,
    data: result,
  });
});

// Get user by ID (admin only)
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.user_email,
        name: user.user_name,
        gender: user.user_gender,
        birth: user.user_birth,
        active: user.user_active,
        role: user.user_role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    },
  });
});

// Update user (admin only)
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user_name, user_gender, user_birth, user_active, user_role } =
    req.body;

  // Check if user exists
  const existingUser = await User.findById(id);
  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const updateData = {};
  if (user_name !== undefined) {
    updateData.user_name = user_name;
  }
  if (user_gender !== undefined) {
    updateData.user_gender = user_gender;
  }
  if (user_birth !== undefined) {
    updateData.user_birth = user_birth;
  }
  if (user_active !== undefined) {
    updateData.user_active = user_active;
  }
  if (user_role !== undefined) {
    updateData.user_role = user_role;
  }

  const user = await User.update(id, updateData);

  res.json({
    success: true,
    message: 'User updated successfully',
    data: {
      user: {
        id: user.id,
        email: user.user_email,
        name: user.user_name,
        gender: user.user_gender,
        birth: user.user_birth,
        active: user.user_active,
        role: user.user_role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    },
  });
});

// Create user (admin only)
const createUser = asyncHandler(async (req, res) => {
  const {
    user_email,
    user_password,
    user_name,
    user_gender,
    user_birth,
    user_role = 'user',
    user_active = true,
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findByEmail(user_email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists',
    });
  }

  // Create new user
  const user = await User.createAdmin({
    user_email,
    user_password,
    user_name,
    user_gender,
    user_birth,
    user_role,
    user_active,
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: {
      user: {
        id: user.id,
        email: user.user_email,
        name: user.user_name,
        gender: user.user_gender,
        birth: user.user_birth,
        active: user.user_active,
        role: user.user_role,
        created_at: user.created_at,
      },
    },
  });
});

// Delete user (admin only)
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if user exists
  const existingUser = await User.findById(id);
  if (!existingUser) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Prevent admin from deleting themselves
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account',
    });
  }

  await User.delete(id);

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
