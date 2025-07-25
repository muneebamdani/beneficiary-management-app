const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Route imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const beneficiaryRoutes = require('./routes/beneficiaries');
const tokenRoutes = require('./routes/tokens');
const dashboardRoutes = require('./routes/dashboard');
const searchRoutes = require('./routes/search');
const receptionistRoutes = require('./routes/receptionist'); // ✅ ADDED

// Middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend.onrender.com'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/receptionist', receptionistRoutes); // ✅ ADDED

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
