const QRCode = require('qrcode');

async function generateQrCodeBuffer(transactionId) {
  const url = `https://terragrid.tech/receipt/${transactionId}`;
  return await QRCode.toBuffer(url, { type: 'png' });
}

module.exports = {
  generateQrCodeBuffer
};
