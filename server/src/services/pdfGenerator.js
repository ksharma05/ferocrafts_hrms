const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * PDF Generator Service
 * Generates professional payout slips
 */

// Create PDFs directory if it doesn't exist
const pdfDir = path.join(__dirname, '../../pdfs');
if (!fs.existsSync(pdfDir)) {
  fs.mkdirSync(pdfDir, { recursive: true });
}

/**
 * Generate a payout slip PDF
 * @param {Object} payout - Payout record
 * @param {Object} employee - Employee details
 * @returns {String} - Path to generated PDF
 */
const generatePayoutSlip = async (payout, employee) => {
  return new Promise((resolve, reject) => {
    try {
      // Create filename
      const filename = `payout-${payout.employeeId}-${payout.period}.pdf`;
      const filepath = path.join(pdfDir, filename);

      // Create PDF document
      const doc = new PDFDocument({ margin: 50 });
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Header
      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text('FeroCrafts HRMS', { align: 'center' })
        .fontSize(16)
        .text('Payout Slip', { align: 'center' })
        .moveDown();

      // Horizontal line
      doc
        .strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown();

      // Employee Details
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Employee Details:', { underline: true })
        .moveDown(0.5);

      doc
        .font('Helvetica')
        .fontSize(10)
        .text(`Name: ${employee.name || 'N/A'}`)
        .text(`Email: ${employee.email || 'N/A'}`)
        .text(`Employee ID: ${payout.employeeId}`)
        .moveDown();

      // Period Details
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('Period Details:', { underline: true })
        .moveDown(0.5);

      doc
        .font('Helvetica')
        .fontSize(10)
        .text(`Pay Period: ${payout.period}`)
        .text(`Total Days Worked: ${payout.totalDaysWorked}`)
        .moveDown();

      // Horizontal line
      doc
        .strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown();

      // Earnings
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('Earnings:', { underline: true })
        .moveDown(0.5);

      const earningsY = doc.y;
      doc
        .font('Helvetica')
        .fontSize(10)
        .text('Gross Pay:', 50, earningsY)
        .text(`₹${payout.grossPay.toFixed(2)}`, 450, earningsY, { align: 'right' })
        .moveDown();

      // Deductions
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text('Deductions:', { underline: true })
        .moveDown(0.5);

      const deductionsY = doc.y;
      doc
        .font('Helvetica')
        .fontSize(10)
        .text('Total Deductions:', 50, deductionsY)
        .text(`₹${payout.deductions.toFixed(2)}`, 450, deductionsY, { align: 'right' })
        .moveDown();

      // Horizontal line
      doc
        .strokeColor('#aaaaaa')
        .lineWidth(2)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown();

      // Net Pay
      const netPayY = doc.y;
      doc
        .font('Helvetica-Bold')
        .fontSize(14)
        .text('Net Pay:', 50, netPayY)
        .text(`₹${payout.netPay.toFixed(2)}`, 450, netPayY, { align: 'right' })
        .moveDown(2);

      // Horizontal line
      doc
        .strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke()
        .moveDown();

      // Footer
      doc
        .fontSize(8)
        .font('Helvetica')
        .text('This is a system-generated document and does not require a signature.', {
          align: 'center',
        })
        .moveDown(0.5)
        .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });

      // Finalize PDF
      doc.end();

      stream.on('finish', () => {
        resolve(filepath);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Get public URL for PDF
 * @param {String} filepath - Local file path
 * @returns {String} - Public URL
 */
const getPdfUrl = (filepath) => {
  if (!filepath) return null;

  const filename = path.basename(filepath);
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  return `${baseUrl}/pdfs/${filename}`;
};

module.exports = {
  generatePayoutSlip,
  getPdfUrl,
};

