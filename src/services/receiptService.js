const { uploadBlob } = require('./blobStorage');
const { generatePdfBuffer } = require('./pdfService');
const { generateQrCodeBuffer } = require('./qrCodeService');
const cosmosDb = require('../database/cosmosDbContext');
const mysqlDb = require('../database/mysqlDbContext');
const path = require('path');
const { check } = require('zod/v4');

async function processReceipt(receiptData) {
  try {
    const {
      store_id,
      transaction_number,
      date,
      customer,
      items,
      payment_method,
      total_amount,
      pos_device_id,
    } = receiptData;

    // Verifica se transação já existe no Cosmos
    const checkTransaction = await cosmosDb.checkIfTransactionExists({
      id: transaction_number,
      store_id,
    });

    if (checkTransaction !== 0) {
      return 0; // Transação já registrada
    }

    // 1. Gerar PDF e QR code
    const pdfBuffer = await generatePdfBuffer(receiptData);
    const qrBuffer = await generateQrCodeBuffer(transaction_number);

    // 2. Upload para Blob Storage
    const datePath = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
    const pdfPath = `receipts/${datePath}/${transaction_number}.pdf`;
    const qrPath = `qrcodes/${datePath}/${transaction_number}.png`;

    const [pdfUrl, qrUrl] = await Promise.all([
      uploadBlob(pdfPath, pdfBuffer, 'application/pdf'),
      uploadBlob(qrPath, qrBuffer, 'image/png'),
    ]);

    // 3. Salva no Cosmos DB
    await cosmosDb.saveReceipt({
      id: transaction_number,
      store_id,
      date,
      customer,
      items,
      total_amount,
      payment_method,
      receipt_url: pdfUrl,
      qr_code_url: qrUrl,
    });

    // 4. Salva no MySQL
    const customerId = await mysqlDb.upsertCustomer(customer);
    const transactionId = await mysqlDb.insertTransaction({
      transaction_number,
      store_id,
      customer_id: customerId,
      date,
      payment_method,
      total_amount,
      receipt_url: pdfUrl,
      qr_code_url: qrUrl,
      device_id: pos_device_id,
    });

    for (const item of items) {
      await mysqlDb.insertTransactionItem(transactionId, item);
    }

    return {
      success: true,
      transaction_number,
      receipt_url: pdfUrl,
      qr_code_url: qrUrl,
    };

  } catch (error) {
    // Log do erro interno (servidor, blob, banco, etc.)
    console.error('Erro dentro de processReceipt:', error);

    // Repassa o erro para quem chamou (createTransaction)
    throw new Error('Erro ao processar recibo: ' + error.message);
  }
}

module.exports = {
  processReceipt
};
