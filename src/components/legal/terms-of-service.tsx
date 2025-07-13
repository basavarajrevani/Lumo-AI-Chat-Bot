'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, CheckCircle, AlertTriangle, Scale, Users, Zap } from 'lucide-react';

interface TermsOfServiceProps {
  onClose: () => void;
}

export function TermsOfService({ onClose }: TermsOfServiceProps) {
  const sections = [
    {
      icon: CheckCircle,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using Lumo.AI, you accept and agree to be bound by these terms",
        "If you do not agree to these terms, please do not use our services",
        "We may update these terms from time to time, and continued use constitutes acceptance",
        "You must be at least 13 years old to use our services",
        "If you are under 18, you must have parental consent to use our services"
      ]
    },
    {
      icon: Zap,
      title: "Service Description",
      content: [
        "Lumo.AI provides AI-powered chat and conversation services",
        "Our service uses Google Gemini AI to generate responses",
        "We offer file upload and analysis capabilities",
        "Voice input and text-to-speech features are available",
        "Services are provided 'as is' and may be updated or modified at any time"
      ]
    },
    {
      icon: Users,
      title: "User Responsibilities",
      content: [
        "You are responsible for all content you submit to our service",
        "Do not use our service for illegal, harmful, or abusive purposes",
        "Do not attempt to reverse engineer or exploit our systems",
        "Respect intellectual property rights of others",
        "Do not share sensitive personal information like passwords or financial data"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Uses",
      content: [
        "Generating harmful, illegal, or inappropriate content",
        "Attempting to bypass security measures or rate limits",
        "Using the service to spam, harass, or abuse others",
        "Uploading malicious files or attempting to compromise our systems",
        "Commercial use without explicit permission"
      ]
    },
    {
      icon: Scale,
      title: "Intellectual Property",
      content: [
        "Lumo.AI and its features are protected by intellectual property laws",
        "You retain ownership of content you create using our service",
        "AI-generated responses are not copyrightable and are provided as-is",
        "You grant us a license to process your inputs to provide our services",
        "Respect third-party intellectual property when using our service"
      ]
    },
    {
      icon: FileText,
      title: "Limitation of Liability",
      content: [
        "Our service is provided 'as is' without warranties of any kind",
        "We are not liable for any damages arising from use of our service",
        "AI responses may contain errors and should not be relied upon for critical decisions",
        "We do not guarantee continuous availability of our services",
        "Maximum liability is limited to the amount paid for our services (if any)"
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col mx-4 my-8 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-card/50">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold">Terms of Service</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Close terms of service"
            aria-label="Close terms of service"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* Introduction */}
            <div className="text-center mb-8">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                These Terms of Service govern your use of Lumo.AI and its services. 
                Please read them carefully before using our platform.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Sections */}
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-muted/20 rounded-lg p-4 sm:p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <section.icon className="w-5 h-5 text-primary" />
                  <h3 className="text-base sm:text-lg font-semibold">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2 text-sm sm:text-base text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Agreement */}
            <div className="bg-primary/10 rounded-lg p-4 sm:p-6 text-center">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Agreement</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                By using Lumo.AI, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service.
              </p>
              <a
                href="mailto:basavarajrevani@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
              >
                Contact for Questions
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-border bg-muted/20 flex-shrink-0">
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            <span className="hidden sm:inline">Press ESC or click outside to close</span>
            <span className="sm:hidden">Tap ❌ or outside to close</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
