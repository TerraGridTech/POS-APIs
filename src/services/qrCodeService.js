const QRCode = require('qrcode');

async function generateQrCodeBuffer(transactionId) {
//  const url = `https://tgtpos-api-b9eqafawaabtf6ev.centralindia-01.azurewebsites.net/api/transactions/${transactionId}`;
//  return await QRCode.toBuffer(url, { type: 'png' });
return 1;
}

module.exports = {
  generateQrCodeBuffer
};
