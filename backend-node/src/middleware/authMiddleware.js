const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🛡️ AUTHENTICATION & AUTHORIZATION MIDDLEWARE
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PATTERN: Chain of Responsibility (Border Control)
 * 
 * 1. THE HISTORICAL PROBLEM:
 *    Without centralized authentication middleware, developers had to verify
 *    passwords or session cookies inside every single controller. If one developer
 *    forgot the check on `deleteProduct`, an unauthenticated stranger could wipe inventory.
 * 
 * 2. THE DESIGN PATTERN:
 *    This middleware intercepts the request BEFORE it reaches any controller.
 *    If the Bearer token is missing, expired, or tampered with, the request is
 *    immediately terminated with HTTP 401 Unauthorized.
 * 
 * 3. ROSETTA STONE:
 *    Spring Boot: JwtAuthenticationFilter (OncePerRequestFilter) + SecurityConfig
 *    Node.js:     protect middleware + admin middleware
 */

// 1. Protect: Validates JWT token and attaches authenticated user to req.user
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Cryptographically verify signature using secret
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'quantum_core_jwt_super_secret_key_3847291048572910'
      );

      // Fetch user from MongoDB (excluding password) and attach to request context
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists'
        });
      }

      return next(); // Pass control to the next middleware or controller
    } catch (error) {
      console.error('JWT Verification Failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: token is invalid or has expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: no Bearer token provided in Authorization header'
    });
  }
};

// 2. Admin: Enforces Role-Based Access Control (RBAC)
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'ROLE_ADMIN') {
    return next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied: administrative privileges required'
    });
  }
};

module.exports = { protect, admin };
