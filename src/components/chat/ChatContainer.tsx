import { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { Message } from '@/types/chat';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onCopyMessage: (content: string) => void;
  onLikeMessage: (messageId: string) => void;
}

export function ChatContainer({ 
  messages, 
  isLoading, 
  onCopyMessage, 
  onLikeMessage 
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-8">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCopy={onCopyMessage}
              onLike={onLikeMessage}
            />
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} className="h-8" />
        </div>
      </div>
    </div>
  );
}