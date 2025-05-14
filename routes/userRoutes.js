const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
 // Make sure this path is correct
const path = require('path');
console.log('Current directory:', __dirname);  // Log the current directory
const userModelPath = path.join(__dirname, '../models/User.js');
console.log('User model path:', userModelPath);  // Log the resolved path


const User = require(userModelPath);

const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

console.log('Saved User:', User);
router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;

  console.log('Request body:', req.body); // Log the request body to check if username is included

  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Email, password, and username required' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ username,email, password: hashed});
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Error registering user' });
  }
});


// LOGIN Route
router.post('/login', async (req, res) => {
  const { email, password,username} = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Login Response:', {
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        id: user._id,
        email: user.email,
         // Should be included here
      }
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        id: user._id,
        email: user.email,
         // Ensure this is being returned
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in: ' + error.message });
  }
});



module.exports = router;
