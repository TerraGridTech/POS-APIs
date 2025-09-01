// src/services/pdfService.js

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const generateReceiptId = require("../utils/generateReceiptId");

async function generatePdfBuffer(receiptData) {

  const receiptId = generateReceiptId(); // Gera um novo ID de recibo
  //console.log("📦 Dados recebidos na requisição:", data);

  const htmlContent = renderHTML({ ...receiptData, receiptId });

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({ format: "A4" });

  await browser.close();

  return { buffer: pdfBuffer, receiptId };
}

function renderHTML(receiptData) {

  return 'html';
}

module.exports = {
  generatePdfBuffer,
  renderHTML
};