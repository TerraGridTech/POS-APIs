const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../../database/sequelizeClient');

class POSDevice extends Model {

 static async totalPosDevice(){
  return this.count();
 }

}

POSDevice.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  sys_admin_id: {
    type: DataTypes.UUID,
    allowNull: true,
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
 // createdAt: {
 //   type: DataTypes.DATE,
 //   field: 'created_at'
 // },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  },
  deletedAt: {
    type: DataTypes.DATE,
    field: 'deleted_at'
  },
  device_limit: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'POSDevice',
  tableName: 'pos_devices',
  timestamps: false,
  paranoid: false
});

module.exports = POSDevice; 