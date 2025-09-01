// src/services/pdfService.js

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const generateReceiptId = require("../utils/generateReceiptId");

async function generatePdfBuffer(receiptData) {

  const receiptId = generateReceiptId(); // Gera um novo ID de recibo
  //console.log("📦 Dados recebidos na requisição:", data);

  const htmlContent = renderHTML({ ...receiptData, receiptId });

   const browser = await puppeteer.launch({
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true
  });

//  const page = await browser.newPage();
//  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

//  const pdfBuffer = await page.pdf({ format: "A4" });

//  await browser.close();

//  return { buffer: pdfBuffer, receiptId };
return 1
}

function renderHTML(receiptData) {
  const templatePath = path.join(__dirname, "..", "templates", "generalReceiptTemplate.html");
  let html = fs.readFileSync(templatePath, "utf-8");
  html = html
    .replace("{{receiptId}}", receiptData.receiptId)
    .replace("{{date}}", receiptData.date)
    .replace("{{customerName}}", receiptData.customer.name)
    .replace("{{customerEmail}}", receiptData.customer.email)
    .replace("{{customerPhone}}", receiptData.customer.phone)
    .replace("{{discount}}", receiptData.discount)
    .replace("{{tax}}", receiptData.tax)
    .replace("{{paymentMethod}}", receiptData.payment_method)
    .replace("{{total}}", receiptData.total_amount);

  const itemRows = receiptData.items
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.price}</td>
        <td>${item.discount}</td>
        <td>${item.tax}</td>
      </tr>`
    )
    .join("");

  html = html.replace(/<tbody>.*<\/tbody>/s, `<tbody>${itemRows}</tbody>`);

  return html;
}

module.exports = {
  generatePdfBuffer,
  renderHTML
};