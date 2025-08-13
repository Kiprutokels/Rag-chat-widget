export const STORAGE_KEYS = {
  SETTINGS: 'rag-chat-settings',
  CONVERSATIONS: 'rag-chat-conversations',
  CURRENT_CONVERSATION: 'rag-chat-current',
} as const;

export const API_ENDPOINTS = {
  CHAT: '/chat/web',
  HEALTH: '/health',
} as const;

export const DEFAULT_CONFIG = {
  MAX_MESSAGE_LENGTH: 2000,
  MAX_MESSAGES_HISTORY: 20,
  TYPING_DELAY: 500,
  TOAST_DURATION: 5000,
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
} as const;