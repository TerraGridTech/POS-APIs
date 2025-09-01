//apiKey.js
const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database/sequelizeClient');

class APIKey extends Model {}

APIKey.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  device_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  api_key_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'APIKey',
  tableName: 'api_keys',
  timestamps: false,
  paranoid: true
});

module.exports = APIKey; 