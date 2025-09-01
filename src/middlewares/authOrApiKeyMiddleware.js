const bcrypt = require('bcrypt');
const  Client  = require('../models/client'); // Requer o modelo de Client
const PosDevice = require('../models/auth/posDevice');

const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  // Pegando a chave da API do cabeçalho x-api-key
  const apiKeyHeader = req.headers['x-api-key'];

  // 🔐 Se veio a API Key no header x-api-key
  if (apiKeyHeader) {
    try {
      // Verificar se a API Key existe no banco
      const client = await Client.findOne({ where: { api_key: apiKeyHeader } });

      if (!client) {
        return res.status(401).json({ error: 'Invalid API Key' });
      }

      // Verificar se a chave está expirada
      if (client.expires_at && new Date(client.expires_at) < new Date()) {
        return res.status(401).json({ error: 'API Key expired' });
      }

      // Se a API Key for válida, adicione as informações do cliente no req

      const posDevice = await PosDevice.findOne({
      attributes: ['id'],
      where: { owner_id: client.id }
      });

      const posDeviceId = posDevice ? posDevice.id : null; 

      req.user = {
        id: client.id,
        user_id: client.user_id,
        role: client.role, // Caso exista campo de 'role'
        posDeviceId: posDeviceId
      };

      // Continue para o próximo middleware
      return next();
    } catch (err) {
      console.error(err); // Log para depuração
      return res.status(500).json({ error: 'Internal server error', details: err.message });
    }
  } else {
    return res.status(401).json({ error: 'No API Key provided' });
  }
};



/*
module.exports = async (req, res, next) => {
  //const authHeader = req.headers['authorization'];
  const apiKeyHeader = req.headers['x-api-key'];

  // 🔐 Se veio JWT no header Authorization
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    const token = parts[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = { id: decoded.id, role: decoded.role };
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }

  // 🔑 Se veio API Key
  if (apiKeyHeader) {
    try {
     
        // Buscar todas as chaves ativas
      const apiKeys = await APIKey.findAll({
      where: { is_active: true },
      include: { model: POSDevice } // ou { model: POSDevice, as: 'POSDevice' }
    });

    //console.log('minhas chaves', apiKeys);
     for (const key of apiKeys) {
      const match = await bcrypt.compare(apiKeyHeader, key.api_key_hash);
    
      if (match) {
        req.pos = {
          id: key.device_id,
          device: key.POSDevice,
          apiKeyId: key.id
        };
        return next();
      }
    }
       return res.status(401).json({ error: 'Invalid API Key' });

    } catch (err) {
      return res.status(500).json({ error: 'Failed to validate API Key' });
    }
  }

  return res.status(401).json({ error: 'No authentication provided' });
};

*/
