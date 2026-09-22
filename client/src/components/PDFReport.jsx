import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

export default function PDFReport({ result }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      
      // Dynamic import on-demand: removes 357KB from initial bundle!
      const { jsPDF } = await import('jspdf');
      
      const doc = new jsPDF({ unit: 'pt', format: 'letter' });
      const margin = 40;
      let y = 50;

      // Header Banner
      doc.setFillColor(7, 30, 61);
      doc.rect(0, 0, doc.internal.pageSize.width, 100, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('CareerVerify AI Audit Report', margin, 55);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, 75);

      y = 130;

      // Verdict Box
      const isFake = result.prediction === 'Fake Job';
      if (isFake) {
        doc.setFillColor(254, 242, 242);
        doc.setDrawColor(239, 68, 68);
      } else {
        doc.setFillColor(240, 253, 244);
        doc.setDrawColor(34, 197, 94);
      }
      doc.rect(margin, y, doc.internal.pageSize.width - margin * 2, 70, 'FD');

      doc.setTextColor(isFake ? 185 : 21, isFake ? 28 : 128, isFake ? 28 : 61);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(`Verdict: ${result.prediction}`, margin + 15, y + 30);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Confidence Level: ${result.confidence}%  |  Fraud Score: ${result.fraud_score}/100  |  Risk: ${result.risk}`, margin + 15, y + 50);

      y += 100;

      // Key Indicators
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Key Indicators & Evaluation Signals', margin, y);
      y += 20;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);

      if (result.reasons && result.reasons.length > 0) {
        result.reasons.forEach((reason) => {
          doc.text(`• ${reason}`, margin + 10, y);
          y += 18;
        });
      } else {
        doc.text('• No critical fraud signals identified.', margin + 10, y);
        y += 18;
      }

      y += 20;

      // Job Text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text('Analyzed Job Posting Text', margin, y);
      y += 20;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);

      const splitText = doc.splitTextToSize(result.job_text || '', doc.internal.pageSize.width - margin * 2 - 20);
      const textChunk = splitText.slice(0, 25);
      doc.text(textChunk, margin, y);

      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('CareerVerify AI - Verified Fraud Prevention System', margin, pageHeight - 30);

      doc.save('CareerVerify_Report.pdf');
    } catch (err) {
      console.error('PDF Generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownloadPDF}
      disabled={downloading}
      className="btn-base btn-primary px-4 py-2 text-xs flex items-center space-x-1.5 disabled:opacity-50"
    >
      {downloading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5 text-white" />
          <span>PDF Report</span>
        </>
      )}
    </button>
  );
}
