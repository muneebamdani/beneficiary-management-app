const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/users');
const beneficiaryRoutes = require('../routes/beneficiaries');
const tokenRoutes = require('../routes/tokens');
const dashboardRoutes = require('../routes/dashboard');
const searchRoutes = require('../routes/search');
const receptionistRoutes = require('../routes/receptionist');

// Middleware
const errorHandler = require('../middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (only once)
let isConnected = false;
async function connectToDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/receptionist', receptionistRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Global error handler
app.use(errorHandler);

// Export the handler for Vercel
module.exports = async (req, res) => {
  await connectToDB();
  return app(req, res);
};
