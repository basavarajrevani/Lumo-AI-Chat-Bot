export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    border: string;
    chatUserBg: string;
    chatAiBg: string;
  };
  gradient?: string;
  isDark: boolean;
}

export const themes: Theme[] = [
  {
    id: 'lumo-light',
    name: 'Lumo Light',
    description: 'The classic Lumo.AI light theme',
    colors: {
      primary: '220 100% 60%',
      secondary: '240 100% 95%',
      accent: '280 100% 70%',
      background: '0 0% 100%',
      foreground: '240 10% 4%',
      muted: '240 5% 96%',
      border: '240 6% 90%',
      chatUserBg: '220 100% 60%',
      chatAiBg: '240 5% 96%'
    },
    isDark: false
  },
  {
    id: 'lumo-dark',
    name: 'Lumo Dark',
    description: 'The sleek Lumo.AI dark theme',
    colors: {
      primary: '220 100% 60%',
      secondary: '240 20% 15%',
      accent: '280 100% 70%',
      background: '240 20% 6%',
      foreground: '240 5% 90%',
      muted: '240 20% 10%',
      border: '240 20% 15%',
      chatUserBg: '220 100% 60%',
      chatAiBg: '240 20% 12%'
    },
    isDark: true
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Calming blue and teal tones',
    colors: {
      primary: '200 100% 50%',
      secondary: '180 100% 95%',
      accent: '160 100% 60%',
      background: '0 0% 100%',
      foreground: '200 20% 10%',
      muted: '180 20% 96%',
      border: '180 20% 90%',
      chatUserBg: '200 100% 50%',
      chatAiBg: '180 20% 96%'
    },
    gradient: 'linear-gradient(135deg, hsl(200 100% 50%), hsl(160 100% 60%))',
    isDark: false
  },
  {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    description: 'Warm orange and pink gradients',
    colors: {
      primary: '20 100% 60%',
      secondary: '40 100% 95%',
      accent: '340 100% 70%',
      background: '0 0% 100%',
      foreground: '20 20% 10%',
      muted: '40 20% 96%',
      border: '40 20% 90%',
      chatUserBg: '20 100% 60%',
      chatAiBg: '40 20% 96%'
    },
    gradient: 'linear-gradient(135deg, hsl(20 100% 60%), hsl(340 100% 70%))',
    isDark: false
  },
  {
    id: 'forest-night',
    name: 'Forest Night',
    description: 'Deep greens with dark ambiance',
    colors: {
      primary: '120 60% 50%',
      secondary: '120 20% 15%',
      accent: '80 80% 60%',
      background: '120 30% 8%',
      foreground: '120 10% 90%',
      muted: '120 20% 12%',
      border: '120 20% 18%',
      chatUserBg: '120 60% 50%',
      chatAiBg: '120 20% 12%'
    },
    gradient: 'linear-gradient(135deg, hsl(120 60% 50%), hsl(80 80% 60%))',
    isDark: true
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Elegant purple and gold accents',
    colors: {
      primary: '270 80% 60%',
      secondary: '280 100% 95%',
      accent: '45 100% 70%',
      background: '0 0% 100%',
      foreground: '270 20% 10%',
      muted: '280 20% 96%',
      border: '280 20% 90%',
      chatUserBg: '270 80% 60%',
      chatAiBg: '280 20% 96%'
    },
    gradient: 'linear-gradient(135deg, hsl(270 80% 60%), hsl(45 100% 70%))',
    isDark: false
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon colors with dark futuristic feel',
    colors: {
      primary: '300 100% 70%',
      secondary: '180 100% 15%',
      accent: '60 100% 70%',
      background: '240 30% 5%',
      foreground: '300 20% 90%',
      muted: '240 20% 10%',
      border: '300 30% 20%',
      chatUserBg: '300 100% 70%',
      chatAiBg: '240 20% 10%'
    },
    gradient: 'linear-gradient(135deg, hsl(300 100% 70%), hsl(60 100% 70%))',
    isDark: true
  },
  {
    id: 'minimal-gray',
    name: 'Minimal Gray',
    description: 'Clean and minimal grayscale design',
    colors: {
      primary: '0 0% 20%',
      secondary: '0 0% 95%',
      accent: '0 0% 40%',
      background: '0 0% 100%',
      foreground: '0 0% 10%',
      muted: '0 0% 96%',
      border: '0 0% 90%',
      chatUserBg: '0 0% 20%',
      chatAiBg: '0 0% 96%'
    },
    isDark: false
  }
];

export class ThemeService {
  private static readonly STORAGE_KEY = 'lumo-theme';
  private static currentTheme: Theme = themes[0];

  public static getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  public static setTheme(themeId: string): void {
    const theme = themes.find(t => t.id === themeId);
    if (!theme) return;

    this.currentTheme = theme;
    this.applyTheme(theme);
    this.saveTheme(themeId);
  }

  public static initializeTheme(): void {
    const savedThemeId = this.getSavedTheme();
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let themeId = savedThemeId;
    if (!themeId) {
      themeId = systemPrefersDark ? 'lumo-dark' : 'lumo-light';
    }

    this.setTheme(themeId);
  }

  public static toggleDarkMode(): void {
    const currentIsDark = this.currentTheme.isDark;
    const newTheme = themes.find(t => t.isDark !== currentIsDark && t.id.startsWith('lumo-'));
    if (newTheme) {
      this.setTheme(newTheme.id);
    }
  }

  public static getAllThemes(): Theme[] {
    return themes;
  }

  public static getThemesByType(isDark: boolean): Theme[] {
    return themes.filter(t => t.isDark === isDark);
  }

  private static applyTheme(theme: Theme): void {
    const root = document.documentElement;

    // Apply CSS custom properties with proper mapping
    const cssVarMap: Record<string, string> = {
      primary: '--primary',
      secondary: '--secondary',
      accent: '--accent',
      background: '--background',
      foreground: '--foreground',
      muted: '--muted',
      border: '--border',
      chatUserBg: '--chat-user-bg',
      chatAiBg: '--chat-ai-bg'
    };

    Object.entries(theme.colors).forEach(([key, value]) => {
      const cssVar = cssVarMap[key] || `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });

    // Apply additional theme-specific variables
    root.style.setProperty('--primary-foreground', theme.colors.primary.includes('100%') ? '0 0% 100%' : '0 0% 0%');
    root.style.setProperty('--secondary-foreground', theme.colors.secondary.includes('95%') ? '240 100% 20%' : '240 5% 85%');
    root.style.setProperty('--accent-foreground', '0 0% 100%');
    root.style.setProperty('--muted-foreground', theme.isDark ? '240 5% 65%' : '240 4% 46%');
    root.style.setProperty('--card', theme.colors.background);
    root.style.setProperty('--card-foreground', theme.colors.foreground);
    root.style.setProperty('--input', theme.colors.muted);
    root.style.setProperty('--ring', theme.colors.primary);
    root.style.setProperty('--chat-user-text', '0 0% 100%');
    root.style.setProperty('--chat-ai-text', theme.colors.foreground);
    root.style.setProperty('--chat-input-bg', theme.colors.background);
    root.style.setProperty('--chat-input-border', theme.colors.border);

    // Apply gradient if available
    if (theme.gradient) {
      root.style.setProperty('--theme-gradient', theme.gradient);
    } else {
      root.style.removeProperty('--theme-gradient');
    }

    // Toggle dark class
    if (theme.isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Force a repaint to ensure theme changes are applied
    root.style.display = 'none';
    root.offsetHeight; // Trigger reflow
    root.style.display = '';

    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: theme }));
  }

  private static saveTheme(themeId: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, themeId);
    }
  }

  private static getSavedTheme(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.STORAGE_KEY);
    }
    return null;
  }

  public static createCustomTheme(
    name: string,
    baseTheme: Theme,
    customColors: Partial<Theme['colors']>
  ): Theme {
    const customTheme: Theme = {
      id: `custom-${Date.now()}`,
      name,
      description: `Custom theme based on ${baseTheme.name}`,
      colors: { ...baseTheme.colors, ...customColors },
      isDark: baseTheme.isDark
    };

    return customTheme;
  }
}
