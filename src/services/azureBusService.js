// serviceBusClient.js

const { ServiceBusClient } = require('@azure/service-bus');



// Conectar ao Azure Service Bus
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const queueName = 'pos-transactions'; // Nome da fila
const deadLetterQueueName = `$DeadLetterQueue`; // Fila de mensagens mortas

const serviceBusClient = ServiceBusClient.createFromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const sender = serviceBusClient.createSender(queueName);
const receiver = serviceBusClient.createReceiver(queueName, { receiveMode: 'peekLock' }); // Usando PeekLock para garantir que a mensagem não é removida da fila até que seja processada com sucesso

const deadLetterReceiver = serviceBusClient.createReceiver(deadLetterQueueName, { receiveMode: 'peekLock' });

module.exports = {
  sender,
  receiver,
  deadLetterReceiver
};
