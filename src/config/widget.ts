import { WidgetConfig } from '@/types/settings';

export const defaultWidgetConfig: WidgetConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  title: import.meta.env.VITE_WIDGET_TITLE || 'Knowledge Assistant',
  subtitle: import.meta.env.VITE_WIDGET_SUBTITLE || 'Get instant answers from our knowledge base',
  position: 'bottom-right',
  theme: {
    primary: '#3b82f6',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    border: '#e2e8f0',
  },
};

export function getWidgetConfig(): WidgetConfig {
  const container = document.getElementById('rag-chat-widget');
  const dataConfig = container?.dataset || {};
  
  return {
    ...defaultWidgetConfig,
    apiBaseUrl: dataConfig.apiUrl || defaultWidgetConfig.apiBaseUrl,
    title: dataConfig.title || defaultWidgetConfig.title,
    theme: {
      ...defaultWidgetConfig.theme,
      primary: dataConfig.primaryColor || defaultWidgetConfig.theme?.primary,
    },
  };
}