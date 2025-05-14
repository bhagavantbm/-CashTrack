const jwt = require('jsonwebtoken');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Set user ID for later use in routes
    req.user = { id: decoded.userId }; // Explicitly assign `id` for clarity

    next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate;
