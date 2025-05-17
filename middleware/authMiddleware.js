const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // ✅ store user ID from token
    next();
  } catch (error) {
    console.error('Token error:', error);
    res.status(401).json({ message: 'Token failed' });
  }
};

module.exports = protect;
