const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database/sequelizeClient');

class POSDevice extends Model {}

POSDevice.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  sys_admin_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  device_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  registered_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
  type: DataTypes.DATE,
  allowNull: true,
},
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'POSDevice',
  tableName: 'pos_devices',
  timestamps: true,
  paranoid: true
});

module.exports = POSDevice; 