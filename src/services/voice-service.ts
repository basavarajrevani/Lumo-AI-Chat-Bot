export class VoiceService {
  private recognition: any | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private onResultCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private currentLanguage = 'en-US';

  constructor() {
    if (typeof window !== 'undefined') {
      this.synthesis = window.speechSynthesis;
      this.initializeSpeechRecognition();
    }
  }

  public setLanguage(lang: string) {
    this.currentLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public getLanguage(): string {
    return this.currentLanguage;
  }

  private initializeSpeechRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = this.currentLanguage;

        this.recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (this.onResultCallback) {
            this.onResultCallback(transcript);
          }
        };

        this.recognition.onerror = (event: any) => {
          if (this.onErrorCallback) {
            this.onErrorCallback(event.error);
          }
          this.isListening = false;
        };

        this.recognition.onend = () => {
          this.isListening = false;
        };
      }
    }
  }

  public startListening(
    onResult: (text: string) => void,
    onError: (error: string) => void
  ): boolean {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
      return false;
    }

    // Ensure lang is correct before starting
    if (this.recognition) {
      this.recognition.lang = this.currentLanguage;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      onError('Failed to start speech recognition');
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public speak(text: string, options?: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: SpeechSynthesisVoice;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis || typeof window === 'undefined') {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      // Clean the text before speaking
      const cleanedText = this.cleanText(text);
      if (!cleanedText.trim()) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = this.currentLanguage;

      // Set options
      if (options) {
        utterance.rate = options.rate ?? 1;
        utterance.pitch = options.pitch ?? 1;
        utterance.volume = options.volume ?? 1;
        if (options.voice) {
          utterance.voice = options.voice;
        } else {
          // Try to find a voice that matches the language
          const voices = this.getAvailableVoices();
          const matchingVoice = voices.find(v => v.lang === this.currentLanguage || v.lang.startsWith(this.currentLanguage.split('-')[0]));
          if (matchingVoice) {
            utterance.voice = matchingVoice;
          }
        }
      } else {
        // Try to find a voice that matches the language even without options
        const voices = this.getAvailableVoices();
        const matchingVoice = voices.find(v => v.lang === this.currentLanguage || v.lang.startsWith(this.currentLanguage.split('-')[0]));
        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      utterance.onend = () => resolve();
      utterance.onerror = (event) => {
        // Handle common speech synthesis errors gracefully
        if (event.error === 'interrupted' || event.error === 'canceled') {
          // These are normal when user stops speech or navigates away
          resolve(); // Don't treat as error
        } else {
          console.warn('Speech synthesis error:', event.error);
          reject(new Error(event.error));
        }
      };

      this.synthesis.speak(utterance);
    });
  }

  private cleanText(text: string): string {
    return text
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, ' [code block] ')
      // Remove inline code
      .replace(/`([^`]+)`/g, '$1')
      // Remove bold and italic markdown (handles both * and _)
      .replace(/(\*\*\*|___)(.*?)\1/g, '$2')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      // Remove markdown headers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove markdown links [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove horizontal rules
      .replace(/^(\*|-|_){3,}$/gm, '')
      // Remove blockquotes > 
      .replace(/^\s*>\s*/gm, '')
      // Remove backslashes used for escaping
      .replace(/\\/g, '')
      // Replace repetitive symbols (like --- or ===)
      .replace(/[=\-_]{2,}/g, ' ')
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  public stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis && typeof window !== 'undefined' ? this.synthesis.getVoices() : [];
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && !!(this.recognition && this.synthesis);
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

// Global instance
let voiceServiceInstance: VoiceService | null = null;

export const getVoiceService = (): VoiceService | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!voiceServiceInstance) {
    voiceServiceInstance = new VoiceService();
  }
  return voiceServiceInstance;
};
