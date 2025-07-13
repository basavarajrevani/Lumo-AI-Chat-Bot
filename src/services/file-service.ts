export interface FileUploadResult {
  content: string;
  fileName: string;
  fileType: string;
  fileSize: number;
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
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword' // .doc
  ];

  public static async processFile(file: File): Promise<FileUploadResult> {
    // Validate file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${this.MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }

    // Validate file type
    if (!this.SUPPORTED_TYPES.includes(file.type) && !this.isCodeFile(file.name) && !this.isWordFile(file.name)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    let content: string;

    if (file.type.startsWith('image/')) {
      content = await this.processImage(file);
    } else if (file.type === 'application/pdf') {
      content = await this.processPDF(file);
    } else if (this.isWordFile(file.name) || file.type.includes('word') || file.type.includes('officedocument')) {
      content = await this.processWordDocument(file);
    } else {
      content = await this.processTextFile(file);
    }

    return {
      content,
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

  private static async processImage(file: File): Promise<string> {
    try {
      // Convert image to base64 for Vision API
      const base64Data = await this.convertImageToBase64(file);

      // Send to Vision API for analysis
      const description = await this.analyzeImageWithVision(base64Data, file.type);

      const sizeInKB = Math.round(file.size / 1024);
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

      return `🖼️ **Image Analysis: ${file.name}**

📊 **File Info:** ${sizeInKB} KB (${sizeInMB} MB) • ${file.type}

🔍 **What I can see in this image:**
${description}

💡 **You can ask me more specific questions about this image:**
• "What colors are prominent in this image?"
• "Are there any people in this image?"
• "What's the setting or location?"
• "Can you read any text in the image?"
• "What's the mood or atmosphere?"

**Feel free to ask any questions about what you see in the image!** 📸✨`;

    } catch (error) {
      console.error('Error processing image:', error);
      const sizeInKB = Math.round(file.size / 1024);
      return `🖼️ **Image Uploaded: ${file.name}** (${sizeInKB} KB)

⚠️ **Vision analysis temporarily unavailable.** You can still:
• Describe what you see and ask for analysis
• Ask general questions about image content
• Request help with image-related tasks

**What would you like to know about this image?** 📸`;
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
      const sizeInKB = Math.round(file.size / 1024);
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

      return `📄 **PDF Uploaded Successfully: ${file.name}**

📊 **File Info:** ${sizeInKB} KB (${sizeInMB} MB) • PDF Document

⚠️ **Important:** This system cannot automatically extract text from PDFs. To analyze your PDF content:

🔄 **Next Steps:**
1. **Open your PDF** in any PDF viewer
2. **Copy the text** 
3. **Paste it here**

**Ready to analyze your PDF content! Just copy-paste the text you want me to examine.** 📋✨`;

    } catch (error) {
      console.error('Error processing PDF:', error);
      return `[PDF Document: ${file.name}]\nError: Failed to process PDF. ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  private static async processWordDocument(file: File): Promise<string> {
    try {
      const sizeInKB = Math.round(file.size / 1024);
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

      return `📝 **Word Document Uploaded: ${file.name}**

📊 **File Info:** ${sizeInKB} KB (${sizeInMB} MB) • Word Document

⚠️ **Important:** This system cannot automatically extract text from Word documents. To analyze your document:

🔄 **Next Steps:**
1. **Open your Word document** in any compatible viewer
2. **Copy the text** 
3. **Paste it here** 

**Ready to help with your Word document content! Just copy-paste the text you'd like me to analyze.** 📄✨`;
    } catch (error) {
      console.error('Error processing Word document:', error);
      return `[Word Document: ${file.name}]\nError: Failed to process Word document. ${error instanceof Error ? error.message : 'Unknown error'}`;
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

  public static formatFileForChat(result: FileUploadResult): string {
    const sizeInKB = Math.round(result.fileSize / 1024);

    let prompt = `I've uploaded a file for analysis:\n\n`;
    prompt += `**File Details:**\n`;
    prompt += `- Name: ${result.fileName}\n`;
    prompt += `- Type: ${result.fileType}\n`;
    prompt += `- Size: ${sizeInKB} KB\n\n`;

    if (result.fileType.startsWith('image/')) {
      prompt += `${result.content}\n\n`;
    } else if (result.content.includes('[PDF Document:') || result.content.includes('[Word Document:') || result.content.includes('**PDF Uploaded') || result.content.includes('**Word Document') || result.content.includes('**Image Uploaded')) {
      // Handle error messages from PDF/Word processing
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
