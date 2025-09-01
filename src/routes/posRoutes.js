const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const posController = require('../controllers/posController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Register POS device
router.post(
  '/register',
  authMiddleware,
  roleMiddleware(['POS_OWNER', 'SYS_ADMIN']),
  [body('device_name').isString().isLength({ min: 2 }).withMessage('Device name required')],
  posController.registerDevice
);

// Generate API key for POS device
//router.post('/keygen', posController.generateApiKey);
router.post('/keygen', authMiddleware, roleMiddleware(['POS_OWNER','SYS_ADMIN']), posController.generateApiKey);


module.exports = router; 