// src/services/pdfService.js

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const generateReceiptId = require("../utils/generateReceiptId");

async function generatePdfBuffer(receiptData) {
  const receiptId = generateReceiptId();

  const htmlContent = renderHTML({ ...receiptData, receiptId });

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4" });

    return { buffer: pdfBuffer, receiptId };

  } catch (err) {
    console.error("Erro ao gerar PDF com Puppeteer:", err.message);
    throw new Error("Falha ao gerar PDF em produção");
  } finally {
    if (browser) await browser.close();
  }
}


function renderHTML(receiptData) {

  return 'html';
}

module.exports = {
  generatePdfBuffer,
  renderHTML
};