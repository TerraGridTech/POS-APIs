// routes/logRoutes.js
const express = require('express');
const router = express.Router();
const { logRegister } = require('../controllers/logController');

router.post('/', logRegister);

module.exports = router;
