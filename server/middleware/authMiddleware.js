const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');
const userStore = require('../utils/userStore');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexo_jwt_secret_key');

      // 1. Try finding in MongoDB if connected
      if (mongoose.connection.readyState === 1) {
        try {
          req.user = await User.findById(decoded.id).select('-password');
        } catch (dbErr) {
          // Silently fallback to userStore
        }
      }

      // 2. Fallback to userStore
      if (!req.user) {
        const memUser = userStore.findById(decoded.id);
        if (memUser) {
          const { password, ...userWithoutPassword } = memUser;
          req.user = userWithoutPassword;
        }
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User session expired. Please log in again.' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
