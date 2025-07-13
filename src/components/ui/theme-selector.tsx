'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Sun, Moon, X } from 'lucide-react';
import { ThemeService, Theme, themes } from '@/services/theme-service';
import toast from 'react-hot-toast';

interface ThemeSelectorProps {
  className?: string;
}

export function ThemeSelector({ className = '' }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'light' | 'dark'>('all');

  useEffect(() => {
    setCurrentTheme(ThemeService.getCurrentTheme());

    // Listen for theme changes
    const handleThemeChange = (event: CustomEvent<Theme>) => {
      setCurrentTheme(event.detail);
    };

    window.addEventListener('themeChanged', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange as EventListener);
    };
  }, []);

  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  useEffect(() => {
    // Handle ESC key to close modal
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleThemeSelect = (themeId: string) => {
    ThemeService.setTheme(themeId);
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      toast.success(`Theme changed to ${theme.name}`);
    }
    // Auto-close modal after selection
    setTimeout(() => {
      setIsOpen(false);
    }, 500);
  };

  const filteredThemes = themes.filter(theme => {
    if (selectedCategory === 'light') return !theme.isDark;
    if (selectedCategory === 'dark') return theme.isDark;
    return true;
  });

  const getThemePreview = (theme: Theme) => {
    return (
      <div className="w-full h-12 sm:h-16 rounded-lg overflow-hidden border border-border/50 shadow-sm">
        {/* Background bar */}
        <div
          className="w-full h-1/3"
          style={{ backgroundColor: `hsl(${theme.colors.background})` }}
        />
        {/* Color palette */}
        <div className="flex h-2/3">
          <div
            className="flex-1"
            style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
          />
          <div
            className="flex-1"
            style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
          />
          <div
            className="flex-1"
            style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
          />
          <div
            className="flex-1"
            style={{ backgroundColor: `hsl(${theme.colors.muted})` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={className}>
      {/* Theme Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="p-2 sm:p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
        title="Change theme"
      >
        <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
      </motion.button>

      {/* Theme Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="theme-selector-modal bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col mx-4 my-8 relative z-[10000]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border bg-card/50">
                <div className="flex items-center gap-3">
                  <Palette className="w-5 h-5 sm:w-6 sm:h-6" />
                  <h2 className="text-lg sm:text-xl font-semibold">Choose Theme</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  title="Close theme selector"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Category Filter */}
              <div className="p-4 sm:p-6 border-b border-border bg-muted/20">
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'all', label: 'All Themes', icon: Palette },
                    { key: 'light', label: 'Light', icon: Sun },
                    { key: 'dark', label: 'Dark', icon: Moon }
                  ].map(({ key, label, icon: Icon }) => (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCategory(key as any)}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                        selectedCategory === key
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{label}</span>
                      <span className="sm:hidden">{key === 'all' ? 'All' : label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Themes Grid */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pb-4">
                  {filteredThemes.map((theme) => (
                    <motion.div
                      key={theme.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleThemeSelect(theme.id)}
                      className={`relative p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        currentTheme.id === theme.id
                          ? 'border-primary bg-primary/10 shadow-lg'
                          : 'border-border hover:border-primary/50 hover:shadow-md'
                      }`}
                    >
                      {/* Theme Preview */}
                      <div className="mb-3">
                        {getThemePreview(theme)}
                      </div>

                      {/* Theme Info */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-sm sm:text-base truncate">{theme.name}</h3>
                          {currentTheme.id === theme.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 ml-2"
                            >
                              <Check className="w-2 h-2 sm:w-3 sm:h-3 text-primary-foreground" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                          {theme.description}
                        </p>
                        
                        {/* Theme Type Badge */}
                        <div className="flex items-center gap-1 sm:gap-2 mt-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                            theme.isDark
                              ? 'bg-gray-800 text-gray-200'
                              : 'bg-gray-200 text-gray-800'
                          }`}>
                            {theme.isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                            {theme.isDark ? 'Dark' : 'Light'}
                          </span>

                          {theme.gradient && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              Gradient
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 sm:p-4 border-t border-border bg-muted/20 flex-shrink-0">
                <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                  <span>💡 Auto-saved across sessions</span>
                  <span className="text-xs opacity-75">ESC to close</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
