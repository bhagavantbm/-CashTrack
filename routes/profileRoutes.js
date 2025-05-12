const express = require('express');
const User = require('../models/User'); // Ensure this path is correct
const authenticate = require('../middleware/authMiddleware'); // Adjust the path if needed
const router = express.Router();

// Profile Route - GET /profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    // Fetch the user details from the database using the userId from the token
    const user = await User.findById(req.user.id).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile fetched successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

module.exports = router;
