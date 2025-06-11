import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Book, Spine } from '@/types/book';

interface PDFGenerationOptions {
  filename?: string;
  quality?: number;
  format?: 'a4';
}

class PDFGenerator {
  static async generatePDF(
    element: HTMLElement,
    options: PDFGenerationOptions = {}
  ): Promise<void> {
    const {
      filename = `MyMiniShelf-${Date.now()}.pdf`,
      quality = 2,
      format = 'a4'
    } = options;

    try {
      // Convert HTML element to canvas
      const canvas = await html2canvas(element, {
        scale: quality,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight,
        scrollX: 0,
        scrollY: 0,
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      
      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      // Calculate image dimensions to fit A4
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // Create PDF document
      const pdf = new jsPDF({
        orientation: imgHeight > pdfHeight ? 'portrait' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // If image is taller than A4, we might need multiple pages
      if (imgHeight <= pdfHeight) {
        // Single page
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // Multiple pages
        let position = 0;
        const pageHeight = pdfHeight;
        
        while (position < imgHeight) {
          if (position > 0) {
            pdf.addPage();
          }
          
          pdf.addImage(
            imgData,
            'PNG',
            0,
            -position,
            imgWidth,
            imgHeight
          );
          
          position += pageHeight;
        }
      }

      // Save the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  static async generatePNG(
    element: HTMLElement,
    filename: string = `MyMiniShelf-${Date.now()}.png`
  ): Promise<void> {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to create image blob');
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Error generating PNG:', error);
      throw new Error('Failed to generate PNG. Please try again.');
    }
  }
}

export default PDFGenerator;