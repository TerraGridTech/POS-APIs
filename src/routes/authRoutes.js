const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

// Register POS owner
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ],
  authController.register
);


router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ],
  authController.login
);

// Verify JWT
router.post('/verify', authController.verify);

// RBAC management
router.get('/roles', authController.getRoles);
router.put('/roles', authController.updateRole);

module.exports = router; 