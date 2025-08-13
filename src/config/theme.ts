export interface ThemeConfig {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  border: string;
  borderRadius: string;
}

export const lightTheme: ThemeConfig = {
  primary: '#3b82f6',
  secondary: '#64748b',
  background: '#ffffff',
  surface: '#f8fafc',
  text: '#1e293b',
  border: '#e2e8f0',
  borderRadius: '8px',
};

export const darkTheme: ThemeConfig = {
  primary: '#3b82f6',
  secondary: '#cbd5e1',
  background: '#0f172a',
  surface: '#1e293b',
  text: '#f1f5f9',
  border: '#334155',
  borderRadius: '8px',
};