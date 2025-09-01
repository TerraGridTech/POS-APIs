const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../database/sequelizeClient');

class POSDevice extends Model {}

POSDevice.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  device_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  registered_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at'
  }
}, {
  sequelize,
  modelName: 'POSDevice',
  tableName: 'pos_devices',
  timestamps: true,
  paranoid: true
});

module.exports = POSDevice; 