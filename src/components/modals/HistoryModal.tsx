import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { MessageCircle, Trash2, Download } from 'lucide-react';
import { Conversation } from '@/types/chat';
import { formatDate } from '@/lib/utils';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  onLoadConversation: (id: string) => void;
  onClearHistory: () => void;
  onExportHistory: () => void;
}

export function HistoryModal({ 
  isOpen, 
  onClose, 
  conversations, 
  onLoadConversation, 
  onClearHistory, 
  onExportHistory 
}: HistoryModalProps) {
  if (conversations.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Chat History" size="lg">
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No conversation history
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your conversations will appear here when you enable history saving.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chat History" size="lg">
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
            onClick={() => {
              onLoadConversation(conversation.id);
              onClose();
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                {conversation.title}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                {formatDate(conversation.lastUpdated)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {conversation.preview}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" onClick={onClearHistory} className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
        <Button variant="outline" onClick={onExportHistory}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </Modal>
  );
}