import { useState, useCallback } from 'react';
import { Conversation, Message } from '@/types/chat';
import { Storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { truncateText, generateId } from '@/lib/utils';

export function useHistory() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const stored = Storage.get(STORAGE_KEYS.CONVERSATIONS, []);
    return Array.isArray(stored) ? stored : [];
  });

  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const saveConversation = useCallback((messages: Message[]) => {
    if (messages.length === 0) return;

    const firstUserMessage = messages.find(m => m.role === 'user');
    const title = firstUserMessage 
      ? truncateText(firstUserMessage.content, 50)
      : 'New Conversation';
    
    const preview = firstUserMessage 
      ? truncateText(firstUserMessage.content, 100)
      : 'No preview available';

    setConversations(prev => {
      let updated = [...prev];
      
      if (currentConversationId) {
        // Update existing conversation
        const index = updated.findIndex(c => c.id === currentConversationId);
        if (index !== -1) {
          updated[index] = {
            ...updated[index],
            title,
            preview,
            messages: messages.map(msg => ({
              ...msg,
              timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp || Date.now())
            })),
            lastUpdated: new Date().toISOString(),
          };
        }
      } else {
        // Create new conversation
        const newConversation: Conversation = {
          id: generateId(),
          title,
          preview,
          messages: messages.map(msg => ({
            ...msg,
            timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp || Date.now())
          })),
          lastUpdated: new Date().toISOString(),
        };
        updated.unshift(newConversation);
        setCurrentConversationId(newConversation.id);
      }
      
      // Keep only last 50 conversations
      if (updated.length > 50) {
        updated = updated.slice(0, 50);
      }
      
      Storage.set(STORAGE_KEYS.CONVERSATIONS, updated);
      return updated;
    });
  }, [currentConversationId]);

  const loadConversation = useCallback((id: string): Conversation | null => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setCurrentConversationId(id);
      // Ensure timestamps are Date objects
      const conversationWithDates = {
        ...conversation,
        messages: conversation.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp || Date.now())
        }))
      };
      return conversationWithDates;
    }
    return null;
  }, [conversations]);

  const newConversation = useCallback(() => {
    setCurrentConversationId(null);
  }, []);

  const clearHistory = useCallback(() => {
    setConversations([]);
    setCurrentConversationId(null);
    Storage.remove(STORAGE_KEYS.CONVERSATIONS);
  }, []);

  const exportHistory = useCallback(() => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const filename = `chat-history-${timestamp}.json`;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      conversations,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename;
    link.click();
  }, [conversations]);

  return {
    conversations,
    currentConversationId,
    saveConversation,
    loadConversation,
    newConversation,
    clearHistory,
    exportHistory,
  };
}