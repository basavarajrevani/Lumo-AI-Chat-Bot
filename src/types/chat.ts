export interface FileContext {
  fileName: string;
  fileType: string;
  content: string;
  uploadedAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  fileContext?: FileContext;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  uploadedFiles: FileContext[];
}

export interface ChatRequest {
  message: string;
  history: Message[];
  fileContext?: FileContext[];
}

export interface ChatResponse {
  response: string;
  error?: string;
}
