'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Settings } from 'lucide-react';
import { getVoiceService } from '@/services/voice-service';
import toast from 'react-hot-toast';

interface VoiceControlsProps {
  onVoiceInput: (text: string) => void;
  onSpeakToggle: (enabled: boolean) => void;
  isSpeakEnabled: boolean;
  className?: string;
}

export function VoiceControls({ 
  onVoiceInput, 
  onSpeakToggle, 
  isSpeakEnabled, 
  className = '' 
}: VoiceControlsProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  const voiceService = getVoiceService();

  useEffect(() => {
    setIsSupported(voiceService.isSupported());
    
    // Load available voices
    const loadVoices = () => {
      const availableVoices = voiceService.getAvailableVoices();
      setVoices(availableVoices);
      
      // Set default voice (prefer English voices)
      const englishVoice = availableVoices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Google')
      ) || availableVoices.find(voice => voice.lang.startsWith('en'));
      
      if (englishVoice) {
        setSelectedVoice(englishVoice.name);
      }
    };

    loadVoices();
    
    // Voices might not be loaded immediately
    if (voices.length === 0) {
      setTimeout(loadVoices, 100);
    }
  }, [voiceService]);

  const handleVoiceInput = () => {
    if (!isSupported) {
      toast.error('Voice input is not supported in this browser');
      return;
    }

    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      return;
    }

    const success = voiceService.startListening(
      (text) => {
        setIsListening(false);
        onVoiceInput(text);
        toast.success('Voice input captured!');
      },
      (error) => {
        setIsListening(false);
        toast.error(`Voice input error: ${error}`);
      }
    );

    if (success) {
      setIsListening(true);
      toast.success('Listening... Speak now!');
    }
  };

  const handleSpeakToggle = () => {
    const newState = !isSpeakEnabled;
    onSpeakToggle(newState);
    
    if (newState) {
      toast.success('Text-to-speech enabled');
    } else {
      toast.success('Text-to-speech disabled');
      voiceService.stopSpeaking();
    }
  };

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    toast.success(`Voice changed to ${voiceName}`);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1 sm:gap-2 ${className}`}>
      {/* Voice Input Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleVoiceInput}
        className={`relative p-2 sm:p-3 rounded-lg transition-all duration-200 ${
          isListening
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
            : 'bg-muted hover:bg-muted/80'
        }`}
        title={isListening ? 'Stop listening' : 'Start voice input'}
      >
        {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
        
        {/* Listening animation */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.5, 1] }}
              exit={{ scale: 0 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 rounded-lg bg-red-500/30 -z-10"
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* Text-to-Speech Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSpeakToggle}
        className={`p-2 sm:p-3 rounded-lg transition-colors ${
          isSpeakEnabled
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted hover:bg-muted/80'
        }`}
        title={isSpeakEnabled ? 'Disable text-to-speech' : 'Enable text-to-speech'}
      >
        {isSpeakEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
      </motion.button>

      {/* Voice Settings */}
      <div className="relative hidden sm:block">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 sm:p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          title="Voice settings"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full right-0 mt-2 w-56 sm:w-64 bg-card border border-border rounded-lg shadow-xl p-4 z-[70] max-h-80 overflow-y-auto"
            >
              <h3 className="font-semibold mb-3">Voice Settings</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Text-to-Speech Voice
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => handleVoiceChange(e.target.value)}
                    className="w-full p-2 bg-input border border-input rounded text-sm"
                    disabled={!isSpeakEnabled}
                  >
                    {voices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: Click the microphone to start voice input, 
                    and toggle the speaker to enable AI voice responses.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click outside to close settings */}
      {showSettings && (
        <div
          className="fixed inset-0 z-[60]"
          onClick={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
