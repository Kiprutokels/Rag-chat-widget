import { useState, useCallback } from 'react';
import { generateId } from '@/lib/utils';
import { ToastType } from '@/components/ui/Toast';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((
    type: ToastType, 
    title: string, 
    message?: string, 
    duration?: number
  ) => {
    const id = generateId();
    const toast: ToastItem = { id, type, title, message, duration };
    
    setToasts(prev => [...prev, toast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string) => 
    addToast('success', title, message), [addToast]);
  
  const error = useCallback((title: string, message?: string) => 
    addToast('error', title, message), [addToast]);
  
  const warning = useCallback((title: string, message?: string) => 
    addToast('warning', title, message), [addToast]);
  
  const info = useCallback((title: string, message?: string) => 
    addToast('info', title, message), [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}