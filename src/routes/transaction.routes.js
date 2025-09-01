const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authOrApiKeyMiddleware = require('../middlewares/authOrApiKeyMiddleware');

router.post(
  '/',
  authOrApiKeyMiddleware,  //authMiddleware,
  //roleMiddleware(['POS_OWNER', 'STAFF']), 
  transactionController.createTransaction
);

router.get(
  '/:id',
  authOrApiKeyMiddleware,
  //roleMiddleware(['POS_OWNER', 'STAFF']),
  transactionController.getTransactionById
);

module.exports = router;


// As a best practice keep the resource name same as the file name
//var RESOURCE_NAME = 'transactions';
//var VERSION = 'v1';
//var URI = '/' + VERSION + '/' + RESOURCE_NAME;


