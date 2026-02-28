export interface FileUploadResult {
  content: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  base64?: string;
}

export class FileService {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly SUPPORTED_TYPES = [
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/json',
    'application/javascript',
    'text/html',
    'text/css',
    'text/xml',
    'application/xml',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.txt', '.md', '.json', '.js', '.ts', '.py'
  ];

  public static async processFile(file: File): Promise<FileUploadResult> {
    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${this.MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }

    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!this.SUPPORTED_TYPES.includes(file.type) &&
      !this.isCodeFile(fileName) &&
      !this.isWordFile(fileName) &&
      !this.isExcelFile(fileName) &&
      !this.isImageFile(fileName) &&
      !fileName.endsWith('.pdf')) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    let content: string;
    let base64: string | undefined;

    if (file.type.startsWith('image/') || this.isImageFile(fileName)) {
      const imageData = await this.processImage(file);
      content = imageData.content;
      base64 = imageData.base64;
    } else if (file.type === 'application/pdf' || fileName.endsWith('.pdf')) {
      content = await this.processPDF(file);
    } else if (this.isWordFile(fileName) || file.type.includes('word') || file.type.includes('officedocument.wordprocessingml')) {
      content = await this.processWordDocument(file);
    } else if (this.isExcelFile(fileName) || file.type.includes('excel') || file.type.includes('spreadsheetml')) {
      content = await this.processExcel(file);
    } else {
      content = await this.processTextFile(file);
    }

    return {
      content,
      base64,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size
    };
  }

  private static async processTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  private static async processImage(file: File): Promise<{ content: string; base64: string }> {
    try {
      // Convert image to base64 for Vision API
      const base64Data = await this.convertImageToBase64(file);

      // Send to Vision API for analysis
      const description = await this.analyzeImageWithVision(base64Data, file.type);

      const sizeInKB = Math.round(file.size / 1024);
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

      return {
        content: `🖼️ **Image Analysis: ${file.name}**

📊 **File Info:** ${sizeInKB} KB (${sizeInMB} MB) • ${file.type}

🔍 **What I can see in this image:**
${description}

💡 **You can ask me more specific questions about this image:**
• "What colors are prominent in this image?"
• "Are there any people in this image?"
• "What's the setting or location?"
• "Can you read any text in the image?"
• "What's the mood or atmosphere?"

**Feel free to ask any questions about what you see in the image!** 📸✨`,
        base64: base64Data
      };

    } catch (error) {
      console.error('Error processing image:', error);
      const sizeInKB = Math.round(file.size / 1024);
      return {
        content: `🖼️ **Image Uploaded: ${file.name}** (${sizeInKB} KB)

⚠️ **Vision analysis temporarily unavailable.** You can still:
• Describe what you see and ask for analysis
• Ask general questions about image content
• Request help with image-related tasks

**What would you like to know about this image?** 📸`,
        base64: await this.convertImageToBase64(file).catch(() => '')
      };
    }
  }

  private static async convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        // Remove the data URL prefix to get just the base64 data
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = () => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });
  }

  private static async analyzeImageWithVision(base64Data: string, mimeType: string): Promise<string> {
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Data,
          mimeType: mimeType
        }),
      });

      if (!response.ok) {
        throw new Error(`Vision API error: ${response.status}`);
      }

      const result = await response.json();
      return result.description || 'Unable to analyze image content.';
    } catch (error) {
      console.error('Error calling vision API:', error);
      throw error;
    }
  }

  private static async processPDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjs = await import('pdfjs-dist');

      // Load the worker from a CDN to avoid complex bundler configuration
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }

      if (!fullText.trim()) {
        return `📄 **PDF Content: ${file.name}**\n\nNo text content could be extracted. The PDF might be scanned or contain only images.`;
      }

      const sizeInKB = Math.round(file.size / 1024);
      return `📄 **PDF Content: ${file.name}** (${sizeInKB} KB)\n\n${fullText}`;

    } catch (error) {
      console.error('Error processing PDF:', error);
      return `[PDF Document: ${file.name}]\nError: Failed to extract text. ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private static async processExcel(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Dynamic import to avoid SSR issues
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      let fullText = '';

      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        // Convert sheet to CSV format for readable text context
        const csvContent = XLSX.utils.sheet_to_csv(worksheet);
        fullText += `--- Sheet: ${sheetName} ---\n${csvContent}\n\n`;
      });

      if (!fullText.trim()) {
        return `📊 **Excel Content: ${file.name}**\n\nNo content could be extracted from this spreadsheet.`;
      }

      const sizeInKB = Math.round(file.size / 1024);
      return `📊 **Excel Content: ${file.name}** (${sizeInKB} KB)\n\n${fullText}`;

    } catch (error) {
      console.error('Error processing Excel:', error);
      return `[Excel Document: ${file.name}]\nError: Failed to extract data. ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private static async processWordDocument(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Dynamic import to avoid SSR issues
      const mammoth = await import('mammoth');

      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value; // The generated raw text
      const messages = result.messages; // Any messages, such as warnings during conversion

      if (messages.length > 0) {
        console.warn('Mammoth warnings:', messages);
      }

      if (!text.trim()) {
        return `📝 **Word Document Content: ${file.name}**\n\nNo text content could be extracted from this document.`;
      }

      const sizeInKB = Math.round(file.size / 1024);
      return `📝 **Word Document Content: ${file.name}** (${sizeInKB} KB)\n\n${text}`;

    } catch (error) {
      console.error('Error processing Word document:', error);
      return `[Word Document: ${file.name}]\nError: Failed to extract text. ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private static isCodeFile(fileName: string): boolean {
    const codeExtensions = [
      '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h',
      '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala',
      '.sh', '.bash', '.sql', '.r', '.m', '.pl', '.lua', '.dart',
      '.vue', '.svelte', '.astro'
    ];

    return codeExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  }

  private static isWordFile(fileName: string): boolean {
    const wordExtensions = ['.doc', '.docx'];
    return wordExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  }

  private static isExcelFile(fileName: string): boolean {
    const excelExtensions = ['.xls', '.xlsx', '.csv'];
    return excelExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  }

  private static isImageFile(fileName: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  }

  public static formatFileForChat(result: FileUploadResult): string {
    const sizeInKB = Math.round(result.fileSize / 1024);

    let prompt = `I've uploaded a file for analysis:\n\n`;
    prompt += `**File Details:**\n`;
    prompt += `- Name: ${result.fileName}\n`;
    prompt += `- Type: ${result.fileType}\n`;
    prompt += `- Size: ${sizeInKB} KB\n\n`;

    if (result.fileType.startsWith('image/')) {
      prompt += `${result.content}\n\n`;
    } else if (result.content.includes('Error: Failed to extract text') || result.content.includes('Error: Failed to extract data')) {
      // Handle error messages from processing
      prompt += `${result.content}\n\n`;
      prompt += `Please let me know if you can help with this file or if you need it in a different format.`;
    } else {
      prompt += `**File Content:**\n\`\`\`\n${result.content}\n\`\`\`\n\n`;
      prompt += `Please analyze this file and provide insights, suggestions, or answer any questions about its content. I can now ask you questions about this file content.`;
    }

    return prompt;
  }

  public static getSupportedTypes(): string[] {
    return [...this.SUPPORTED_TYPES];
  }

  public static getMaxFileSize(): number {
    return this.MAX_FILE_SIZE;
  }
}
