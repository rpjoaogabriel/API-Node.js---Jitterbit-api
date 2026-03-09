const jwt = require('jsonwebtoken');

/**
 * Middleware to verify a JWT Bearer token.
 * Usage: add `authenticate` to any route that requires auth.
 *
 * Header format:  Authorization: Bearer <token>
 *
 * Generate a token for testing:
 *   const jwt = require('jsonwebtoken');
 *   jwt.sign({ user: 'test' }, process.env.JWT_SECRET, { expiresIn: '24h' });
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

/**
 * Utility: generate a signed token (for dev/testing purposes).
 */
const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });

module.exports = { authenticate, generateToken };
