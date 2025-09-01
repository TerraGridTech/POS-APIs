const { POSDevice, AuditLog, APIKey, Client } = require('../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

exports.registerDevice = async (req, res) => {
  // Only POS_OWNER can register
  if (req.user.role !== 'POS_OWNER' &&  req.user.role !== 'SYS_ADMIN') {
    return res.status(403).json({ error: 'Only POS owners can register devices' });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { device_name } = req.body;
  console.log("cheguei aqui 1");
  try {

    // Verifique se o cliente existe (para POS_OWNER)
   // const client = await Client.findOne({ where: { id: req.user.id } });
   // if (!client) {
   //   return res.status(400).json({ error: 'Client not found, cannot register device' });
   // }

    // Preparar dados para criação do dispositivo
    const deviceData = {
      device_name,
      registered_at: new Date(),
      is_active: true
    };

    // Verifique o papel do usuário e defina a chave correspondente
    if (req.user.role === 'POS_OWNER') {
      deviceData.owner_id = req.user.id;
    } else if (req.user.role === 'SYS_ADMIN') {
      deviceData.sys_admin_id = req.user.id;
    }

    // Registrar o dispositivo
    const device = await POSDevice.create(deviceData);

    console.log("cheguei aqui 2");
    await AuditLog.create({
      user_id: req.user.id,
      action: 'POS_DEVICE_REGISTER',
      ip_address: req.ip,
      details: { device_id: device.id, device_name }
    });
    console.log("cheguei aqui 3");
    return res.status(201).json({ device });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Device registration failed' });
  }
};

exports.generateApiKey = async (req, res) => {
  // Only POS_OWNER can generate
 console.log('pos_owner', req.user);
  if (!req.user || (req.user.role !== 'POS_OWNER' && req.user.role !== 'SYS_ADMIN')) {
    return res.status(403).json({ error: 'Only POS owners can generate API keys' });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
   
  const { device_id } = req.body;
  console.log('pos_owner', req.body);
  try {
   console.log('Request body:', );
    // Check device ownership

const device = await POSDevice.findOne({
  where: {
    id: device_id,
    is_active: true,
    [Op.or]: [
      { owner_id: req.user.id },
      { sys_admin_id: req.user.id }
    ]
  }
});

    if (!device) {
      return res.status(404).json({ error: 'Device not found or not owned by user' });
    }
    // Generate API key
    const apiKeyRaw = uuidv4() + uuidv4();
    const apiKeyHash = await bcrypt.hash(apiKeyRaw, 12);
    const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year expiry
    const apiKey = await APIKey.create({
      device_id: device.id,
      api_key_hash: apiKeyHash,
      created_at: new Date(),
      expires_at: expiresAt,
      is_active: true
    });
    await AuditLog.create({
      user_id: req.user.id,
      action: 'API_KEY_GENERATE',
      ip_address: req.ip,
      details: { device_id: device.id, api_key_id: apiKey.id }
    });
    return res.status(201).json({ apiKey: apiKeyRaw, expires_at: expiresAt });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'API key generation failed' });
  }
}; 