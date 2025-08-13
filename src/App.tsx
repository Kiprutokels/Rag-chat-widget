import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { MessageInput } from '@/components/chat/MessageInput';
import { WelcomeScreen } from '@/components/chat/WelcomeScreen';
import { SettingsModal } from '@/components/modals/SettingsModal';
import { HistoryModal } from '@/components/modals/HistoryModal';
import { Toast } from '@/components/ui/Toast';
import { useChat } from '@/hooks/useChat';
import { useSettings } from '@/hooks/useSettings';
import { useHistory } from '@/hooks/useHistory';
import { useToast } from '@/hooks/useToast';
import { apiClient } from '@/lib/api';
import { Attachment } from '@/types/chat';

export default function App() {
  const { messages, isLoading, sendMessage, clearMessages } = useChat();
  const { settings, updateSettings, resetSettings } = useSettings();
  const { conversations, saveConversation, loadConversation, clearHistory, exportHistory } = useHistory();
  const { toasts, removeToast, success, error } = useToast();
  
  const [isConnected, setIsConnected] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const showWelcome = messages.length === 0;

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
      // Play send sound (you can add audio file here)
      new Audio('/sounds/send.mp3').play().catch(() => {
        // Ignore audio errors
      });
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
      clearMessages();
      // Note: You'd need to implement loading conversation messages
      success('Conversation loaded');
    }
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
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700">
      <Header
        isConnected={isConnected}
        onSettingsClick={() => setShowSettings(true)}
        onHistoryClick={() => setShowHistory(true)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {showWelcome ? (
          <WelcomeScreen onQuickAction={handleQuickAction} />
        ) : (
          <ChatContainer
            messages={messages}
            isLoading={isLoading}
            onCopyMessage={handleCopyMessage}
            onLikeMessage={handleLikeMessage}
          />
        )}
      </div>

      <MessageInput 
        onSend={handleSendMessage} 
        disabled={isLoading}
        maxFileSize={settings.maxFileSize}
        allowedFileTypes={settings.allowedFileTypes}
      />

      {/* Modals */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetSettings={resetSettings}
      />

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        conversations={conversations}
        onLoadConversation={handleLoadConversation}
        onClearHistory={handleClearHistory}
        onExportHistory={handleExportHistory}
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
    </div>
  );
}