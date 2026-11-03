const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public Routes (Koi bhi access kar sakta hai)
router.post('/signup', signup);
router.post('/login', login);

// Protected Route (Sirf logged-in user with token hi access kar sakta hai)
router.get('/me', protect, getMe);

module.exports = router;