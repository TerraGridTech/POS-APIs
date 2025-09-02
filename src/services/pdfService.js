// src/services/pdfService.js

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const generateReceiptId = require("../utils/generateReceiptId");

async function generatePdfBuffer(receiptData) {
  try {
     let options = {
            printBackground: true,
            format: 'a4',
            displayHeaderFooter: false,
            preferCSSPageSize: true, buffer: true,
            margin: {
                top: '12mm',
                right: '12mm',
                bottom: '12mm',
                left: '12mm'
            }
        };

    const receiptId = generateReceiptId(); // Gera um novo ID de recibo
    const htmlContent = renderHTML({ ...receiptData, receiptId });

    //const browser = await puppeteer.launch();
  //  const browser = await puppeteer.launch({ headless: true, args: [
  //          '--no-sandbox',
            //'--disable-setuid-sandbox'
   //     ],
      // executablePath: path.resolve(__dirname, './chromium/chrome'),
   //    });
   const browser = await puppeteer.launch({ browser: 'firefox' });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf(options); //{ format: "A4" }

    await browser.close();

    return { buffer: pdfBuffer, receiptId };

  } catch (error) {
    console.error('Erro ao gerar PDF com Puppeteer:', error);
    throw new Error('Falha na geração do PDF: ' + error.message);
  }
}

function renderHTML(receiptData) {
  try {
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
  } catch (error) {
    console.error("Erro ao renderizar HTML do recibo:", error);
    throw new Error("Erro ao gerar HTML do recibo: " + error.message);
  }
}

module.exports = {
  generatePdfBuffer,
  renderHTML
};