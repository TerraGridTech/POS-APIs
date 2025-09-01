const { processReceipt } = require('../services/receiptService');

const sampleReceipt = {
  store_id: 'STORE001',
  pos_terminal_id: 'POS01',
  transaction_id: 'TXN123456',
  date: new Date().toISOString(),
  customer: {
    name: 'Ravi Kumar',
    phone: '+919876543210',
    email: 'ravi@example.com'
  },
  items: [
    {
      item_id: 'ITEM001',
      name: 'Paneer Roll',
      quantity: 2,
      price: 120,
      discount: 10,
      tax: 5
    }
  ],
  payment_method: 'UPI'
};

processReceipt(sampleReceipt)
  .then(result => {
    console.log('Recibo processado com sucesso:', result);
  })
  .catch(err => {
    console.error('Erro ao processar recibo:', err);
  });
