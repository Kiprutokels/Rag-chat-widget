export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  saveHistory: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
}

export interface WidgetConfig {
  apiBaseUrl?: string;
  theme?: Partial<Theme>;
  position?: 'bottom-right' | 'bottom-left';
  title?: string;
  subtitle?: string;
}

export interface Theme {
  primary: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}
