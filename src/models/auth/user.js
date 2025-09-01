const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../database/sequelizeClient');

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
    type: DataTypes.ENUM('SYS_ADMIN','POS_OWNER', 'STAFF', 'END_USER'),
    allowNull: false,
    defaultValue: 'END_USER'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  } ,
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
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  paranoid: true
});

module.exports = User; 