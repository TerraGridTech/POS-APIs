
require("dotenv").config(); 
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize } = require('./models/auth');

const app = express();
// Security headers
app.use(helmet());
// Logging
app.use(morgan('combined'));
if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
    credentials: true
  }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

app.use(express.json());


// transaction routes
app.use('/api/transactions', require('../src/routes/transaction.routes'));
app.use('/api/test-mysql', require('../src/routes/testMySQLConnection.routes.js'));

// Log routes
app.use('/api/transaction/log', require('../src/routes/logRoutes'));

// Client 
app.use('/api/clients', require('../src/routes/clientsRoutes.js'));


// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app; 
