import React from 'react';
import { Brain, Settings, History, Zap } from 'lucide-react';
import { ConnectionStatus } from './ConnectionStatus';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  title?: string;
  isConnected: boolean;
  onSettingsClick: () => void;
  onHistoryClick: () => void;
}

export function Header({ 
  title = 'Knowledge Assistant', 
  isConnected, 
  onSettingsClick, 
  onHistoryClick 
}: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Brain className="h-8 w-8 text-primary-600" />
          <Zap className="h-3 w-3 text-yellow-500 absolute -top-1 -right-1" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            AI-Powered Knowledge Base
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <ConnectionStatus isConnected={isConnected} />
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onHistoryClick}
          className="hidden sm:flex"
        >
          <History className="h-4 w-4" />
          <span className="ml-2 hidden md:inline">History</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSettingsClick}
        >
          <Settings className="h-4 w-4" />
          <span className="ml-2 hidden md:inline">Settings</span>
        </Button>
      </div>
    </header>
  );
}
