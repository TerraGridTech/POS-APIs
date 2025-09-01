const express = require('express');
const {getAllClients} = require('../controllers/client');
const router = express.Router();
router.get('/', getAllClients);

module.exports = router;