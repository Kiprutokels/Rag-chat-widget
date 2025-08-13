import { User, Bot, Copy, ThumbsUp, FileText, Image as ImageIcon, File, ExternalLink } from 'lucide-react';
import { Message } from '@/types/chat';
import { formatTime, cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface MessageBubbleProps {
  message: Message;
  onCopy?: (content: string) => void;
  onLike?: (messageId: string) => void;
}

export function MessageBubble({ message, onCopy, onLike }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  const handleCopy = () => {
    onCopy?.(message.content);
    navigator.clipboard.writeText(message.content);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type.includes('pdf') || type.includes('document')) return FileText;
    return File;
  };

  const renderAttachment = (attachment: any, index: number) => {
    const IconComponent = getFileIcon(attachment.type);
    
    if (attachment.type.startsWith('image/') && attachment.data) {
      return (
        <div key={index} className="mt-2">
          <img 
            src={attachment.data} 
            alt={attachment.name}
            className="max-w-xs max-h-48 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{attachment.name}</p>
        </div>
      );
    }

    return (
      <div key={index} className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <IconComponent className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{attachment.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {(attachment.size / 1024).toFixed(1)}KB
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('flex gap-3 animate-fade-in', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm',
        isUser 
          ? 'bg-primary-600 text-white' 
          : 'bg-gray-600 dark:bg-gray-700 text-white'
      )}>
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn('flex flex-col space-y-2 max-w-[80%] sm:max-w-[75%]', isUser && 'items-end')}>
        <div className={cn(
          'rounded-2xl px-4 py-3 text-sm shadow-sm',
          isUser 
            ? 'bg-primary-600 text-white' 
            : message.isError
              ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
        )}>
          <div className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</div>
          
          {/* Attachments */}
          {message.attachments && message.attachments.map(renderAttachment)}
        </div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 text-xs">
            <div className="font-medium text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Sources:
            </div>
            {message.sources.map((source, index) => (
              <div key={index} className="text-blue-700 dark:text-blue-300 mb-1 flex items-center gap-2">
                <span className="flex-1">
                  {source.collection && `[${source.collection}] `}
                  {source.filename}
                </span>
                {source.url && (
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                <span className="text-blue-600 dark:text-blue-400 text-xs">
                  ({(source.similarity * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Message Meta */}
        <div className={cn(
          'flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400',
          isUser && 'flex-row-reverse'
        )}>
          <span>{formatTime(message.timestamp)}</span>
          
          {/* Actions */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={handleCopy}
            >
              <Copy className="h-3 w-3" />
            </Button>
            
            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => onLike?.(message.id)}
              >
                <ThumbsUp className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
