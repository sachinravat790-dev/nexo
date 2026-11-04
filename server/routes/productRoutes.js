const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct } = require('../controllers/productController');

// Public Routes (Koi bhi browse kar sakta hai)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin Route (Product create karna)
router.post('/', createProduct);

module.exports = router;