import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as MailComposer from 'expo-mail-composer';
import { Invoice, TimesheetEntry, Client } from '@/hooks/useAppData';

export const generateInvoicePDF = async (invoice: Invoice) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body {
          font-family: 'Helvetica', Arial, sans-serif;
          margin: 0;
          padding: 40px;
          color: #333;
          line-height: 1.6;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          border-bottom: 3px solid #3B82F6;
          padding-bottom: 20px;
        }
        .company-info {
          flex: 1;
        }
        .company-name {
          font-size: 32px;
          font-weight: bold;
          color: #3B82F6;
          margin: 0;
        }
        .company-tagline {
          font-size: 14px;
          color: #666;
          margin: 5px 0 0 0;
        }
        .invoice-info {
          text-align: right;
        }
        .invoice-number {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        .invoice-date {
          font-size: 14px;
          color: #666;
          margin: 5px 0;
        }
        .status-badge {
          background-color: ${getStatusColor(invoice.status)};
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          margin-top: 10px;
        }
        .billing-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        .billing-info {
          flex: 1;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .client-name {
          font-size: 18px;
          font-weight: bold;
          color: #3B82F6;
          margin-bottom: 5px;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .items-table th {
          background-color: #3B82F6;
          color: white;
          padding: 15px;
          text-align: left;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .items-table td {
          padding: 15px;
          border-bottom: 1px solid #eee;
        }
        .items-table tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        .items-table tr:hover {
          background-color: #e3f2fd;
        }
        .text-right {
          text-align: right;
        }
        .total-section {
          margin-left: auto;
          width: 300px;
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 2px solid #3B82F6;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 5px 0;
        }
        .total-label {
          font-weight: bold;
        }
        .total-amount {
          font-size: 24px;
          font-weight: bold;
          color: #3B82F6;
          border-top: 2px solid #3B82F6;
          padding-top: 10px;
          margin-top: 10px;
        }
        .notes-section {
          margin-top: 40px;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #3B82F6;
        }
        .notes-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: #333;
        }
        .footer {
          margin-top: 60px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .payment-terms {
          margin-top: 30px;
          padding: 15px;
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
        }
        .payment-terms-title {
          font-weight: bold;
          color: #856404;
          margin-bottom: 5px;
        }
        .payment-terms-text {
          font-size: 14px;
          color: #856404;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <h1 class="company-name">STR8 BUILD</h1>
          <p class="company-tagline">Construction Management Professionals</p>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
            Bay of Plenty, New Zealand<br>
            Email: c.samu@str8build.co.nz<br>
            Phone: +64 27 123 4567
          </p>
        </div>
        <div class="invoice-info">
          <h2 class="invoice-number">INVOICE</h2>
          <p class="invoice-number">#${invoice.invoiceNumber}</p>
          <p class="invoice-date">Date: ${invoice.date}</p>
          <p class="invoice-date">Due: ${invoice.dueDate}</p>
          <span class="status-badge">${invoice.status}</span>
        </div>
      </div>

      <div class="billing-section">
        <div class="billing-info">
          <h3 class="section-title">Bill To:</h3>
          <p class="client-name">${invoice.clientName}</p>
        </div>
        <div class="billing-info">
          <h3 class="section-title">Payment Terms:</h3>
          <p>Net 30 Days</p>
          <p>Due: ${invoice.dueDate}</p>
        </div>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th class="text-right">Hours</th>
            <th class="text-right">Rate</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(item => `
            <tr>
              <td>${item.description}</td>
              <td class="text-right">${item.hours}</td>
              <td class="text-right">$${item.rate.toFixed(2)}</td>
              <td class="text-right">$${item.amount.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-row">
          <span class="total-label">Subtotal:</span>
          <span>$${invoice.amount.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span class="total-label">GST (15%):</span>
          <span>$${(invoice.amount * 0.15).toFixed(2)}</span>
        </div>
        <div class="total-row total-amount">
          <span>Total (incl. GST):</span>
          <span>$${(invoice.amount * 1.15).toFixed(2)}</span>
        </div>
      </div>

      ${invoice.notes ? `
        <div class="notes-section">
          <h3 class="notes-title">Notes:</h3>
          <p>${invoice.notes}</p>
        </div>
      ` : ''}

      <div class="payment-terms">
        <h4 class="payment-terms-title">Payment Terms & Conditions:</h4>
        <p class="payment-terms-text">
          Payment is due within 30 days of invoice date. Late payments may incur additional charges.
          Please reference invoice number ${invoice.invoiceNumber} when making payment.
        </p>
      </div>

      <div class="footer">
        <p><strong>STR8 BUILD</strong> - Professional Construction Services</p>
        <p>Owner: C.SAMU | © 2025 STR8 BUILD | Built for NZ Construction Professionals</p>
      </div>
    </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });
    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const generateTimesheetPDF = async (timesheets: TimesheetEntry[], client: Client, period: string) => {
  const totalHours = timesheets.reduce((sum, entry) => sum + entry.hours, 0);
  const totalAmount = timesheets.reduce((sum, entry) => sum + (entry.hours * entry.rate), 0);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Timesheet Report - ${client.name}</title>
      <style>
        body {
          font-family: 'Helvetica', Arial, sans-serif;
          margin: 0;
          padding: 40px;
          color: #333;
          line-height: 1.6;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          border-bottom: 3px solid #14B8A6;
          padding-bottom: 20px;
        }
        .company-info {
          flex: 1;
        }
        .company-name {
          font-size: 32px;
          font-weight: bold;
          color: #14B8A6;
          margin: 0;
        }
        .company-tagline {
          font-size: 14px;
          color: #666;
          margin: 5px 0 0 0;
        }
        .report-info {
          text-align: right;
        }
        .report-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin: 0;
        }
        .report-period {
          font-size: 16px;
          color: #666;
          margin: 5px 0;
        }
        .client-section {
          margin-bottom: 30px;
          padding: 20px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #14B8A6;
        }
        .client-name {
          font-size: 20px;
          font-weight: bold;
          color: #14B8A6;
          margin: 0 0 10px 0;
        }
        .summary-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
          gap: 20px;
        }
        .summary-card {
          flex: 1;
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 2px solid #14B8A6;
        }
        .summary-value {
          font-size: 24px;
          font-weight: bold;
          color: #14B8A6;
          margin: 0;
        }
        .summary-label {
          font-size: 14px;
          color: #666;
          margin: 5px 0 0 0;
        }
        .timesheet-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .timesheet-table th {
          background-color: #14B8A6;
          color: white;
          padding: 15px;
          text-align: left;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .timesheet-table td {
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
        }
        .timesheet-table tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        .timesheet-table tr:hover {
          background-color: #e0f2f1;
        }
        .text-right {
          text-align: right;
        }
        .text-center {
          text-align: center;
        }
        .total-row {
          background-color: #14B8A6 !important;
          color: white;
          font-weight: bold;
        }
        .total-row td {
          border-bottom: none;
          padding: 15px;
        }
        .footer {
          margin-top: 60px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .project-group {
          margin-bottom: 20px;
        }
        .project-header {
          background-color: #e0f2f1;
          padding: 10px 15px;
          font-weight: bold;
          color: #14B8A6;
          border-left: 4px solid #14B8A6;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <h1 class="company-name">STR8 BUILD</h1>
          <p class="company-tagline">Construction Management Professionals</p>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">
            Bay of Plenty, New Zealand<br>
            Email: c.samu@str8build.co.nz<br>
            Phone: +64 27 123 4567
          </p>
        </div>
        <div class="report-info">
          <h2 class="report-title">TIMESHEET REPORT</h2>
          <p class="report-period">${period}</p>
          <p style="font-size: 14px; color: #666;">Generated: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div class="client-section">
        <h3 class="client-name">${client.name}</h3>
        <p style="margin: 0; color: #666;">
          ${client.email ? `Email: ${client.email}<br>` : ''}
          ${client.phone ? `Phone: ${client.phone}<br>` : ''}
          ${client.address ? `Address: ${client.address}` : ''}
        </p>
      </div>

      <div class="summary-section">
        <div class="summary-card">
          <h3 class="summary-value">${totalHours.toFixed(1)}</h3>
          <p class="summary-label">Total Hours</p>
        </div>
        <div class="summary-card">
          <h3 class="summary-value">${timesheets.length}</h3>
          <p class="summary-label">Time Entries</p>
        </div>
        <div class="summary-card">
          <h3 class="summary-value">$${totalAmount.toFixed(2)}</h3>
          <p class="summary-label">Total Amount</p>
        </div>
      </div>

      <table class="timesheet-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Project</th>
            <th>Description</th>
            <th class="text-center">Start Time</th>
            <th class="text-center">End Time</th>
            <th class="text-right">Hours</th>
            <th class="text-right">Rate</th>
            <th class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${timesheets.map(entry => `
            <tr>
              <td>${entry.date}</td>
              <td>${entry.projectName}</td>
              <td>${entry.description}</td>
              <td class="text-center">${entry.startTime}</td>
              <td class="text-center">${entry.endTime}</td>
              <td class="text-right">${entry.hours}</td>
              <td class="text-right">$${entry.rate.toFixed(2)}</td>
              <td class="text-right">$${(entry.hours * entry.rate).toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr class="total-row">
            <td colspan="5"><strong>TOTALS</strong></td>
            <td class="text-right"><strong>${totalHours.toFixed(1)}</strong></td>
            <td class="text-right">-</td>
            <td class="text-right"><strong>$${totalAmount.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        <p><strong>STR8 BUILD</strong> - Professional Construction Services</p>
        <p>Owner: C.SAMU | © 2025 STR8 BUILD | Built for NZ Construction Professionals</p>
        <p style="margin-top: 10px; font-style: italic;">
          This timesheet report was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </p>
      </div>
    </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });
    return uri;
  } catch (error) {
    console.error('Error generating timesheet PDF:', error);
    throw error;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid':
      return '#10B981';
    case 'Sent':
      return '#F59E0B';
    case 'Draft':
      return '#94A3B8';
    case 'Overdue':
      return '#EF4444';
    default:
      return '#94A3B8';
  }
};

export const shareViaPDF = async (uri: string, filename: string) => {
  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Share ${filename}`,
        UTI: 'com.adobe.pdf',
      });
    } else {
      throw new Error('Sharing is not available on this platform');
    }
  } catch (error) {
    console.error('Error sharing PDF:', error);
    throw error;
  }
};

export const sendViaEmail = async (
  uri: string, 
  filename: string, 
  recipient: string, 
  subject: string, 
  body: string
) => {
  try {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Email is not available on this platform');
    }

    await MailComposer.composeAsync({
      recipients: [recipient],
      subject,
      body,
      attachments: [uri],
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};