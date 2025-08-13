import React from 'react';
import { Plus, MessageSquare, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Conversation } from '@/types/chat';
import { formatDate, cn } from '@/lib/utils';

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  className?: string;
}

export function Sidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  className
}: SidebarProps) {
  return (
    <div className={cn("w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "group relative rounded-lg p-3 cursor-pointer transition-colors",
                "hover:bg-gray-100 dark:hover:bg-gray-800",
                currentConversationId === conversation.id && "bg-gray-100 dark:bg-gray-800"
              )}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {conversation.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {conversation.preview}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatDate(conversation.lastUpdated)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
