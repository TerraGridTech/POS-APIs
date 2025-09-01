const { transactionSchema } = require('../models/transaction.model');
const { processReceipt } = require('../services/receiptService');
// const cosmosDb = require('../database/cosmosDbContext'); 
const { generateSasUrl } = require('../services/blobStorage'); 
const receipt = require('../database/mysqlDbContext');
//const { sendTransactionToQueue } = require('../serviceBusClient');
const cosmosDb = require('../database/cosmosDbContext');
const { normalizeTransaction } = require('../utils/normalizers');
const APIKey = require('../models/auth/apiKey');
const sendAnalyticsLog = require('../utils/sendAnalyticsLog');


async function createTransaction(req, res) {
  try {

    // Data validation using Zod
    //const receiptData = transactionSchema.parse(req.body);

    const {data, error } = normalizeTransaction(req.body);
    if (error) {
    return res.status(400).json({ error: error.format?.() || 'Invalid data' });
    }

    data.pos_device_id = req.user.posDeviceId;

    // Complete processing of the transition
    const startTime = Date.now();
    const result = await processReceipt(data);
    const duration = Date.now() - startTime;
   // console.log(`Tempo total para buscar recibo: ${duration}ms`);

    // Enviar os dados da transação para a fila (Azure Service Bus)
   // await sendTransactionToQueue(receiptData); // Enviar a transação para a fila
   
    if(result == 0){
        return res.redirect(`/api/transactions/${data.transaction_id}`);
    }

     if (req.pos || req.user) {  //or req.user
       await sendAnalyticsLog("RECEIPT_GENERATED", {
       posId: req.pos?.id || req.user?.id,
       transactionId: result.transaction_id,
       receipt_url: result.receipt_url,
       qr_code_url: result.qr_code_url,
       durationMs: duration,
     });
    } 
    
    res.status(201).json({
      message: 'Transação registrada com sucesso.',
      transaction_id: result.transaction_id,
      receipt_url: result.receipt_url,
      qr_code_url: result.qr_code_url
    });
  } catch (error) {
   // Validation error (malformed data)
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Invalid data submitted',
        details: error.errors
      });
    }

    // Other unexpected errors
    console.error('Erro na criação da transação:', error);
    res.status(500).json({ error: 'Erro ao processar a transação.' });
  }
}

// GET /transactions/:id
async function getTransactionById(req, res) {
  
  const { id } = req.params;

  try {

    const startTime = Date.now();
    // Retrieves the transaction data from the database
    const transaction = await receipt.getTransactionById(id);  
    
    // Extracts the filenames (PDF and QR code) based on the URLs saved during the first transition
    const pdfBlobName = transaction.receipt_url.split('?')[0].split('receipts-container/')[1];
    const qrCodeBlobName = transaction.qr_code_url.split('?')[0].split('receipts-container/')[1];

    // Generates the SAS URL for each file
    const pdfSasUrl = await generateSasUrl(pdfBlobName);
    const qrCodeSasUrl = await generateSasUrl(qrCodeBlobName);

    const duration = Date.now() - startTime;

    if (req.pos || req.user) {  
       await sendAnalyticsLog("RECEIPT_VIEWED", {
       posId: req.pos?.id || req.user?.id,
       transactionId: id,
       receipt_url: pdfSasUrl,
       qr_code_url: qrCodeSasUrl,
       durationMs: duration,
     });
    }
    
    // Return the response with the generated SAS URLs
    res.json({
      success: true,
      transaction_id: id,
      receipt_url: pdfSasUrl,
      qr_code_url: qrCodeSasUrl
    }); 
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({ error: 'Erro interno ao buscar a transação.' });
  }
}

module.exports = {
  createTransaction,
  getTransactionById
};

