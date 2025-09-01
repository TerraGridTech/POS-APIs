
// Connection to the non-relational database AZURE COSMOS DB

const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;

if (!endpoint || !key) {
  throw new Error("COSMOS_DB_ENDPOINT ou COSMOS_DB_KEY não definidos no .env");
}

const client = new CosmosClient({ endpoint, key });
module.exports = client;


