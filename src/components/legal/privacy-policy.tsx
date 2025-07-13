'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Shield, Eye, Lock, Database, Users, Globe } from 'lucide-react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

export function PrivacyPolicy({ onClose }: PrivacyPolicyProps) {
  const sections = [
    {
      icon: Shield,
      title: "Information We Collect",
      content: [
        "Chat conversations and messages you send to our AI assistant",
        "Usage data including timestamps, response times, and feature usage",
        "Technical information such as browser type, device information, and IP address",
        "Account information if you choose to create an account (email, preferences)",
        "Files you upload for analysis (temporarily processed and not permanently stored)"
      ]
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "To provide and improve our AI chat services",
        "To personalize your experience and remember your preferences",
        "To analyze usage patterns and improve our algorithms",
        "To ensure security and prevent abuse of our services",
        "To communicate with you about service updates and important notices"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "All data is encrypted in transit using industry-standard TLS encryption",
        "Chat conversations are processed securely and not stored permanently",
        "We implement strict access controls and security measures",
        "Regular security audits and vulnerability assessments",
        "Data is processed in secure, compliant cloud infrastructure"
      ]
    },
    {
      icon: Database,
      title: "Data Retention",
      content: [
        "Chat conversations are not permanently stored on our servers",
        "Usage analytics are retained for up to 12 months for service improvement",
        "Account information is retained until you request deletion",
        "Uploaded files are processed temporarily and deleted immediately after processing",
        "You can request deletion of your data at any time"
      ]
    },
    {
      icon: Users,
      title: "Data Sharing",
      content: [
        "We do not sell your personal information to third parties",
        "Chat data is processed by Google Gemini AI under strict privacy agreements",
        "Anonymous usage statistics may be shared for research purposes",
        "We may share data if required by law or to protect our rights",
        "Service providers are bound by strict confidentiality agreements"
      ]
    },
    {
      icon: Globe,
      title: "Your Rights",
      content: [
        "Right to access your personal information",
        "Right to correct or update your information",
        "Right to delete your account and associated data",
        "Right to data portability and export",
        "Right to opt-out of non-essential data processing"
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
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold">Privacy Policy</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Close privacy policy"
            aria-label="Close privacy policy"
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
                At Lumo.AI, we take your privacy seriously. This policy explains how we collect, 
                use, and protect your information when you use our AI chat services.
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

            {/* Contact Information */}
            <div className="bg-primary/10 rounded-lg p-4 sm:p-6 text-center">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Questions About Privacy?</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                If you have any questions about this privacy policy or how we handle your data, 
                please don't hesitate to contact us.
              </p>
              <a
                href="mailto:basavarajrevani@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
              >
                Contact Us
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
