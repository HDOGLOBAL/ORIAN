// utils/pdfGenerator.js

import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path'

export const generatePDF = async (newOrder,random) => {



  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const { height } = page.getSize();
  const fontSize = 30;

  page.drawText(`Order Confirmation`, {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    color: rgb(0, 0.53, 0.71),
  });

  page.drawText(`Order ID: 123`, {
    x: 50,
    y: height - 6 * fontSize,
    size: fontSize,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Customer: Nayem Miah`, {
    x: 50,
    y: height - 8 * fontSize,
    size: fontSize,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  // Define a path to save the PDF
  const pdfPath = path.join(process.cwd(), 'public', 'pdfs', `${random}.pdf`);

  // Ensure the directory exists
  fs.mkdirSync(path.dirname(pdfPath), { recursive: true });

  // Save the PDF to the file system
  fs.writeFileSync(pdfPath, pdfBytes);

  return pdfPath;

  // return pdfBytes;
};




