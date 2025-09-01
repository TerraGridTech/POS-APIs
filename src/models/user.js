const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database/sequelizeClient');

class User extends Model {}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('POS_OWNER', 'STAFF', 'END_USER','SYS_ADMIN'),
    allowNull: false,
    defaultValue: 'END_USER'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
  type: DataTypes.DATE,
  allowNull: true,
},
updatedAt: {
  type: DataTypes.DATE,
  allowNull: true,  
}
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  paranoid: true
});

module.exports = User; 