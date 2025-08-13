export interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ApiMessage[];
  context: {
    platform: string;
    maxResults: number;
    strictMode: boolean;
  };
  attachments?: Attachment[];
}

export interface ChatResponse {
  message: {
    content: string;
  };
  context: {
    documentsUsed?: Array<{
      filename: string;
      collection?: string;
      similarity: number;
      url?: string;
      tags?: string[];
    }>;
    searchCollections?: string[];
  };
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
  attachments?: Attachment[];
  isError?: boolean;
}

export interface Source {
  filename: string;
  collection?: string;
  similarity: number;
  url?: string;
  tags?: string[];
}

export interface ChatContext {
  documentsUsed?: Source[];
  searchCollections?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  messages: Message[];
  lastUpdated: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  data?: string | ArrayBuffer;
}
