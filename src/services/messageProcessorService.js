// messageProcessorService.js
const { receiver, deadLetterReceiver } = require('../azureBusService');

async function processTransaction() {
  const messages = await receiver.receiveMessages(10, { maxWaitTimeInMs: 5000 }); // Recebe até 10 mensagens de uma vez

  for (const message of messages) {
    try {
      const receiptData = message.body;
      console.log('Processando transação:', receiptData);

      // Simule o processamento da transação, por exemplo, chamando o método `processReceipt`
      const result = await processReceipt(receiptData); // A função processReceipt que você já tem no seu código

      // Se a transação for processada com sucesso, completa a mensagem
      await receiver.completeMessage(message);
      console.log('Transação processada com sucesso');
    } catch (error) {
      console.error('Erro ao processar a mensagem:', error);
      
      // Se ocorrer erro, a mensagem será movida para a Dead-Letter Queue automaticamente após o número de tentativas de retry
      await receiver.abandonMessage(message); // Faz a mensagem voltar para a fila para nova tentativa
    }
  }
}

// Função para processar mensagens da Dead-Letter Queue
async function processDeadLetterMessages() {
  const messages = await deadLetterReceiver.receiveMessages(10, { maxWaitTimeInMs: 5000 });

  for (const message of messages) {
    try {
      const receiptData = message.body;
      console.log('Processando mensagem da Dead-Letter Queue:', receiptData);

      // Aqui você pode registrar o erro ou reprocessar manualmente se necessário
      // Exemplo: salvar em um banco de dados de erros para análise futura

      await deadLetterReceiver.completeMessage(message); // Marca como processada
      console.log('Mensagem da Dead-Letter Queue processada');
    } catch (error) {
      console.error('Erro ao processar mensagem da Dead-Letter Queue:', error);
    }
  }
}

module.exports = {
  processTransaction,
  processDeadLetterMessages
};
