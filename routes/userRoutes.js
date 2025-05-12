const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const User = require('../models/user'); // Make sure this path is correct
const path = require('path');
console.log('Current directory:', __dirname);  // Log the current directory
const userModelPath = path.join(__dirname, '../models/user');
console.log('User model path:', userModelPath);  // Log the resolved path

const User = require(userModelPath);

const authenticate = require('../middleware/authMiddleware');
const router = express.Router();


// REGISTER Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'Name, email, and password are required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '365d',
    });

    res.status(201).json({ token, userEmail: newUser.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// LOGIN Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if the password is correct using bcrypt.compare
    const isPasswordValid = await bcrypt.compare(password, user.password); // Corrected comparison

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET, // Use your actual JWT secret
      { expiresIn: '1h' }
    );

    // Send the response with the token and email
    return res.json({ token, userEmail: user.email });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update user's profile picture (Optional if you have such functionality)


module.exports = router;
