'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Edit, Trash2, ThumbsUp, ThumbsDown, Download, FileText, File, Table } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { LogoMark } from '../../components/ui/logo';
import { Message } from '../../types/chat';
import { DownloadService } from '../../services/download-service';
import toast from 'react-hot-toast';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [reaction, setReaction] = useState<'like' | 'dislike' | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  const isUser = message.role === 'user';
  const isDarkMode = document.documentElement.classList.contains('dark');

  // Close download menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    };

    if (showDownloadMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDownloadMenu]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    // Here you would update the message in your store
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  const handleReaction = (type: 'like' | 'dislike') => {
    setReaction(reaction === type ? null : type);
    // Here you would send the reaction to your analytics/feedback system
  };

  const handleDownload = async (format: string) => {
    try {
      const filename = `lumo-ai-response-${new Date().toISOString().slice(0, 10)}`;

      switch (format) {
        case 'pdf':
          await DownloadService.downloadAsPDF(message.content, filename);
          toast.success('PDF downloaded successfully!');
          break;
        case 'docx':
          DownloadService.downloadAsWord(message.content, filename);
          toast.success('Word document downloaded successfully!');
          break;
        case 'xlsx':
          await DownloadService.downloadAsExcel(message.content, filename);
          toast.success('Excel file downloaded successfully!');
          break;
        case 'txt':
          DownloadService.downloadAsText(message.content, filename);
          toast.success('Text file downloaded successfully!');
          break;
        case 'md':
          DownloadService.downloadAsMarkdown(message.content, filename);
          toast.success('Markdown file downloaded successfully!');
          break;
        default:
          toast.error('Unsupported format');
      }
      setShowDownloadMenu(false);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  const getDownloadIcon = (format: string) => {
    switch (format) {
      case 'xlsx': return <Table className="w-3 h-3" />;
      case 'pdf': case 'docx': return <FileText className="w-3 h-3" />;
      default: return <File className="w-3 h-3" />;
    }
  };

  // Get smart download suggestions based on content
  const downloadSuggestions = DownloadService.detectContentType(message.content);

  const messageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: { opacity: 0, y: -20, scale: 0.95 }
  };

  return (
    <motion.div
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex gap-2 sm:gap-3 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-xs sm:text-sm">
            U
          </div>
        ) : (
          <LogoMark size="sm" animated={false} />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[85%] sm:max-w-[80%] ${isUser ? 'flex flex-col items-end' : ''}`}>
        <div
          className={`chat-message relative rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 bg-background text-foreground rounded border resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-muted text-muted-foreground rounded text-sm hover:bg-muted/80"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {isUser ? (
                <p className="m-0 whitespace-pre-wrap">{message.content}</p>
              ) : (
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={isDarkMode ? oneDark : oneLight}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-md !mt-2 !mb-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
          )}
        </div>

        {/* Message Actions */}
        <div className={`flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title="Copy message"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </motion.button>

          {isUser && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleEdit}
              className="p-1.5 rounded-md hover:bg-muted transition-colors"
              title="Edit message"
            >
              <Edit className="w-3 h-3" />
            </motion.button>
          )}

          {!isUser && (
            <>
              {/* Download Button */}
              <div className="relative" ref={downloadMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="p-1.5 rounded-md hover:bg-muted transition-colors"
                  title="Download response"
                >
                  <Download className="w-3 h-3" />
                </motion.button>

                {/* Download Menu */}
                <AnimatePresence>
                  {showDownloadMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-[120px] z-10"
                    >
                      {downloadSuggestions.map((format) => (
                        <button
                          key={format}
                          onClick={() => handleDownload(format)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                        >
                          {getDownloadIcon(format)}
                          <span className="capitalize">
                            {format === 'xlsx' ? 'Excel' : format === 'docx' ? 'Word' : format.toUpperCase()}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReaction('like')}
                className={`p-1.5 rounded-md transition-colors ${
                  reaction === 'like' ? 'bg-green-100 text-green-600' : 'hover:bg-muted'
                }`}
                title="Like response"
              >
                <ThumbsUp className="w-3 h-3" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleReaction('dislike')}
                className={`p-1.5 rounded-md transition-colors ${
                  reaction === 'dislike' ? 'bg-red-100 text-red-600' : 'hover:bg-muted'
                }`}
                title="Dislike response"
              >
                <ThumbsDown className="w-3 h-3" />
              </motion.button>
            </>
          )}
        </div>

        {/* Timestamp */}
        <div className={`text-xs text-muted-foreground mt-1 ${
          isUser ? 'text-right' : 'text-left'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </motion.div>
  );
}
