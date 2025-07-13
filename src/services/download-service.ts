import { saveAs } from 'file-saver';

export class DownloadService {
  
  // Download as PDF
  static async downloadAsPDF(content: string, filename: string = 'lumo-ai-response') {
    try {
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import('jspdf')).default;
      
      const doc = new jsPDF();
      
      // Set font and styling
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      
      // Add title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Lumo AI Response', 20, 20);
      
      // Add timestamp
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
      
      // Process content
      const cleanContent = this.cleanContentForPDF(content);
      const lines = doc.splitTextToSize(cleanContent, 170);
      
      // Add content
      doc.setFontSize(12);
      let yPosition = 45;
      const pageHeight = doc.internal.pageSize.height;
      
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 7;
      });
      
      // Save the PDF
      doc.save(`${filename}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }

  // Download as Word document
  static downloadAsWord(content: string, filename: string = 'lumo-ai-response') {
    try {
      const cleanContent = this.cleanContentForWord(content);
      
      // Create a simple HTML structure for Word
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Lumo AI Response</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            h1 { color: #333; border-bottom: 2px solid #333; }
            .timestamp { color: #666; font-size: 12px; margin-bottom: 20px; }
            .content { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>Lumo AI Response</h1>
          <div class="timestamp">Generated on: ${new Date().toLocaleString()}</div>
          <div class="content">${cleanContent}</div>
        </body>
        </html>
      `;
      
      const blob = new Blob([htmlContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      saveAs(blob, `${filename}.doc`);
      
    } catch (error) {
      console.error('Error generating Word document:', error);
      throw new Error('Failed to generate Word document');
    }
  }

  // Download as Excel (for tabular data)
  static async downloadAsExcel(content: string, filename: string = 'lumo-ai-response') {
    try {
      // Dynamic import to avoid SSR issues
      const XLSX = await import('xlsx');
      
      // Try to detect if content contains tabular data
      const tableData = this.extractTableData(content);
      
      let worksheet;
      if (tableData.length > 0) {
        // Create worksheet from table data
        worksheet = XLSX.utils.aoa_to_sheet(tableData);
      } else {
        // Create worksheet from plain text
        const lines = content.split('\n').map(line => [line]);
        worksheet = XLSX.utils.aoa_to_sheet([
          ['Lumo AI Response'],
          [`Generated on: ${new Date().toLocaleString()}`],
          [''],
          ...lines
        ]);
      }
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Response');
      
      // Save the file
      XLSX.writeFile(workbook, `${filename}.xlsx`);
      
    } catch (error) {
      console.error('Error generating Excel file:', error);
      throw new Error('Failed to generate Excel file');
    }
  }

  // Download as plain text
  static downloadAsText(content: string, filename: string = 'lumo-ai-response') {
    try {
      const cleanContent = this.cleanContentForText(content);
      const fullContent = `Lumo AI Response\nGenerated on: ${new Date().toLocaleString()}\n\n${cleanContent}`;
      
      const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${filename}.txt`);
      
    } catch (error) {
      console.error('Error generating text file:', error);
      throw new Error('Failed to generate text file');
    }
  }

  // Download as Markdown
  static downloadAsMarkdown(content: string, filename: string = 'lumo-ai-response') {
    try {
      const markdownContent = `# Lumo AI Response\n\n*Generated on: ${new Date().toLocaleString()}*\n\n${content}`;
      
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
      saveAs(blob, `${filename}.md`);
      
    } catch (error) {
      console.error('Error generating Markdown file:', error);
      throw new Error('Failed to generate Markdown file');
    }
  }

  // Helper methods
  private static cleanContentForPDF(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/`(.*?)`/g, '$1') // Remove code markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
      .trim();
  }

  private static cleanContentForWord(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Convert italic
      .replace(/`(.*?)`/g, '<code>$1</code>') // Convert code
      .replace(/\n/g, '<br>') // Convert line breaks
      .trim();
  }

  private static cleanContentForText(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/`(.*?)`/g, '$1') // Remove code markdown
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
      .trim();
  }

  private static extractTableData(content: string): string[][] {
    const lines = content.split('\n');
    const tableData: string[][] = [];
    
    for (const line of lines) {
      // Look for table-like patterns (pipe-separated or tab-separated)
      if (line.includes('|') && line.split('|').length > 2) {
        const row = line.split('|').map(cell => cell.trim()).filter(cell => cell);
        if (row.length > 0) {
          tableData.push(row);
        }
      } else if (line.includes('\t')) {
        const row = line.split('\t').map(cell => cell.trim());
        if (row.length > 1) {
          tableData.push(row);
        }
      }
    }
    
    return tableData;
  }

  // Detect content type for smart download suggestions
  static detectContentType(content: string): string[] {
    const suggestions: string[] = [];

    // Check for tabular data first (highest priority)
    if (this.extractTableData(content).length > 0) {
      suggestions.push('xlsx'); // Prioritize Excel for tables
    }

    // Always include PDF for any substantial content
    if (content.length > 100) {
      suggestions.push('pdf');
    }

    // Include Word for any content (good for editing)
    suggestions.push('docx');

    // Always include text formats
    suggestions.push('txt');
    suggestions.push('md');

    // Remove duplicates and return first 5 options
    return [...new Set(suggestions)].slice(0, 5);
  }
}
