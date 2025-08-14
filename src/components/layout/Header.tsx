import { Menu, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onToggleSidebar: () => void;
  isConnected: boolean;
  title?: string;
}

export function Header({ onToggleSidebar, isConnected, title = "Knowledge Assistant" }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="p-2 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-full text-sm",
          isConnected 
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200" 
            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200"
        )}>
          {isConnected ? (
            <>
              <Wifi className="h-3 w-3" />
              <span className="hidden sm:inline">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              <span className="hidden sm:inline">Offline</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
