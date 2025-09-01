
// Calling the connection
const client = require("./cosmosClient");

// Database and container related to COSMOS DB
const database = client.database("transaction");
const container = database.container("receipts");

// Function to save the complete receipt in Cosmos DB
async function saveReceipt(receiptData) {

  try {
    const { resource } = await container.items.create(receiptData);
    return resource;
  } catch (error) {
    console.error('Erro ao salvar no Cosmos DB:', error.message);
    throw error;
  }
}

// Currently this function is not being used. Only what is in mysqlDbContext.js
async function getReceiptById(id) {
  try {
    const { resource } = await container.item(id, id).read();
    return resource;
  } catch (error) {
    if (error.code === 404) return null;
    throw error;
  }
}

// Verificar se já existe o transaction_id
async function checkIfTransactionExists(receiptData) {
  
  const id = String(receiptData.id);
  const partitionKey = String(receiptData.store_id);

  const existingItem = await container.item(id, partitionKey).read();

   if (existingItem.resource) {
      return 1;
    }
   return 0;
}

module.exports = {
  saveReceipt,
  getReceiptById,
  checkIfTransactionExists
};