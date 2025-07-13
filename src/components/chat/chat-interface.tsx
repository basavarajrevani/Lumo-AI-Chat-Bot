'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Save, MoreVertical, FileText, X } from 'lucide-react';
import { Logo } from '../../components/ui/logo';
import { ChatMessage } from './chat-message';
import { TypingIndicator } from './typing-indicator';
import { VoiceControls } from '../../components/ui/voice-controls';
import { FileUpload } from '../../components/ui/file-upload';
import { ConversationHistory } from '../../components/ui/conversation-history';
import { useChatStore } from '../../store/chat-store';
import { getVoiceService } from '../../services/voice-service';
import { FileService } from '../../services/file-service';
import { ConversationService } from '../../services/conversation-service';
import toast from 'react-hot-toast';

export function ChatInterface() {
  const [message, setMessage] = useState('');
  const [isSpeakEnabled, setIsSpeakEnabled] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    setMessages,
    addFileContext,
    uploadedFiles,
    clearFileContext
  } = useChatStore();

  const [voiceService, setVoiceService] = useState<any>(null);

  useEffect(() => {
    // Initialize voice service only on client side
    const service = getVoiceService();
    setVoiceService(service);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  // Auto-speak AI responses when enabled
  useEffect(() => {
    if (isSpeakEnabled && voiceService && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        voiceService.speak(lastMessage.content, {
          rate: 0.9,
          pitch: 1.0,
          volume: 0.8
        }).catch((error: Error) => {
          // Only log non-interruption errors
          if (!error.message.includes('interrupted') && !error.message.includes('canceled')) {
            console.warn('Speech synthesis error:', error.message);
          }
        });
      }
    }
  }, [messages, isSpeakEnabled, voiceService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await sendMessage(userMessage);
  };

  const handleVoiceInput = (text: string) => {
    setMessage(text);
    // Auto-focus textarea after voice input
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleFileProcessed = (result: any) => {
    // Add file context to store for future reference
    addFileContext({
      fileName: result.fileName,
      fileType: result.fileType,
      content: result.content,
      uploadedAt: new Date().toISOString()
    });

    const filePrompt = FileService.formatFileForChat(result);
    setMessage(filePrompt);
    // Auto-focus textarea after file upload
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleSaveConversation = () => {
    if (messages.length === 0) {
      toast.error('No messages to save');
      return;
    }

    const conversationId = ConversationService.saveConversation(messages);
    setCurrentConversationId(conversationId);
    toast.success('Conversation saved!');
  };

  const handleLoadConversation = (conversationId: string) => {
    const conversation = ConversationService.getConversation(conversationId);
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(conversationId);
      toast.success(`Loaded: ${conversation.title}`);
    }
  };

  const handleClearMessages = () => {
    clearMessages();
    setCurrentConversationId(null);
    if (voiceService) {
      voiceService.stopSpeaking();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  return (
    <div className="flex flex-col h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-2 sm:p-3 lg:p-4 border-b border-border bg-card/80 backdrop-blur-md relative z-10"
      >
        <Logo size="md" animated={true} />

        <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 header-controls">
          {/* File Context Indicator */}
          {uploadedFiles.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-lg text-xs">
              <FileText className="w-3 h-3" />
              <span>{uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''}</span>
              <button
                onClick={() => {
                  clearFileContext();
                  toast.success('File context cleared');
                }}
                className="ml-1 hover:bg-primary/20 rounded p-0.5"
                title="Clear file context"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Voice Controls */}
          <div className="hidden sm:block">
            <VoiceControls
              onVoiceInput={handleVoiceInput}
              onSpeakToggle={setIsSpeakEnabled}
              isSpeakEnabled={isSpeakEnabled}
            />
          </div>


          {/* Conversation History */}
          <ConversationHistory onLoadConversation={handleLoadConversation} />

          {/* Save Conversation */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveConversation}
            className="p-2 sm:p-3 rounded-lg hover:bg-muted transition-colors"
            title="Save conversation"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          {/* More Options */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearMessages}
            className="p-2 sm:p-3 rounded-lg hover:bg-muted transition-colors"
            title="Clear conversation"
          >
            <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          {/* Mobile Voice Controls */}
          <div className="sm:hidden">
            <VoiceControls
              onVoiceInput={handleVoiceInput}
              onSpeakToggle={setIsSpeakEnabled}
              isSpeakEnabled={isSpeakEnabled}
            />
          </div>
        </div>
      </motion.header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 lg:p-4 space-y-3 sm:space-y-4 relative z-0">
        <AnimatePresence>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <Logo size="xl" animated={true} className="mb-6" />
              <h1 className="text-2xl font-bold mb-2">Welcome to Lumo.AI</h1>
              <p className="text-muted-foreground mb-8 max-w-md">
                Your intelligent AI assistant powered by Google Gemini. Ask me anything, and I'll help you with detailed, thoughtful responses.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                {[
                  "Explain quantum computing",
                  "Write a creative story",
                  "Help with coding problems",
                  "Plan a travel itinerary"
                ].map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMessage(suggestion)}
                    className="p-3 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors text-left"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))
          )}
        </AnimatePresence>
        
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-2 sm:p-3 lg:p-4 border-t border-border bg-card/80 backdrop-blur-md relative z-10"
      >
        <form onSubmit={handleSubmit} className="flex items-end gap-2 sm:gap-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here... (Shift+Enter for new line) or drag & drop files"
              className="chat-input w-full p-2 sm:p-3 pr-12 bg-input border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200 min-h-[44px] sm:min-h-[48px] max-h-[100px] sm:max-h-[120px] text-sm sm:text-base"
              rows={1}
            />
          </div>

          {/* File Upload */}
          <FileUpload onFileProcessed={handleFileProcessed} />

          {/* Send Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!message.trim() || isLoading}
            className="p-2 sm:p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
