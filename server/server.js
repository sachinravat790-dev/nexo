const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve Uploaded Student ID Photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Route
app.get('/', (req, res) => {
  res.send('🚀 NEXO Backend API is Running! Go to <a href="/api/health">/api/health</a> for status.');
});

// Health Check API
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected (Pending Setup)';
  res.status(200).json({
    status: 'success',
    project: 'NEXO - Shop Smart. Live Better.',
    message: 'NEXO Backend is Live and Running!',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Auth Routes (Day 2)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Product Routes (Day 3)
const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

// Student Verification Routes (Day 6)
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/student', studentRoutes);

// Coupon Engine Routes (Day 7)
const couponRoutes = require('./routes/couponRoutes');
app.use('/api/coupons', couponRoutes);

// Order Checkout Routes (Day 7)
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);

// Database Connection (Async - Will not crash server if disconnected)
const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log('ℹ️ MONGO_URI not provided. Running in standalone mode.');
    return;
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
  } catch (err) {
    console.log('⚠️ MongoDB not connected yet:', err.message);
    console.log('👉 Server will still run. Set up MongoDB Atlas or local MongoDB to connect DB.');
  }
};

connectDB();

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 NEXO Server running at http://localhost:${PORT}`);
});
