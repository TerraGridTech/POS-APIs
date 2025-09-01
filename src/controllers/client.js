// controllers/clienteController.js
const Client  = require('../models/client');


exports.getAllClients = async (req, res) => {
  const clients = await Client.getAll();
   res.json(clients);
};

exports.getClient = async (req, res) => {
  const client = await Client.getById(req.params.id);
  if (!client) return res.status(404).json({ error: 'Cliente não encontrado' });
  res.json(client);
};

exports.addClient = async (req, res) => {
  const newClient = await Client.createOne(req.body);
  res.status(201).json(newClient);
};

exports.updateClient = async (req, res) => {
  const client = await Client.updateById(req.params.id, req.body);
  res.json(client);
};

exports.patchClient = async (req, res) => {
  const client = await Client.patchById(req.params.id, req.body);
  res.json(client);
};

exports.deleteClient = async (req, res) => {
  await Client.deleteById(req.params.id);
  res.status(204).end();
};
