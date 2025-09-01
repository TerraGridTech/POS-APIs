const { sequelize } = require('../../database/sequelizeClient');
const User = require('./user');
const POSDevice = require('./posDevice');
const APIKey = require('./apiKey');
const AuditLog = require('./auditLog');
const RefreshToken = require('./refreshToken');

// Associations
User.hasMany(POSDevice, { foreignKey: 'owner_id' });
POSDevice.belongsTo(User, { foreignKey: 'owner_id' });

POSDevice.hasMany(APIKey, { foreignKey: 'device_id' });
APIKey.belongsTo(POSDevice, { foreignKey: 'device_id' });

User.hasMany(AuditLog, { foreignKey: 'user_id' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(RefreshToken, { foreignKey: 'user_id' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  POSDevice,
  APIKey,
  AuditLog,
  RefreshToken
}; 