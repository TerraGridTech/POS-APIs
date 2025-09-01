// jobScheduler.js
const { processTransaction, processDeadLetterMessages } = require('./messageProcessor');

// Processar a fila principal
setInterval(async () => {
  await processTransaction();
}, 5000); // A cada 5 segundos

// Processar a Dead-Letter Queue
setInterval(async () => {
  await processDeadLetterMessages();
}, 10000); // A cada 10 segundos
