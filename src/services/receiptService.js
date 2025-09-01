const { uploadBlob } = require('./blobStorage');
const { generatePdfBuffer } = require('./pdfService');
const { generateQrCodeBuffer } = require('./qrCodeService');
const cosmosDb = require('../database/cosmosDbContext');
const mysqlDb = require('../database/mysqlDbContext');
const path = require('path');
const { check } = require('zod/v4');

async function processReceipt(receiptData) {
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

 const checkTransaction =  await cosmosDb.checkIfTransactionExists({
   id: transaction_number,
   store_id, 
  });

  if(checkTransaction == 0) {

  // 1. Calculate total_amount if not provided by the POS
  // 2. Generate PDF and QR as buffers
  const pdfBuffer = await generatePdfBuffer(receiptData);
//  const qrBuffer = await generateQrCodeBuffer(transaction_number); 
   

  // 3. Upload to Blob Storage
//  const datePath = new Date(date).toISOString().split('T')[0]; // YYYY-MM-DD
//  const pdfPath = `receipts/${datePath}/${transaction_number}.pdf`;
//  const qrPath = `qrcodes/${datePath}/${transaction_number}.png`;
  
//  const [pdfUrl, qrUrl] = await Promise.all([
//    uploadBlob(pdfPath, pdfBuffer, 'application/pdf'),
//    uploadBlob(qrPath, qrBuffer, 'image/png')
//  ]);

  // 4. Save to Cosmos DB (complete document) 
  /*await cosmosDb.saveReceipt({
    id: transaction_number,
    store_id,
    date,
    customer,
    items,
    total_amount,
    payment_method,
    receipt_url: pdfUrl,
    qr_code_url: qrUrl
  }); */

  // 5. Save to MySQL (normalized entities)
/*  const customerId = await mysqlDb.upsertCustomer(customer); // Returns existing id or inserts new one

 const transactionId = await mysqlDb.insertTransaction({
    transaction_number,
    store_id,
    customer_id: customerId,
    date,
    payment_method,
    total_amount,
    receipt_url: pdfUrl,
    qr_code_url: qrUrl,
    device_id: pos_device_id
  }); */

//  for (const item of items) {
//    await mysqlDb.insertTransactionItem(transactionId, item);
//  }

  return {
    success: true,
    transaction_number,
  //  receipt_url: pdfUrl,
  //  qr_code_url: qrUrl
  };
 } else {

 return 0;
 
 }
}

module.exports = {
  processReceipt
};
