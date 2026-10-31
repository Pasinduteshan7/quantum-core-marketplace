const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🔐 AUTHENTICATION CONTROLLER
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PATTERN: Front-Controller Request Handler
 * 
 * 1. THE HISTORICAL PROBLEM:
 *    Putting validation, password verification, token generation, and DB queries
 *    in route files causes monolithic spaghetti code that cannot be unit-tested.
 * 
 * 2. THE DESIGN PATTERN:
 *    Controllers handle ONLY HTTP interactions (status codes, req.body, res.json).
 *    They delegate encryption to models and token generation to dedicated utilities.
 */

// @desc    Register a new customer account
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    // Create user (password is automatically hashed by User.js pre-save hook)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: 'ROLE_CUSTOMER'
    });

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Return identical response shape to Spring Boot AuthResponse
    res.status(201).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and explicitly select password (since select: false is on schema)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // Verify user exists and password hash matches
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current authenticated user profile
// @route   GET /api/auth/me
// @access  Private (Authenticated)
const getMe = async (req, res, next) => {
  try {
    // req.user was already populated by the authMiddleware (protect)
    res.status(200).json({
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe };
