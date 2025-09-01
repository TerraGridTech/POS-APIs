// models/client.js
const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../database/sequelizeClient');

class Client extends Model {
  static async getAll() {
    return this.findAll({ where: { is_active: true } });
  }

  static async getById(id) {
    return this.findByPk(id);
  }

  static async updateById(id, data) {
    await this.update(data, { where: { id } });
    return this.getById(id);
  }

  static async deleteById(id) {
    return this.destroy({ where: { id } });
  }

  static async patchById(id, data) {
   // await this.update(data, { where: { id } });
    //return this.getById(id);
    const client = await Client.findByPk(id);
    client.is_active = !client.is_active;
     await client.save();
     return client;

  }

  static async createOne(data) {
    return this.create(data);
  }

  static async getLimits() {
    return this.findAll({ attributes: ['id', 'name', 'total_limit'] ,  where: { is_active: true }  });
    //this.findAll({ where: { is_active: true } });
  }

  static async getLimitById(id) {
  const client = await this.findByPk(id, {
    include: ['pos_devices'], // ou use { model: PosDevice, as: 'pos_devices' }
  });

  if (!client) return null;

  const pos_devices = client.pos_devices.map(device => ({
   id: device.id,
   device_name: device.device_name,
   device_limit: device.device_limit,
   client_id: device.client_id // <-- substitua aqui
  }));
  
  return {
    id: client.id,
    client: client.name,        // ajuste conforme seu campo
    total_limit: client.total_limit,  // ou outro campo
    pos_devices,
  };
}


  static async updateLimitById(id, total_limit) {
    await this.update({ total_limit }, { where: { id } });
    return this.getById(id);
  }

  static async deleteLimitById(id) {
    await this.update({ limit: null }, { where: { id } });
    return this.getById(id);
  }
}

Client.init({
  user_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  tax_id: DataTypes.STRING,
  address: DataTypes.TEXT,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  total_limit: {
    type: DataTypes.INTEGER,
    allowNull: true
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
