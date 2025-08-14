import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { Message, ChatContext, Attachment } from '@/types/chat';
import { generateId } from '@/lib/utils';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string, attachments?: Attachment[]) => {
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
      attachments: attachments || [],
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const apiMessages = messages.concat(userMessage).map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const requestBody: any = {
        messages: apiMessages,
        context: {
          platform: 'web',
          maxResults: 5,
          strictMode: true,
        },
      };

      if (attachments && attachments.length > 0) {
        requestBody.attachments = attachments;
      }

      const response = await apiClient.post<{
        message: { content: string };
        context: ChatContext;
      }>('/chat/web', requestBody);

      const botMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: response.message.content,
        timestamp: new Date(),
        sources: response.context.documentsUsed,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    setMessages, // Add this for loading conversations
  };
}
