const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../database/sequelizeClient');
const  POSDevice  = require('./posDevice');
const Client = require('../Client');

class posDeviceLog extends Model {

  static async getAll() {
    return this.findAll({ where: { is_active: true } });
  }

   static async totalError() {
  return await this.count({ where: { status: 'failed' } });
  } 

   static async posDeviceLogRecentErrors() {
    return this.findAll({
      where: { status: 'failed' },
      order: [['id', 'DESC']],
      limit: 5
    });
  }

  static async diviceLog () {
  return this.findAll({
    attributes: [ // pega todos os campos do posDeviceLog
      'id',
      'pos_device_id',
      'client_id',
      'transaction_id',
      'transaction_type',
      'status',
      'duration_ms',
      'created_at'
    ],
    include: [
      {
        model: POSDevice,
        attributes: ['device_name'] // substitua por 'device_name' se for o nome correto
      },
      {
        model: Client,
        attributes: ['name'] // substitua por 'full_name', 'client_name', etc., se for o caso
      }
    ]
  });
}

}

posDeviceLog.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
   pos_device_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  client_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  transaction_id: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  transaction_type:{
    type: DataTypes.TEXT,
    allowNull: true
  },
  status:{
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration_ms: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'posDeviceLog',
  tableName: 'pos_device_logs',
  timestamps: false 
});
  
module.exports = posDeviceLog;
