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
  placeholder = "Ask me anything about company policies, procedures, or documents...",
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
      // Check file size
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB.`);
        return;
      }

      // Check file type
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

    // Clear input
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const isOverLimit = message.length > 2000;

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 space-y-2">
          {attachments.map((attachment) => {
            const IconComponent = getFileIcon(attachment.type);
            return (
              <div key={attachment.id} className="attachment-preview flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <IconComponent className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {attachment.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    {(attachment.size / 1024).toFixed(1)}KB
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(attachment.id)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className={cn(
                "w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600",
                "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                "px-4 py-3 pr-12 placeholder-gray-500 dark:placeholder-gray-400",
                "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isOverLimit && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
            />
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={allowedFileTypes.join(',')}
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="absolute right-2 top-2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            type="submit"
            disabled={disabled || (!message.trim() && attachments.length === 0) || isOverLimit}
            className={cn(
              "h-12 w-12 p-0 bg-primary-600 hover:bg-primary-700",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Powered by AI • Searching Company Knowledge Base</span>
          <span className={cn(isOverLimit && "text-red-500 dark:text-red-400")}>
            {message.length} / 2000
          </span>
        </div>
      </form>
    </div>
  );
}