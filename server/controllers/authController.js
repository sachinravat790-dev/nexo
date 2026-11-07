const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userStore = require('../utils/userStore');

// Helper function: JWT Token generator
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'nexo_jwt_secret_key', {
    expiresIn: '7d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 2. Try MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const userExists = await User.findOne({ email: cleanEmail });
        if (userExists) {
          return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
          name: name.trim(),
          email: cleanEmail,
          password: hashedPassword,
          role: role || 'customer',
        });

        const token = generateToken(user._id, user.role);

        // Also sync to userStore
        userStore.saveUser({
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          studentDetails: user.studentDetails,
        });

        return res.status(201).json({
          success: true,
          message: 'Account created successfully!',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            studentDetails: user.studentDetails,
          },
        });
      } catch (dbErr) {
        console.log('ℹ️ MongoDB signup failed, seamlessly switching to local storage:', dbErr.message);
      }
    }

    // 3. Resilient Fallback to userStore (Guaranteed to work regardless of DB status)
    const existing = userStore.findByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists. Please Sign In!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const savedUser = userStore.saveUser({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: role || 'customer',
    });

    const token = generateToken(savedUser._id, savedUser.role);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        studentDetails: savedUser.studentDetails,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Signup failed', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 2. Try MongoDB if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({ email: cleanEmail });
        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            const token = generateToken(user._id, user.role);

            // Sync to userStore
            userStore.saveUser({
              _id: user._id.toString(),
              name: user.name,
              email: user.email,
              password: user.password,
              role: user.role,
              studentDetails: user.studentDetails,
            });

            return res.status(200).json({
              success: true,
              message: 'Logged in successfully!',
              token,
              user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                studentDetails: user.studentDetails,
              },
            });
          }
        }
      } catch (dbErr) {
        console.log('ℹ️ MongoDB login failed, checking local user store:', dbErr.message);
      }
    }

    // 3. Fallback to userStore
    const user = userStore.findByEmail(cleanEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentDetails: user.studentDetails,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
