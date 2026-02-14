'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: AlertCircle,
  };

  const Icon = icons[type];

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 flex items-center gap-3 px-6 py-4 border-4 border-black shadow-[8px_8px_0_0_#000] animate-slide-in",
      type === 'success' && "bg-green-400",
      type === 'error' && "bg-red-400",
      type === 'info' && "bg-blue-400"
    )}>
      <Icon className="w-5 h-5 text-black" />
      <span className="font-bold text-black">{message}</span>
    </div>
  );
}