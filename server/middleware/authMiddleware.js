const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check if token is present in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 'Bearer <token>' me se sirf token nikaalo
      token = req.headers.authorization.split(' ')[1];

      // 2. Token ko secret key se verify karo
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexo_jwt_secret_key');

      // 3. User ko database se fetch karo (password chhod kar)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found with this token' });
      }

      next(); // Sab sahi hai, ab agle function par jao
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  // Agar token header me nahi hai
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };