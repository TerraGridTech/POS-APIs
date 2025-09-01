const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../database/sequelizeClient');

class RefreshToken extends Model {}

RefreshToken.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  token_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  revoked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'RefreshToken',
  tableName: 'refresh_tokens',
  timestamps: false,
  paranoid: true
});

module.exports = RefreshToken; 