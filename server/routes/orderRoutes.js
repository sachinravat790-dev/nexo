const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getAdminStats,
} = require('../controllers/orderController');

// 1. User Order Actions
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);

// 2. Admin Analytics & All Orders (Inhe :id se upar rakhna zaroori hai)
router.get('/all', getAllOrders);
router.get('/admin/stats', getAdminStats);
router.put('/:id/status', updateOrderStatus);

// 3. Single Order by ID
router.get('/:id', protect, getOrderById);

module.exports = router;