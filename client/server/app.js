require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mortgageRoutes = require('./routes/mortgageRoutes');
const logger = require('./utils/logger'); // Custom logger utility

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? 'https://your-production-domain.com' : '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet()); // Security middleware

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB connected'); // Use structured logging
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/mortgage', mortgageRoutes);

// Centralized error handler
app.use((err, req, res, next) => {
  logger.error('Server error:', err); // Log the error

  if (process.env.NODE_ENV === 'production') {
    res.status(500).send('An unexpected error occurred. Please try again later.');
  } else {
    // Provide more detailed error information in development
    res.status(500).json({ message: 'An error occurred', error: err.message, stack: err.stack });
  }
});

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally, implement a notification system for unhandled rejections
});

process.on('uncaughtException', (error) => {
  logger.fatal('Uncaught Exception:', error);
  // Restart the process or implement a more graceful shutdown
  process.exit(1);
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
