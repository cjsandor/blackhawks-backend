const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  console.log('Full Authorization header:', req.header('Authorization'));
  
  // Use a static token for testing
  const useStaticToken = process.env.USE_STATIC_TOKEN === 'true';
  const staticToken = process.env.STATIC_TOKEN;
  
  // Get token from header or use static token
  const token = useStaticToken ? staticToken : (req.header('Authorization')?.split(' ')[1] || null);
  console.log('Used token:', token);

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};