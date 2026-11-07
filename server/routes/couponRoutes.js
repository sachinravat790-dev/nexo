const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { applyCoupon, getAllCoupons } = require('../controllers/couponController');

// 1. Get all public active coupons
router.get('/', getAllCoupons);

// 2. Apply and validate coupon (Protected so student status can be verified)
router.post('/apply', protect, applyCoupon);

module.exports = router;
