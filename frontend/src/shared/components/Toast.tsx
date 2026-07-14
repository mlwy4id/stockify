'use client';
import { useToastStore } from '@/shared/store/toast';
import { CheckCircle, AlertCircle, InfoIcon, AlertTriangle } from 'lucide-react';

export function Toast() {
  const { toasts } = useToastStore();

  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 dark:bg-green-950',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-800 dark:text-green-200',
          icon: CheckCircle,
        };
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-950',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-200',
          icon: AlertCircle,
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-950',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-200',
          icon: AlertTriangle,
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-950',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-200',
          icon: InfoIcon,
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md pointer-events-auto">
      {toasts.map((toast) => {
        const styles = getStyles(toast.type);
        const IconComponent = styles.icon;

        return (
          <div
            key={toast.id}
            className={`flex items-end gap-3 p-4 rounded-lg border ${styles.bg} ${styles.border} ${styles.text} shadow-lg animate-in fade-in slide-in-from-top-2 duration-300`}
            role="alert"
          >
            <IconComponent className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
