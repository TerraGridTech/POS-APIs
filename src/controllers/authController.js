const { User, AuditLog } = require('../models');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, role } = req.body;
  try {
    // Check if user exists
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    const password_hash = await bcrypt.hash(password, saltRounds);
    // Create user
    const user = await User.create({
      email,
      password_hash,
      role,
      is_active: true
    });
    // Audit log
    await AuditLog.create({
      user_id: user.id,
      action: 'REGISTER',
      ip_address: req.ip,
      details: { email }
    });
    return res.status(201).json({ message: 'POS owner registered successfully', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  console.log('estou aqui');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email, is_active: true } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // JWT
    const jwt = require('jsonwebtoken');
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '60m' }
    );
    // Refresh token
    const { v4: uuidv4 } = require('uuid');
    const refreshTokenRaw = uuidv4() + uuidv4();
    const refreshTokenHash = await bcrypt.hash(refreshTokenRaw, 10);
    const expiresAt = new Date(Date.now() + (parseDuration(process.env.REFRESH_TOKEN_EXPIRES_IN || '7d')));
    await require('../models/refreshToken').create({
      user_id: user.id,
      token_hash: refreshTokenHash,
      created_at: new Date(),
      expires_at: expiresAt,
      revoked: false
    });
    // Audit log
    await AuditLog.create({
      user_id: user.id,
      action: 'LOGIN',
      ip_address: req.ip,
      details: { email }
    });
    
    return res.json({
      accessToken,
      refreshToken: refreshTokenRaw,
      expiresIn: process.env.JWT_EXPIRES_IN || '60m',
      role: user.role
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Login failed' });
  }
};

exports.verify = async (req, res) => {
  try {
    let token = req.body.token;
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ valid: true, user: { id: decoded.id, role: decoded.role } });
  } catch (err) {
    return res.status(401).json({ valid: false, error: 'Invalid or expired token' });
  }
};

exports.getRoles = async (req, res) => {
  // TODO: Implement RBAC role retrieval
  res.status(501).json({ message: 'Not implemented' });
};

exports.updateRole = async (req, res) => {
  // TODO: Implement RBAC role update
  res.status(501).json({ message: 'Not implemented' });
};

// Helper to parse duration strings like '7d', '15m'
function parseDuration(str) {
  const match = str.match(/(\\d+)([smhd])/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7d
  const num = parseInt(match[1]);
  switch (match[2]) {
    case 's': return num * 1000;
    case 'm': return num * 60 * 1000;
    case 'h': return num * 60 * 60 * 1000;
    case 'd': return num * 24 * 60 * 60 * 1000;
    default: return 7 * 24 * 60 * 60 * 1000;
  }
} 