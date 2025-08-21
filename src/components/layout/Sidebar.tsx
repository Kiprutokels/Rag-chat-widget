import { 
  MessageSquare, 
  Plus, 
  Settings, 
  Trash2, 
  Download,
  Clock,
  X,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Conversation } from '@/types/chat';
import { formatDate, cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onLoadConversation: (id: string) => void;
  onNewChat: () => void;
  onClearHistory: () => void;
  onExportHistory: () => void;
  onOpenSettings: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  conversations,
  onLoadConversation,
  onNewChat,
  onClearHistory,
  onExportHistory,
  onOpenSettings,
  isCollapsed = false,
  onToggleCollapse
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed top-0 left-0 h-full bg-gray-900 dark:bg-gray-900 transform transition-all duration-300 ease-in-out z-50",
        "md:relative md:translate-x-0 md:z-auto",
        // Mobile states
        isOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop states
        isCollapsed ? "md:w-16" : "md:w-80",
        // Mobile width
        "w-80"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!isCollapsed && (
            <h2 className="text-white font-semibold">Chat History</h2>
          )}
          
          <div className="flex items-center gap-2">
            {/* Collapse toggle for desktop */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="hidden md:flex text-gray-400 hover:text-white p-1"
            >
              <ChevronLeft className={cn(
                "h-5 w-5 transition-transform",
                isCollapsed && "rotate-180"
              )} />
            </Button>
            
            {/* Close button for mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white md:hidden p-1"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <Button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className={cn(
              "w-full bg-transparent border border-gray-600 text-white hover:bg-gray-800 transition-all",
              isCollapsed ? "px-2" : "justify-start gap-3"
            )}
            title={isCollapsed ? "New chat" : undefined}
          >
            <Plus className="h-4 w-4" />
            {!isCollapsed && "New chat"}
          </Button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto px-3">
          {conversations.length === 0 ? (
            <div className={cn(
              "text-center py-8 text-gray-400",
              isCollapsed && "px-2"
            )}>
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              {!isCollapsed && <p className="text-sm">No conversations yet</p>}
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "group flex items-center gap-2 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors",
                    isCollapsed && "justify-center px-2"
                  )}
                  onClick={() => {
                    onLoadConversation(conversation.id);
                    onClose();
                  }}
                  title={isCollapsed ? conversation.title : undefined}
                >
                  <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium truncate">
                        {conversation.title}
                      </h4>
                      <p className="text-gray-400 text-xs truncate">
                        {formatDate(conversation.lastUpdated)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-700 p-3 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearHistory}
            className={cn(
              "w-full text-gray-300 hover:text-white hover:bg-gray-800 transition-colors",
              isCollapsed ? "px-2" : "justify-start gap-3"
            )}
            title={isCollapsed ? "Clear conversations" : undefined}
          >
            <Trash2 className="h-4 w-4" />
            {!isCollapsed && "Clear conversations"}
          </Button>
          
          {/* <Button
            variant="ghost"
            size="sm"
            onClick={onExportHistory}
            className={cn(
              "w-full text-gray-300 hover:text-white hover:bg-gray-800 transition-colors",
              isCollapsed ? "px-2" : "justify-start gap-3"
            )}
            title={isCollapsed ? "Export data" : undefined}
          >
            <Download className="h-4 w-4" />
            {!isCollapsed && "Export data"}
          </Button> */}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenSettings}
            className={cn(
              "w-full text-gray-300 hover:text-white hover:bg-gray-800 transition-colors",
              isCollapsed ? "px-2" : "justify-start gap-3"
            )}
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && "Settings"}
          </Button>
        </div>
      </div>
    </>
  );
}