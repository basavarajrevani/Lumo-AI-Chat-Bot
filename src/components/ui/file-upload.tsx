'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, Upload, X, File, Image, FileText, Code } from 'lucide-react';
import { FileService, FileUploadResult } from '../../services/file-service';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onFileProcessed: (result: FileUploadResult) => void;
  className?: string;
}

export function FileUpload({ onFileProcessed, className = '' }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDropZone, setShowDropZone] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (showDropZone) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showDropZone]);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsProcessing(true);

    try {
      const result = await FileService.processFile(file);
      onFileProcessed(result);
      toast.success(`File "${file.name}" processed successfully!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
      setShowDropZone(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image className="w-4 h-4" />;
    }

    if (['js', 'jsx', 'ts', 'tsx', 'py', 'java', 'cpp', 'c', 'h', 'cs', 'php', 'rb', 'go', 'rs'].includes(extension || '')) {
      return <Code className="w-4 h-4" />;
    }

    if (['txt', 'md', 'pdf', 'doc', 'docx'].includes(extension || '')) {
      return <FileText className="w-4 h-4" />;
    }

    if (['xls', 'xlsx', 'csv'].includes(extension || '')) {
      return <Upload className="w-4 h-4" />; // Or another icon
    }

    return <File className="w-4 h-4" />;
  };

  const supportedTypes = FileService.getSupportedTypes();
  const maxSize = FileService.getMaxFileSize();

  return (
    <div className={`relative ${className}`}>
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => handleFileSelect(e.target.files)}
        accept={supportedTypes.join(',')}
        className="hidden"
      />

      {/* Upload Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className="group p-2 sm:p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50 relative"
        title="Upload file for analysis"
      >
        {isProcessing ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Upload className="w-5 h-5" />
          </motion.div>
        ) : (
          <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </motion.button>

      {/* File Type Tooltip */}
      {!isProcessing && (
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
          <div className="bg-gray-900 text-white text-xs rounded px-3 py-2 max-w-xs">
            <div className="font-medium mb-1">Upload Files</div>
            <div>Text files: Full analysis</div>
            <div>PDFs & Documents: Full text extraction</div>
            <div>Images: Visual analysis</div>
          </div>
        </div>
      )}

      {/* Drop Zone Modal */}
      <AnimatePresence>
        {showDropZone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4"
            onClick={() => setShowDropZone(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-content p-6 sm:p-8 max-w-md w-full mx-4"
            >
              {/* Close Button */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Upload File</h3>
                <button
                  onClick={() => setShowDropZone(false)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                  }`}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  Drop your file here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Choose File
                </motion.button>
              </div>

              {/* Important Instructions */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  How File Upload Works
                </h4>
                <div className="text-xs text-blue-700 dark:text-blue-300 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-medium">✅ Text & Docs:</span>
                    <span>Full automatic text extraction (PDF, Word)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium">📊 Spreadsheets:</span>
                    <span>Excel and CSV analysis supported</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-medium">🖼️ Images:</span>
                    <span>Vision-based image analysis</span>
                  </div>
                </div>
              </div>

              {/* Supported Formats */}
              <div className="mt-4 space-y-3">
                <div>
                  <h4 className="text-sm font-medium mb-2">Supported Formats:</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Text, Markdown, CSV
                    </div>
                    <div className="flex items-center gap-1">
                      <Code className="w-3 h-3" />
                      Code files (JS, Python, etc.)
                    </div>
                    <div className="flex items-center gap-1">
                      <Image className="w-3 h-3" />
                      Images (JPG, PNG, GIF)
                    </div>
                    <div className="flex items-center gap-1">
                      <File className="w-3 h-3" />
                      PDF, JSON, XML
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  Maximum file size: {Math.round(maxSize / 1024 / 1024)}MB
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
