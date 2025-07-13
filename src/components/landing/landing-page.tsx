'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageSquare, Zap, Shield, Sparkles, Brain, Globe, Users } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { SocialLinks, MadeWithLove } from '@/components/ui/social-links';
import { PrivacyPolicy } from '@/components/legal/privacy-policy';
import { TermsOfService } from '@/components/legal/terms-of-service';
import { Support } from '@/components/support/support';
import { Contact } from '@/components/contact/contact';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'support' | 'contact' | null>(null);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced conversations powered by Google Gemini AI for accurate, thoughtful responses."
    },
    {
      icon: MessageSquare,
      title: "Natural Conversations",
      description: "Chat naturally with context-aware responses that understand your needs."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get instant responses with our optimized AI processing pipeline."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your conversations are protected with enterprise-grade security."
    },
    {
      icon: Globe,
      title: "Multi-Language",
      description: "Communicate in multiple languages with seamless translation."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share conversations and collaborate with your team members."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="landing-page main-container min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col overflow-y-auto">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full p-4 sm:p-6 lg:p-8"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="lg" animated={true} />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            Chat Now
          </motion.button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Hero Content */}
          <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="mb-6 sm:mb-8"
            >
              <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-primary mb-4" />
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
              Meet Your Intelligent
              <br className="hidden sm:block" />
              <span className="block mt-2">AI Assistant</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Experience the future of AI conversation with Lumo.AI. Powered by Google Gemini, 
              get intelligent responses, creative solutions, and expert assistance for any task.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="mb-12 sm:mb-16">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onGetStarted}
              className="group relative inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Get Started</span>
              <motion.div
                whileHover={{ x: 5 }}
                className="relative z-10"
              >
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.div>
              
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
            </motion.button>
          </motion.div>

          {/* Features Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm border border-border rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-3 sm:mb-4 mx-auto" />
                <h3 className="text-sm sm:text-base font-semibold mb-2 text-center">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full border-t border-border bg-card/30 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col gap-6">
            {/* Main Footer Content */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Logo size="sm" animated={false} />
                <MadeWithLove />
              </div>

              {/* Social Links Below */}
              <SocialLinks size="md" />
            </div>

            {/* Footer Links */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
              <div className="text-xs sm:text-sm text-muted-foreground">
                © 2024 Lumo.AI. All rights reserved.
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
                <button
                  onClick={() => setActiveModal('privacy')}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setActiveModal('terms')}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => setActiveModal('support')}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Support
                </button>
                <button
                  onClick={() => setActiveModal('contact')}
                  className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === 'privacy' && (
          <PrivacyPolicy onClose={() => setActiveModal(null)} />
        )}
        {activeModal === 'terms' && (
          <TermsOfService onClose={() => setActiveModal(null)} />
        )}
        {activeModal === 'support' && (
          <Support onClose={() => setActiveModal(null)} />
        )}
        {activeModal === 'contact' && (
          <Contact onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
