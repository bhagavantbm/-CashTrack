const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

<<<<<<< HEAD
const User = require(userModelPath);


router.post('/register', async (req, res) => {
  const { email, password,username} = req.body;
  
  console.log('Registration attempt:', email); // Log registration attempt
  
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
=======
// Register route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }
>>>>>>> 125050b5 (Fix registration route and API URL)

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

<<<<<<< HEAD
    console.log('Hashing password...');
    const hashed = await bcrypt.hash(password, 10);
    console.log('Password hashed');
    
    const user = new User({ email, password: hashed,username });
    await user.save();
    console.log('User saved');
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Error registering user' });
=======
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',  // Consistent with login expiry
    });

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      userEmail: newUser.email,
      username: newUser.username,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error during registration' });
>>>>>>> 125050b5 (Fix registration route and API URL)
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password,username } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Use bcrypt.compare directly (assuming User model has no comparePassword method)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      token,
<<<<<<< HEAD
      user: {
        id: user._id,
        email: user.email,
        name: user.username,
      }
=======
      userEmail: user.email,
      username: user.username,  // Send username for frontend use
>>>>>>> 125050b5 (Fix registration route and API URL)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in: ' + error.message });
  }
});

module.exports = router;
