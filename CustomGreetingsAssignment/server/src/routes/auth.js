const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Register/Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      // For this assignment, we'll auto-register if user doesn't exist
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = new User({ email, password: hashedPassword, authMethod: 'email' });
      await user.save();
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Guest Login
router.post('/guest', async (req, res) => {
  try {
    const guestId = `guest_${Date.now()}`;
    const user = new User({ guestId, authMethod: 'guest', name: 'Guest User' });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get User Profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Google Login
router.post('/google', async (req, res) => {
  const { name, email, profilePic } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ 
        name, 
        email, 
        profilePic, 
        authMethod: 'google',
        isPremium: false 
      });
      await user.save();
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Update Profile
router.put('/profile', auth, async (req, res) => {
  const { name, profilePic } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { name, profilePic } },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
