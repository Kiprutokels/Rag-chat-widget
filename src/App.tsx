import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Toast } from '@/components/ui/Toast';
import { useChat } from '@/hooks/useChat';
import { useSettings } from '@/hooks/useSettings';
import { useHistory } from '@/hooks/useHistory';
import { useToast } from '@/hooks/useToast';
import { apiClient } from '@/lib/api';
import { Attachment } from '@/types/chat';

export default function App() {
  const { messages, isLoading, sendMessage, clearMessages, setMessages } = useChat();
  const { settings, updateSettings, resetSettings } = useSettings();
  const { 
    conversations, 
    saveConversation, 
    loadConversation, 
    newConversation,
    clearHistory, 
    exportHistory 
  } = useHistory();
  const { toasts, removeToast, success, error } = useToast();
  
  const [isConnected, setIsConnected] = useState(true);

  // Check connection periodically
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await apiClient.get('/health');
        setIsConnected(true);
      } catch {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  // Save conversation when messages change
  useEffect(() => {
    if (messages.length > 0 && settings.saveHistory) {
      saveConversation(messages);
    }
  }, [messages, settings.saveHistory, saveConversation]);

  const handleQuickAction = (query: string) => {
    sendMessage(query);
  };

  const handleSendMessage = (message: string, attachments?: Attachment[]) => {
    if (settings.soundEnabled) {
      new Audio('/sounds/send.mp3').play().catch(() => {});
    }
    sendMessage(message, attachments);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    success('Copied to clipboard');
  };

  const handleLikeMessage = (messageId: string) => {
    success('Thank you for your feedback!');
  };

  const handleLoadConversation = (id: string) => {
    const conversation = loadConversation(id);
    if (conversation) {
      setMessages(conversation.messages);
      success('Conversation loaded');
    }
  };

  const handleNewChat = () => {
    newConversation();
    clearMessages();
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all conversation history?')) {
      clearHistory();
      success('History cleared');
    }
  };

  const handleExportHistory = () => {
    try {
      exportHistory();
      success('History exported successfully');
    } catch {
      error('Failed to export history');
    }
  };

  return (
    <>
      <Layout
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onQuickAction={handleQuickAction}
        onCopyMessage={handleCopyMessage}
        onLikeMessage={handleLikeMessage}
        conversations={conversations}
        onLoadConversation={handleLoadConversation}
        onClearHistory={handleClearHistory}
        onExportHistory={handleExportHistory}
        onNewChat={handleNewChat}
        settings={settings}
        updateSettings={updateSettings}
        resetSettings={resetSettings}
        isConnected={isConnected}
      />

      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={removeToast}
          />
        ))}
      </div>
    </>
  );
}
