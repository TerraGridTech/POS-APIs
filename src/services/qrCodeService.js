const QRCode = require('qrcode');

async function generateQrCodeBuffer(transactionId) {
  if (!transactionId || typeof transactionId !== 'string') {
    throw new Error('transactionId inválido para gerar QR Code');
  }

  const url = `https://tgtpos-api-b9eqafawaabtf6ev.centralindia-01.azurewebsites.net/receipt/${transactionId}`;
  
  try {
    return await QRCode.toBuffer(url, { type: 'png' });
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error.message);
    throw error; // ou retorne null se quiser ignorar
  }
}

module.exports = {
  generateQrCodeBuffer
};
