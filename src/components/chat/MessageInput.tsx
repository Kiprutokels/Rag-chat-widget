import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Attachment } from '@/types/chat';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSend: (message: string, attachments?: Attachment[]) => void;
  disabled?: boolean;
  placeholder?: string;
  maxFileSize?: number;
  allowedFileTypes?: string[];
}

export function MessageInput({ 
  onSend, 
  disabled = false, 
  placeholder = "Ask me anything...",
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  allowedFileTypes = ['.pdf', '.doc', '.docx', '.txt', '.png', '.jpg', '.jpeg', '.gif']
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || attachments.length > 0) && !disabled) {
      onSend(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB.`);
        return;
      }

      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!allowedFileTypes.includes(fileExtension)) {
        alert(`File type ${fileExtension} is not allowed.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const attachment: Attachment = {
          id: Math.random().toString(36).substring(2),
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result ?? undefined
        };
        
        setAttachments(prev => [...prev, attachment]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type.includes('pdf') || type.includes('document')) return FileText;
    return File;
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const canSend = (message.trim() || attachments.length > 0) && !disabled;

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="w-full max-w-4xl mx-auto px-4 py-6">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="mb-4 space-y-2">
            {attachments.map((attachment) => {
              const IconComponent = getFileIcon(attachment.type);
              return (
                <div 
                  key={attachment.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconComponent className="h-5 w-5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate block">
                        {attachment.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {(attachment.size / 1024).toFixed(1)}KB
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(attachment.id)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:shadow-md transition-all duration-200">
            {/* File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={allowedFileTypes.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {/* Attach Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              title="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </Button>

            {/* Text Area */}
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="flex-1 bg-transparent border-0 outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-base leading-6 py-2"
              style={{ minHeight: '24px', maxHeight: '200px' }}
            />

            {/* Send Button */}
            <Button
              type="submit"
              disabled={!canSend}
              className={cn(
                "flex-shrink-0 p-2 rounded-xl transition-all duration-200",
                canSend
                  ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md" 
                  : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              )}
              title={canSend ? "Send message" : "Type a message to send"}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>

          {/* Helper Text */}
          {!disabled && (
            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Press Enter to send, Shift+Enter for new line
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {message.length > 0 && `${message.length} characters`}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}