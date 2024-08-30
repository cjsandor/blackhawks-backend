// File: blackhawks-backend/middleware/auth.js

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  console.log('Full Authorization header:', req.header('Authorization'));
  
  // Use a static token for testing
  const useStaticToken = process.env.USE_STATIC_TOKEN === 'true';
  const staticToken = process.env.STATIC_TOKEN;
  
  // Get token from header or use static token
  const token = req.header('Authorization')?.split(' ')[1] || null;
  console.log('Used token:', token);

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Token has expired. Please log in again.' });
    }
    console.error('Token verification failed:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};