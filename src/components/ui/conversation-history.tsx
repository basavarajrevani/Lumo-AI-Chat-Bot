'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, Download, Trash2, MessageSquare, Calendar, Tag, X } from 'lucide-react';
import { ConversationService, ConversationSummary } from '@/services/conversation-service';
import toast from 'react-hot-toast';

interface ConversationHistoryProps {
  onLoadConversation: (conversationId: string) => void;
  className?: string;
}

export function ConversationHistory({ onLoadConversation, className = '' }: ConversationHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<ConversationSummary[]>([]);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = ConversationService.searchConversations(searchQuery);
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  useEffect(() => {
    // Handle ESC key to close modal
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Touch handlers for swipe to close on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isDownSwipe = distance < -50; // Swipe down threshold

    if (isDownSwipe) {
      setIsOpen(false);
    }
  };

  const loadConversations = () => {
    const summaries = ConversationService.getConversationSummaries();
    setConversations(summaries);
  };

  const handleLoadConversation = (conversationId: string) => {
    onLoadConversation(conversationId);
    setIsOpen(false);
    toast.success('Conversation loaded!');
  };

  const handleDeleteConversation = (conversationId: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      ConversationService.deleteConversation(conversationId);
      loadConversations();
      toast.success('Conversation deleted');
    }
  };

  const handleDownloadConversation = (conversationId: string, format: 'txt' | 'md' | 'json' = 'txt') => {
    try {
      ConversationService.downloadConversation(conversationId, format);
      toast.success(`Conversation exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export conversation');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className={className}>
      {/* History Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="p-2 sm:p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
        title="Conversation history"
      >
        <History className="w-4 h-4 sm:w-5 sm:h-5" />
      </motion.button>

      {/* History Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="modal-content w-full max-w-4xl max-h-[85vh] flex flex-col mx-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <h2 className="text-lg sm:text-xl font-semibold">Conversation History</h2>
                  <span className="text-xs sm:text-sm text-muted-foreground">
                    ({conversations.length} conversations)
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors border border-border hover:border-primary/50"
                  title="Close conversation history"
                >
                  <X className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                </motion.button>
              </div>

              {/* Search */}
              <div className="p-6 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto p-6">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      {searchQuery ? 'No conversations found' : 'No conversations yet'}
                    </p>
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? 'Try adjusting your search terms' 
                        : 'Start chatting to see your conversation history here'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredConversations.map((conversation) => (
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group p-4 bg-muted/50 hover:bg-muted rounded-lg border border-transparent hover:border-border transition-all cursor-pointer"
                        onClick={() => handleLoadConversation(conversation.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate mb-1">
                              {conversation.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {conversation.lastMessage}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                {conversation.messageCount} messages
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(conversation.updatedAt)}
                              </div>
                              {conversation.tags.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Tag className="w-3 h-3" />
                                  {conversation.tags.slice(0, 2).join(', ')}
                                  {conversation.tags.length > 2 && '...'}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownloadConversation(conversation.id, 'txt');
                              }}
                              className="p-1.5 hover:bg-background rounded transition-colors"
                              title="Download conversation"
                            >
                              <Download className="w-4 h-4" />
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConversation(conversation.id, conversation.title);
                              }}
                              className="p-1.5 hover:bg-background rounded transition-colors text-red-500"
                              title="Delete conversation"
                            >
                              <Trash2 className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 sm:p-4 border-t border-border bg-muted/20 flex-shrink-0">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
                  <span>💡 Tap any conversation to load it</span>
                  <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-xs opacity-75">
                    {/* Desktop instructions */}
                    <span className="hidden sm:inline">ESC to close</span>

                    {/* Mobile instructions */}
                    <div className="sm:hidden text-center">
                      <div>Tap ❌ • Tap outside • Swipe down ⬇️</div>
                    </div>

                    {/* Common instruction */}
                    <span className="hidden sm:inline">• Tap outside to close</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
