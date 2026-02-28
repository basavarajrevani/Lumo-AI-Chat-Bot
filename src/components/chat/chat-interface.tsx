'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Save, MoreVertical, FileText, X, Globe, Sparkles } from 'lucide-react';
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
import { PERSONAS } from '../../types/persona';
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
    clearFileContext,
    currentLanguage,
    setLanguage,
    currentPersonaId,
    setPersonaId
  } = useChatStore();

  const [voiceService, setVoiceService] = useState<any>(null);

  // Synchronize VoiceService with currentLanguage
  useEffect(() => {
    const service = getVoiceService();
    if (service) {
      service.setLanguage(currentLanguage);
    }
  }, [currentLanguage]);

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
      base64: result.base64,
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

          {/* Persona Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-medium transition-all duration-200 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{PERSONAS.find(p => p.id === currentPersonaId)?.name || 'General'}</span>
            </button>
            <div className="absolute right-0 mt-2 w-64 bg-popover border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-1.5">
              <div className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Select Persona
              </div>
              {PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => {
                    setPersonaId(persona.id);
                    toast.success(`Persona switched to ${persona.name}`);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg hover:bg-accent transition-all duration-200 flex items-start gap-3 group/item ${currentPersonaId === persona.id ? 'bg-accent border border-accent-foreground/10' : 'border border-transparent'
                    }`}
                >
                  <span className="text-xl bg-background rounded-lg p-1.5 shadow-sm">{persona.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate group-hover/item:text-primary transition-colors">{persona.name}</div>
                    <div className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">{persona.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-2 py-1 bg-secondary hover:bg-secondary/80 rounded-lg text-xs transition-colors">
              <Globe className="w-3 h-3" />
              <span className="uppercase">{currentLanguage.split('-')[0]}</span>
            </button>
            <div className="absolute right-0 mt-1 w-32 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {[
                { label: 'English', value: 'en-US' },
                { label: 'Hindi', value: 'hi-IN' },
                { label: 'Spanish', value: 'es-ES' },
                { label: 'French', value: 'fr-FR' },
                { label: 'German', value: 'de-DE' },
              ].map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => {
                    setLanguage(lang.value);
                    toast.success(`Language set to ${lang.label}`);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg ${currentLanguage === lang.value ? 'bg-accent font-medium' : ''
                    }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

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
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl bg-secondary p-3 rounded-2xl shadow-inner">
                  {PERSONAS.find(p => p.id === currentPersonaId)?.icon}
                </span>
                <h1 className="text-3xl font-bold tracking-tight">
                  {PERSONAS.find(p => p.id === currentPersonaId)?.name}
                </h1>
              </div>
              <p className="text-muted-foreground mb-8 max-w-md text-lg leading-relaxed">
                {PERSONAS.find(p => p.id === currentPersonaId)?.description}
              </p>
              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mt-8">
                {[
                  {
                    title: 'AI Expert Personas',
                    description: 'Switch between experts like Code Master or Creative Writer.',
                    icon: <Sparkles className="w-5 h-5 text-primary" />,
                    color: 'bg-primary/10'
                  },
                  {
                    title: 'Smart File Processing',
                    description: 'Extract text from PDF, Word, and Excel documents automatically.',
                    icon: <FileText className="w-5 h-5 text-green-500" />,
                    color: 'bg-green-500/10'
                  },
                  {
                    title: 'Multi-language Voice',
                    description: 'Talk and listen in English, Hindi, Spanish, French, and more.',
                    icon: <Globe className="w-5 h-5 text-blue-500" />,
                    color: 'bg-blue-500/10'
                  },
                  {
                    title: 'Advanced Vision',
                    description: 'Upload images for deep analysis and insights.',
                    icon: <Logo size="sm" className="text-purple-500" />,
                    color: 'bg-purple-500/10'
                  },
                  {
                    title: 'Chat History',
                    description: 'Save and load your conversations seamlessly.',
                    icon: <Save className="w-5 h-5 text-orange-500" />,
                    color: 'bg-orange-500/10'
                  },
                  {
                    title: 'Export Anywhere',
                    description: 'Download responses as PDF, DOCX, or Excel files.',
                    icon: <MoreVertical className="w-5 h-5 text-pink-500" />,
                    color: 'bg-pink-500/10'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    className={`p-4 rounded-xl border border-border/50 ${feature.color} backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group text-left`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-background rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="font-bold text-sm tracking-tight">{feature.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 text-muted-foreground text-xs animate-pulse">
                Type a message below to start your journey with Lumo.AI
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
              placeholder="Type your message here... (Shift+Enter for new line)"
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

        {/* Compact Chat Footer */}
        <footer className="mt-3 py-1 border-t border-border/30 flex items-center justify-between text-[10px] text-muted-foreground/60 max-w-4xl mx-auto px-1">
          <div className="flex items-center gap-3">
            <span>© 2024 Lumo.AI</span>
            <div className="flex items-center gap-3 ml-2">
              <button onClick={() => window.open('/privacy', '_blank')} className="hover:text-foreground transition-colors">Privacy</button>
              <button onClick={() => window.open('/terms', '_blank')} className="hover:text-foreground transition-colors">Terms</button>
              <button onClick={() => window.open('/support', '_blank')} className="hover:text-foreground transition-colors">Support</button>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold text-primary/70">Google Gemini</span>
          </div>
        </footer>
      </motion.div>
    </div>
  );
}
