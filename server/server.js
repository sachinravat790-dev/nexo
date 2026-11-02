const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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
