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