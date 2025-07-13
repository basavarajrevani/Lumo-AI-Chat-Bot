'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Code, User, Twitter, MapPin, Clock, Send, Heart, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactProps {
  onClose: () => void;
}

export function Contact({ onClose }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: User,
      title: "Developer",
      value: "Basavaraj Revani",
      description: "Developer & AI Enthusiast"
    },
    {
      icon: Mail,
      title: "Email",
      value: "basavarajrevani123@gmail.com",
      description: "Primary contact for all inquiries",
      href: "mailto:basavarajrevani123@gmail.com"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "India",
      description: "Available for remote collaboration worldwide"
    },
    {
      icon: Clock,
      title: "Response Time",
      value: "24-48 hours",
      description: "Typical response time for emails"
    }
  ];

  const socialLinks = [
    {
      icon: Code,
      title: "GitHub",
      username: "@basavarajrevani",
      href: "https://github.com/basavarajrevani",
      color: "text-gray-600 hover:text-gray-800",
      description: "View projects and contributions"
    },
    {
      icon: User,
      title: "LinkedIn",
      username: "Basavaraj Revani",
      href: "https://linkedin.com/in/basavarajrevani",
      color: "text-blue-600 hover:text-blue-800",
      description: "Professional network and experience"
    },
    {
      icon: Twitter,
      title: "X (Twitter)",
      username: "@basavarajrevani",
      href: "https://x.com/basavarajrevani",
      color: "text-blue-500 hover:text-blue-700",
      description: "Latest updates and tech discussions"
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Message sent successfully! I\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else if (result.fallbackToMailto) {
        // Fallback to mailto if email service is not configured
        toast.success('Opening your email client...');
        const subject = encodeURIComponent(formData.subject || 'Contact from Lumo.AI');
        const body = encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        );
        window.open(`mailto:basavarajrevani123@gmail.com?subject=${subject}&body=${body}`);
      } else {
        toast.error(result.error || 'Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h2 className="text-lg sm:text-xl font-semibold">Contact</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Close contact"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Get in Touch</h3>
                <p className="text-muted-foreground">
                  Have questions about Lumo.AI? Want to collaborate or provide feedback? 
                  I'd love to hear from you!
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-muted/20 rounded-lg"
                  >
                    <info.icon className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{info.title}</h4>
                      {info.href ? (
                        <a
                          href={info.href}
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-foreground">{info.value}</p>
                      )}
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div>
                <h4 className="text-lg font-semibold mb-4">Connect on Social Media</h4>
                <div className="space-y-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.title}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-all duration-200"
                    >
                      <social.icon className={`w-5 h-5 ${social.color} transition-colors`} />
                      <div className="flex-1">
                        <h5 className="font-medium">{social.title}</h5>
                        <p className="text-sm text-muted-foreground">{social.username}</p>
                        <p className="text-xs text-muted-foreground">{social.description}</p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Send a Message</h3>
                <p className="text-muted-foreground">
                  Fill out the form below and I'll get back to you as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full p-3 bg-input border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                    placeholder="Tell me about your question, feedback, or collaboration idea..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                    isSubmitting
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                <p>Your message will be sent directly to Basavaraj. You'll receive a confirmation once sent.</p>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="mt-8 text-center bg-primary/10 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="font-medium">Thank you for your interest in Lumo.AI!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Whether you have questions, feedback, or want to collaborate, I'm always excited to connect 
              with fellow developers and AI enthusiasts.
            </p>
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
