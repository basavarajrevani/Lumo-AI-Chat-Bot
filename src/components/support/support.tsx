'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, HelpCircle, MessageSquare, Book, Zap, Bug, Code, User, Mail, Twitter } from 'lucide-react';

interface SupportProps {
  onClose: () => void;
}

export function Support({ onClose }: SupportProps) {
  const supportOptions = [
    {
      icon: MessageSquare,
      title: "Chat Issues",
      description: "Problems with AI responses, conversation history, or chat functionality",
      solutions: [
        "Try refreshing the page and starting a new conversation",
        "Clear your browser cache and cookies",
        "Check your internet connection",
        "Try using a different browser or device"
      ]
    },
    {
      icon: Zap,
      title: "Performance Issues",
      description: "Slow responses, loading problems, or app crashes",
      solutions: [
        "Close other browser tabs to free up memory",
        "Disable browser extensions that might interfere",
        "Try using an incognito/private browsing window",
        "Check if your device meets minimum requirements"
      ]
    },
    {
      icon: Bug,
      title: "Bug Reports",
      description: "Found a bug or unexpected behavior?",
      solutions: [
        "Note the exact steps that led to the issue",
        "Take a screenshot if possible",
        "Include your browser and device information",
        "Contact support with detailed information"
      ]
    },
    {
      icon: Book,
      title: "Feature Requests",
      description: "Suggestions for new features or improvements",
      solutions: [
        "Check if the feature already exists",
        "Describe your use case clearly",
        "Explain how it would benefit users",
        "Submit your request through our contact form"
      ]
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed help via email",
      action: "basavarajrevani123@gmail.com",
      href: "mailto:basavarajrevani123@gmail.com?subject=Lumo.AI Support Request",
      color: "text-green-500"
    },
    {
      icon: Code,
      title: "GitHub Issues",
      description: "Report bugs or request features",
      action: "github.com/basavarajrevani",
      href: "https://github.com/basavarajrevani",
      color: "text-gray-600"
    },
    {
      icon: Twitter,
      title: "Social Media",
      description: "Quick questions and updates",
      action: "@basavarajrevani",
      href: "https://x.com/basavarajrevani",
      color: "text-blue-500"
    }
  ];

  const faqs = [
    {
      question: "How do I upload files for analysis?",
      answer: "Click the paperclip icon next to the message input, select your file, and it will be automatically processed and added to your conversation."
    },
    {
      question: "Can I save my conversations?",
      answer: "Yes! Use the save button in the header to save your current conversation. You can access saved conversations through the history button."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption and don't permanently store your conversations. Check our Privacy Policy for full details."
    },
    {
      question: "What file types are supported?",
      answer: "We support images (JPG, PNG, GIF), documents (PDF, TXT, MD), code files, and various other formats for AI analysis."
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
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col mx-4 my-8 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-card/50">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold">Support Center</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Close support center"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-8">
            {/* Introduction */}
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-2">How can we help you?</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Find answers to common questions or get in touch with our support team.
              </p>
            </div>

            {/* Common Issues */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Common Issues & Solutions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportOptions.map((option, index) => (
                  <motion.div
                    key={option.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-muted/20 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <option.icon className="w-5 h-5 text-primary" />
                      <h5 className="font-semibold">{option.title}</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                    <ul className="space-y-1">
                      {option.solutions.map((solution, sIndex) => (
                        <li key={sIndex} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                          <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Methods */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Get Personal Support</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {contactMethods.map((method, index) => (
                  <motion.a
                    key={method.title}
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-muted/20 rounded-lg p-4 hover:bg-muted/30 transition-all duration-200 block"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <method.icon className={`w-5 h-5 ${method.color}`} />
                      <h5 className="font-semibold">{method.title}</h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                    <p className={`text-sm font-medium ${method.color}`}>{method.action}</p>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Frequently Asked Questions</h4>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-muted/20 rounded-lg p-4"
                  >
                    <h5 className="font-semibold mb-2">{faq.question}</h5>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Developer Info */}
            <div className="bg-primary/10 rounded-lg p-4 sm:p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <User className="w-6 h-6 text-primary" />
                <h4 className="text-lg font-semibold">Developer Support</h4>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                Lumo.AI is developed and maintained by <strong>Basavaraj Revani</strong>. 
                For technical support, feature requests, or collaboration opportunities, feel free to reach out directly.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="mailto:basavarajrevani123@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  <Mail className="w-4 h-4" />
                  Developer
                </a>
                <a
                  href="https://github.com/basavarajrevani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm"
                >
                  <Code className="w-4 h-4" />
                  View GitHub
                </a>
              </div>
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
