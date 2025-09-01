// src/utils/generateReceiptId.js
module.exports = function generateReceiptId() {
  return 'REC-' + Math.floor(Math.random() * 1000000);
};
 
