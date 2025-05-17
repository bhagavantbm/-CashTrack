const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const router = express.Router();

// REGISTER Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  console.log("🔐 JWT_SECRET from env:", process.env.JWT_SECRET);

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const newUser = new User({ username, email, password });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '365d',
    });

    console.log('Sending registration response:', {
      message: 'User registered successfully',
      token,
      userEmail: newUser.email,
    });

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      userEmail: newUser.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

// LOGIN Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isPasswordValid);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '365d' }
    );

    console.log('Login Response:', {
      message: 'Login successful',
      token,
      user: {
        username: user.username,
        id: user._id,
        email: user.email,
      }
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      userEmail: user.email,
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
