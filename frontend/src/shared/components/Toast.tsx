'use client';
import { useToastStore } from '@/shared/store/toast';
import { CheckCircle, AlertCircle, InfoIcon, AlertTriangle } from 'lucide-react';

export function Toast() {
  const { toasts } = useToastStore();

  const getStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-success/10',
          border: 'border-success/30',
          text: 'text-success',
          icon: CheckCircle,
        };
      case 'error':
        return {
          bg: 'bg-danger/10',
          border: 'border-danger/30',
          text: 'text-danger',
          icon: AlertCircle,
        };
      case 'warning':
        return {
          bg: 'bg-stamp/10',
          border: 'border-stamp/30',
          text: 'text-stamp',
          icon: AlertTriangle,
        };
      default:
        return {
          bg: 'bg-neutral-action/10',
          border: 'border-neutral-action/30',
          text: 'text-neutral-action',
          icon: InfoIcon,
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-100 space-y-2 max-w-md pointer-events-auto">
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
