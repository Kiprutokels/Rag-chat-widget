import { useState, useEffect } from 'react';
import { Settings } from '@/types/settings';

const DEFAULT_SETTINGS: Settings = {
  theme: 'auto',
  soundEnabled: true,
  saveHistory: true,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg', '.gif']
};

const STORAGE_KEY = 'rag-chat-settings';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (settings.theme === 'auto') {
        applyTheme('auto');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (theme: 'light' | 'dark' | 'auto') => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // auto
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    // Apply theme immediately
    if (newSettings.theme) {
      applyTheme(newSettings.theme);
    }
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    applyTheme(DEFAULT_SETTINGS.theme);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Apply theme on initial load
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}