'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingPage } from '@/components/landing/landing-page';
import { ChatInterface } from '@/components/chat/chat-interface';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export function MainApp() {
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);
    
    // Add a small delay for smooth transition
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setShowChat(true);
    setIsLoading(false);
  };

  const handleBackToLanding = () => {
    setShowChat(false);
  };

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1
    },
    exit: {
      opacity: 0,
      scale: 1.05
    }
  };

  const loadingVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <ErrorBoundary>
      <div className="relative w-full min-h-screen overflow-x-hidden overflow-y-auto">
        <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            variants={loadingVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 flex items-center justify-center bg-background z-50"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-muted-foreground">Initializing Lumo.AI...</p>
            </div>
          </motion.div>
        ) : showChat ? (
          <motion.div
            key="chat"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
          >
            <ChatInterface />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0"
          >
            <LandingPage onGetStarted={handleGetStarted} />
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
