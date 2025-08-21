import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChatContainer } from '../chat/ChatContainer';
import { MessageInput } from '../chat/MessageInput';
import { WelcomeScreen } from '../chat/WelcomeScreen';
import { SettingsModal } from '../modals/SettingsModal';

interface LayoutProps {
  children?: React.ReactNode;
  messages: any[];
  isLoading: boolean;
  onSendMessage: (message: string, attachments?: any[]) => void;
  onQuickAction: (query: string) => void;
  onCopyMessage: (content: string) => void;
  onLikeMessage: (messageId: string) => void;
  conversations: any[];
  onLoadConversation: (id: string) => void;
  onClearHistory: () => void;
  onExportHistory: () => void;
  onNewChat: () => void;
  settings: any;
  updateSettings: (settings: any) => void;
  resetSettings: () => void;
  isConnected: boolean;
}

export function Layout({
  messages,
  isLoading,
  onSendMessage,
  onQuickAction,
  onCopyMessage,
  onLikeMessage,
  conversations,
  onLoadConversation,
  onClearHistory,
  onExportHistory,
  onNewChat,
  settings,
  updateSettings,
  resetSettings,
  isConnected
}: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const showWelcome = messages.length === 0;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        onLoadConversation={onLoadConversation}
        onNewChat={onNewChat}
        onClearHistory={onClearHistory}
        onExportHistory={onExportHistory}
        onOpenSettings={() => setShowSettings(true)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isConnected={isConnected}
          title="Knowledge Assistant"
        />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 min-h-0">
          {showWelcome ? (
            <WelcomeScreen onQuickAction={onQuickAction} />
          ) : (
            <ChatContainer
              messages={messages}
              isLoading={isLoading}
              onCopyMessage={onCopyMessage}
              onLikeMessage={onLikeMessage}
            />
          )}

          {/* Message Input*/}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <MessageInput
              onSend={onSendMessage}
              disabled={isLoading}
              maxFileSize={settings.maxFileSize}
              allowedFileTypes={settings.allowedFileTypes}
            />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetSettings={resetSettings}
      />
    </div>
  );
}