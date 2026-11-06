const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  submitVerification,
  getPendingVerifications,
  reviewVerification,
} = require('../controllers/studentController');

// 1. Student Document Upload Route (Student must be logged in to upload)
router.post('/verify', protect, upload.single('document'), submitVerification);

// 2. Admin Verification Queue Portal (Directly accessible for review & approval)
router.get('/admin/pending', getPendingVerifications);
router.put('/admin/review/:userId', reviewVerification);

module.exports = router;
