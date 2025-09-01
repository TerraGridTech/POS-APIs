
const express = require('express');
const app = express();

const mysqlDb = require('../database/mysqlDbContext');

app.get('/', async (req, res) => {
  try {
    const result = await mysqlDb.testConnection();
    res.json({ success: true, time: result.now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = app;