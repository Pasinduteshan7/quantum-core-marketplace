const jwt = require('jsonwebtoken');

/**
 * ════════════════════════════════════════════════════════════════════════════════
 * 🔑 JWT TOKEN GENERATOR
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * 🎓 ARCHITECTURAL PATTERN: Stateless Authentication Token Factory
 * 
 * Generates an encrypted HMAC-SHA256 Bearer token containing the user's ID
 * and role claim. The server never stores session state in RAM; every incoming
 * request proves its identity mathematically via the cryptographic signature.
 */

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET || 'quantum_core_jwt_super_secret_key_3847291048572910',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

module.exports = generateToken;
