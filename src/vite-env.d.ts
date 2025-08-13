/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_WIDGET_TITLE: string
  readonly VITE_WIDGET_SUBTITLE: string
  readonly VITE_MAX_MESSAGE_LENGTH: string
  readonly VITE_TYPING_DELAY: string
  readonly VITE_ENABLE_HISTORY: string
  readonly VITE_ENABLE_SOUND: string
  readonly VITE_ENABLE_EXPORT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
