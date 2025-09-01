const { BlobServiceClient } = require('@azure/storage-blob');
const { v4: uuidv4 } = require('uuid');
const cosmosDb = require('../database/cosmosDbContext');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTEINER  

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);



// pdf uploadBlob function 
async function uploadBlob(filePath, buffer, contentType) {
  
  const blobName = filePath || `${uuidv4()}.pdf`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const salvo = await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: contentType || 'application/octet-stream'
    }
  });

  // After the upload, let's generate the SAS URL
  const sasUrl = await generateSasUrl(blobName);
  return sasUrl;
}

// Function to generate the SAS URL for the file
async function generateSasUrl(blobName) {
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Setting the SAS expiration time
  const expiresOn = new Date();
  expiresOn.setMinutes(expiresOn.getMinutes() + 60); // The SAS will expire in 1 hour

  // Generating the SAS URL
  const sasToken = await blockBlobClient.generateSasUrl({
    permissions: 'r', // Read permission
    expiresOn: expiresOn, // Set the SAS expiration
  });

  return sasToken;
}

module.exports = {
  uploadBlob,
  generateSasUrl
};
