import { Bot } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-600 dark:bg-gray-700 shadow-sm">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <div 
            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <div 
            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div 
            className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}