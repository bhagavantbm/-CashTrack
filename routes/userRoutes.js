const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

<<<<<<< HEAD
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
=======
// REGISTER Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  console.log("🔐 JWT_SECRET from env:", process.env.JWT_SECRET); // <-- ADD THIS LINE

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
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

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      userEmail: newUser.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during registration' });
>>>>>>> 125050b5 (Fix registration route and API URL)
  }
});


<<<<<<< HEAD
=======

>>>>>>> 125050b5 (Fix registration route and API URL)
// LOGIN Route
router.post('/login', async (req, res) => {
  const { email, password,username} = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

<<<<<<< HEAD
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
=======
    const isPasswordValid = await bcrypt.compare(password, user.password);
>>>>>>> 125050b5 (Fix registration route and API URL)

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

<<<<<<< HEAD
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



=======
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '365d' }
    );

    res.json({ token, userEmail: user.email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

>>>>>>> 125050b5 (Fix registration route and API URL)
module.exports = router;
