'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

interface SocialLinksProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SocialLinks({ className = '', size = 'md' }: SocialLinksProps) {
  const socialLinks = [
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/basavarajrevani',
      color: 'hover:text-gray-900 dark:hover:text-gray-100'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com/in/basavarajrevani',
      color: 'hover:text-blue-600'
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      href: 'https://x.com/basavarajrevani',
      color: 'hover:text-blue-500'
    },
    {
      name: 'Email',
      icon: Mail,
      href: 'mailto:basavarajrevani123@gmail.com',
      color: 'hover:text-green-500'
    }
  ];

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const containerClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-5'
  };

  const buttonClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };

  return (
    <div className={`flex items-center ${containerClasses[size]} ${className}`}>
      {socialLinks.map((link, index) => (
        <motion.a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`${buttonClasses[size]} rounded-lg text-muted-foreground transition-all duration-200 ${link.color} hover:bg-muted/50`}
          title={link.name}
        >
          <link.icon className={sizeClasses[size]} />
        </motion.a>
      ))}
    </div>
  );
}

export function MadeWithLove({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={`flex items-center gap-1 text-xs sm:text-sm text-muted-foreground ${className}`}
    >
      <span>Built with</span>
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 fill-current" />
      </motion.div>
      <span>by Basavaraj Revani</span>
    </motion.div>
  );
}
