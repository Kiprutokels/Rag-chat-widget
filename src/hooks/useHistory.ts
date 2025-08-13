import { useState, useCallback } from 'react';
import { Conversation, Message } from '@/types/chat';
import { Storage } from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { truncateText, generateId } from '@/lib/utils';

export function useHistory() {
  const [conversations, setConversations] = useState<Map<string, Conversation>>(
    () => new Map(Storage.get(STORAGE_KEYS.CONVERSATIONS, []))
  );

  const saveConversation = useCallback((messages: Message[]) => {
    if (messages.length === 0) return;

    const firstUserMessage = messages.find(m => m.role === 'user');
    const firstBotMessage = messages.find(m => m.role === 'assistant');
    
    const title = firstUserMessage 
      ? truncateText(firstUserMessage.content, 50)
      : 'New Conversation';
    
    const preview = firstBotMessage 
      ? truncateText(firstBotMessage.content, 100)
      : 'No preview available';

    const conversationId = generateId();
    const conversation: Conversation = {
      id: conversationId,
      title,
      preview,
      messages: [...messages],
      lastUpdated: new Date().toISOString(),
    };

    setConversations(prev => {
      const updated = new Map(prev);
      updated.set(conversationId, conversation);
      
      // Keep only last 50 conversations
      if (updated.size > 50) {
        const sorted = Array.from(updated.values())
          .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        
        const toKeep = sorted.slice(0, 50);
        updated.clear();
        toKeep.forEach(conv => updated.set(conv.id, conv));
      }
      
      Storage.set(STORAGE_KEYS.CONVERSATIONS, Array.from(updated.entries()));
      return updated;
    });

    return conversationId;
  }, []);

  const loadConversation = useCallback((id: string): Conversation | null => {
    return conversations.get(id) || null;
  }, [conversations]);

  const clearHistory = useCallback(() => {
    setConversations(new Map());
    Storage.remove(STORAGE_KEYS.CONVERSATIONS);
  }, []);

  const exportHistory = useCallback(() => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const filename = `chat-history-${timestamp}.json`;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      conversations: Array.from(conversations.values()),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename;
    link.click();
  }, [conversations]);

  return {
    conversations: Array.from(conversations.values()),
    saveConversation,
    loadConversation,
    clearHistory,
    exportHistory,
  };
}