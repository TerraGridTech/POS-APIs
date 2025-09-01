// models/client.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelizeClient');

class Client extends Model {}

Client.init({
   id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
   user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  api_key: {
      type: DataTypes.STRING,
      allowNull: true, // ou false se for obrigatório
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true, // ou false
    },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  tax_id: DataTypes.STRING,
  address: DataTypes.TEXT,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  total_limit: {
    type: DataTypes.INTEGER,
    allowNull: true
  },tenant_id: {
    type: DataTypes.STRING,  
    allowNull: true,          
  }
}, {
  sequelize,
  modelName: 'client',
  tableName: 'clients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  paranoid: true,
  deletedAt: 'deleted_at'
});

Client.totalClients = async function () {
  return await this.count();
};

module.exports = Client;
