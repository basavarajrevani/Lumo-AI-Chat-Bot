export interface FileContext {
  fileName: string;
  fileType: string;
  content: string;
  base64?: string;
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
  personaId?: string;
}

export interface ChatResponse {
  response: string;
  error?: string;
}
