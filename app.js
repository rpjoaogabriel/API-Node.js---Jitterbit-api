require('dotenv').config();

const express = require('express');
const connectDB = require('./config/database');
const orderRoutes = require('./routes/order');

// ----------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------------------------------------------------
// Connect to MongoDB
// ----------------------------------------------------------------
connectDB();

// ----------------------------------------------------------------
// Global Middlewares
// ----------------------------------------------------------------
app.use(express.json());                          // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies

// ----------------------------------------------------------------
// Routes
// ----------------------------------------------------------------
app.use('/order', orderRoutes);

// Root health-check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Jitterbit Orders API is running 🚀' });
});

// ----------------------------------------------------------------
// 404 Handler — unmatched routes
// ----------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ----------------------------------------------------------------
// Global Error Handler
// ----------------------------------------------------------------
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ----------------------------------------------------------------
// Start Server
// ----------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
