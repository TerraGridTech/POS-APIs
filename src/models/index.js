const { sequelize } = require('../database/sequelizeClient');
const User = require('./user');
const POSDevice = require('./posDevice');
const Client = require('./client');
const APIKey = require('./apiKey');
const AuditLog = require('./auditLog');
const RefreshToken = require('./refreshToken');
const PosDeviceLog = require('./auth/posDeviceLog');

// Associations
Client.belongsTo(User, {  foreignKey: 'user_id'});
User.hasMany(Client, {  foreignKey: 'user_id'});

POSDevice.belongsTo(Client, { foreignKey: 'owner_id' });

POSDevice.hasMany(APIKey, { foreignKey: 'device_id' });
APIKey.belongsTo(POSDevice, { foreignKey: 'device_id' });

User.hasMany(AuditLog, { foreignKey: 'user_id' });
AuditLog.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(RefreshToken, { foreignKey: 'user_id' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

//--------------
Client.hasMany(POSDevice, { foreignKey: 'owner_id', as: 'pos_devices' });
POSDevice.belongsTo(Client, { foreignKey: 'owner_id' });

Client.hasMany(PosDeviceLog, { foreignKey: 'owner_id' });
PosDeviceLog.belongsTo(Client, { foreignKey: 'owner_id' });


module.exports = {
  sequelize,
  User,
  POSDevice,
  APIKey,
  AuditLog,
  RefreshToken,
  Client,
  PosDeviceLog 
}; 