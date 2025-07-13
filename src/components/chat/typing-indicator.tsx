'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LogoMark } from '@/components/ui/logo';

export function TypingIndicator() {
  const dotVariants = {
    initial: { y: 0 },
    animate: {
      y: [-4, 0, -4],
      transition: {
        duration: 1.4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-3"
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <LogoMark size="sm" animated={false} />
      </div>

      {/* Typing Animation */}
      <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-1">
        <span className="text-sm text-muted-foreground mr-2">Lumo is thinking</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              variants={dotVariants}
              initial="initial"
              animate="animate"
              style={{
                animationDelay: `${index * 0.2}s`
              }}
              className="w-2 h-2 bg-muted-foreground rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
