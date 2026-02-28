import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, ChatState, FileContext } from '../types/chat';

interface ChatStore extends ChatState {
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  deleteMessage: (id: string) => void;
  editMessage: (id: string, content: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setMessages: (messages: Message[]) => void;
  addFileContext: (fileContext: FileContext) => void;
  clearFileContext: () => void;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  currentPersonaId: string;
  setPersonaId: (id: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      error: null,
      uploadedFiles: [],

      addMessage: (message) => {
        const newMessage: Message = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));
      },

      sendMessage: async (content: string) => {
        const { addMessage, uploadedFiles, currentPersonaId } = get();

        // Add user message
        addMessage({
          role: 'user',
          content,
        });

        // Set loading state
        set({ isLoading: true, error: null });

        try {
          // Call the API
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: content,
              history: get().messages,
              fileContext: uploadedFiles,
              personaId: currentPersonaId,
            }),
          });

          console.log('[ChatStore] Request sent to /api/chat:', {
            message: content,
            historyCount: get().messages.length,
            fileCount: uploadedFiles.length,
            personaId: currentPersonaId
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.response || `HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          // Add AI response
          addMessage({
            role: 'assistant',
            content: data.response,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
          });

          // Add error message
          addMessage({
            role: 'assistant',
            content: 'I apologize, but I encountered an error while processing your request. Please try again.',
          });
        } finally {
          set({ isLoading: false });
        }
      },

      clearMessages: () => {
        set({ messages: [], error: null });
      },

      deleteMessage: (id: string) => {
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== id),
        }));
      },

      editMessage: (id: string, content: string) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, content } : msg
          ),
        }));
      },

      setMessages: (messages: Message[]) => {
        set({ messages });
      },

      addFileContext: (fileContext: FileContext) => {
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, fileContext],
        }));
      },

      clearFileContext: () => {
        set({ uploadedFiles: [] });
      },
      currentLanguage: 'en-US',
      setLanguage: (lang: string) => {
        set({ currentLanguage: lang });
      },
      currentPersonaId: 'general',
      setPersonaId: (id: string) => {
        set({ currentPersonaId: id });
      },
    }),
    {
      name: 'lumo-chat-storage',
      partialize: (state) => ({
        messages: state.messages.slice(-50), // Keep only last 50 messages
        uploadedFiles: state.uploadedFiles.slice(-10), // Keep only last 10 uploaded files
        currentLanguage: state.currentLanguage,
        currentPersonaId: state.currentPersonaId,
      }),
    }
  )
);
