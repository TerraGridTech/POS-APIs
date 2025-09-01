const jwt = require('jsonwebtoken');

exports.generateAccessToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || '15m') =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

exports.verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

exports.parseDuration = (str) => {
  const match = str.match(/(\d+)([smhd])/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7d
  const num = parseInt(match[1]);
  switch (match[2]) {
    case 's': return num * 1000;
    case 'm': return num * 60 * 1000;
    case 'h': return num * 60 * 60 * 1000;
    case 'd': return num * 24 * 60 * 60 * 1000;
    default: return 7 * 24 * 60 * 60 * 1000;
  }
}; 