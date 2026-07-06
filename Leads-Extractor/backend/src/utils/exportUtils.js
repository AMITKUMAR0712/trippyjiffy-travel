import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import { sanitizeString } from '../utils/helpers.js';

const CSV_COLUMNS = [
  'Company Name',
  'Email',
  'Phone',
  'Website',
  'Address',
  'City',
  'Country',
  'Maps URL',
  'Rating',
  'Category',
];

function mapCompanyToRow(company) {
  return {
    'Company Name': sanitizeString(company.name),
    Email: sanitizeString(company.email),
    Phone: sanitizeString(company.phone || ''),
    Website: sanitizeString(company.website || ''),
    Address: sanitizeString(company.address || ''),
    City: sanitizeString(company.city),
    Country: sanitizeString(company.country),
    'Maps URL': sanitizeString(company.googleMapsUrl || ''),
    Rating: company.googleRating ?? '',
    Category: sanitizeString(company.category),
  };
}

function escapeCsvValue(value) {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function companiesToCsv(companies) {
  const rows = companies.map(mapCompanyToRow);
  const header = CSV_COLUMNS.join(',');
  const dataRows = rows.map((row) =>
    CSV_COLUMNS.map((col) => escapeCsvValue(row[col])).join(',')
  );
  return [header, ...dataRows].join('\n');
}

export async function companiesToExcel(companies) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Travel Company Lead Extractor';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Travel Companies');

  sheet.columns = CSV_COLUMNS.map((header) => ({
    header,
    key: header,
    width: header === 'Address' ? 40 : header === 'Maps URL' ? 50 : 20,
  }));

  const rows = companies.map(mapCompanyToRow);
  sheet.addRows(rows);

  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF2563EB' },
  };
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  return workbook.xlsx.writeBuffer();
}

const PDF_COLS = [
  { header: '#', width: 26, key: 'index' },
  { header: 'Company', width: 128, key: 'name' },
  { header: 'Email', width: 132, key: 'email' },
  { header: 'Phone', width: 78, key: 'phone' },
  { header: 'City', width: 68, key: 'city' },
  { header: 'Country', width: 68, key: 'country' },
  { header: 'Category', width: 82, key: 'category' },
  { header: 'Rating', width: 36, key: 'rating' },
];

const PDF_ROW_HEIGHT = 22;
const PDF_HEADER_HEIGHT = 24;
const PDF_MARGIN = 36;

function truncatePdfText(value, max = 42) {
  const str = String(value ?? '').trim();
  if (str.length <= max) return str;
  return `${str.slice(0, max - 1)}…`;
}

function drawPdfTableHeader(doc, x, y) {
  const tableWidth = PDF_COLS.reduce((sum, col) => sum + col.width, 0);

  doc.save();
  doc.fillColor('#4f46e5').rect(x, y, tableWidth, PDF_HEADER_HEIGHT).fill();
  doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(8);

  let colX = x;
  for (const col of PDF_COLS) {
    doc.text(col.header, colX + 5, y + 8, {
      width: col.width - 10,
      lineBreak: false,
    });
    colX += col.width;
  }
  doc.restore();

  return y + PDF_HEADER_HEIGHT;
}

function drawPdfTableRow(doc, x, y, row, rowIndex) {
  const tableWidth = PDF_COLS.reduce((sum, col) => sum + col.width, 0);

  if (rowIndex % 2 === 0) {
    doc.save();
    doc.fillColor('#f8fafc').rect(x, y, tableWidth, PDF_ROW_HEIGHT).fill();
    doc.restore();
  }

  doc.strokeColor('#e2e8f0').lineWidth(0.5);
  doc.moveTo(x, y + PDF_ROW_HEIGHT).lineTo(x + tableWidth, y + PDF_ROW_HEIGHT).stroke();

  doc.fillColor('#1e293b').font('Helvetica').fontSize(7.5);

  let colX = x;
  for (const col of PDF_COLS) {
    const raw = row[col.key];
    const text =
      col.key === 'rating' && raw !== '' && raw != null ? String(raw) : truncatePdfText(raw, 36);

    doc.text(text, colX + 5, y + 7, {
      width: col.width - 10,
      height: PDF_ROW_HEIGHT - 8,
      ellipsis: true,
      lineBreak: false,
    });
    colX += col.width;
  }

  return y + PDF_ROW_HEIGHT;
}

function addPdfPageFooter(doc, pageNumber) {
  const bottom = doc.page.height - PDF_MARGIN + 8;
  doc.font('Helvetica').fontSize(8).fillColor('#94a3b8');
  doc.text(
    `Travel Company Lead Extractor  •  Page ${pageNumber}`,
    PDF_MARGIN,
    bottom,
    { align: 'center', width: doc.page.width - PDF_MARGIN * 2 }
  );
}

export function companiesToPdf(companies) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margin: PDF_MARGIN,
      bufferPages: true,
    });

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const emailsFound = companies.filter((c) => c.email && c.email !== 'Not Available').length;
    const generatedAt = new Date().toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    doc.fillColor('#4f46e5').font('Helvetica-Bold').fontSize(20);
    doc.text('Travel Company Leads Report', { align: 'center' });

    doc.moveDown(0.4);
    doc.fillColor('#64748b').font('Helvetica').fontSize(10);
    doc.text(`Generated on ${generatedAt}`, { align: 'center' });

    doc.moveDown(0.8);
    doc.fillColor('#1e293b').font('Helvetica-Bold').fontSize(11);
    doc.text(
      `Total Companies: ${companies.length}    •    Emails Found: ${emailsFound}    •    Success Rate: ${
        companies.length > 0 ? Math.round((emailsFound / companies.length) * 100) : 0
      }%`,
      { align: 'center' }
    );

    doc.moveDown(1.2);

    const tableX = PDF_MARGIN;
    let tableY = doc.y;
    const pageBottom = doc.page.height - PDF_MARGIN - 24;

    let y = drawPdfTableHeader(doc, tableX, tableY);

    companies.forEach((company, index) => {
      if (y + PDF_ROW_HEIGHT > pageBottom) {
        doc.addPage();
        tableY = PDF_MARGIN + 10;
        y = drawPdfTableHeader(doc, tableX, tableY);
      }

      const row = mapCompanyToRow(company);
      y = drawPdfTableRow(
        doc,
        tableX,
        y,
        {
          index: String(index + 1),
          name: row['Company Name'],
          email: row.Email,
          phone: row.Phone,
          city: row.City,
          country: row.Country,
          category: row.Category,
          rating: row.Rating,
        },
        index
      );
    });

    if (companies.length === 0) {
      doc.fillColor('#64748b').font('Helvetica').fontSize(11);
      doc.text('No companies to export.', tableX, y + 12);
    }

    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      addPdfPageFooter(doc, i + 1);
    }

    doc.end();
  });
}
