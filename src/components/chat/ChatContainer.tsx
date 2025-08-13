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
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onCopy={onCopyMessage}
          onLike={onLikeMessage}
        />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}