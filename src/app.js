const express = require('express');
const cors = require('cors');
const morgan = require('morgan');


const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/client', require('../src/routes/client'));

// Rotas
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/pos', require('./routes/posRoutes'));

module.exports = app;