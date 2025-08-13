import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1 rounded-full text-sm",
      isConnected 
        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200" 
        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"
    )}>
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span>Disconnected</span>
        </>
      )}
    </div>
  );
}