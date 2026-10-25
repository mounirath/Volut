import React from 'react';
import { ToastNotification } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div id="toast-container" className="fixed top-5 right-5 z-[100] flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => {
        let borderClass = 'border-sky-500/40';
        let icon = <Info className="w-4 h-4 text-sky-400 shrink-0" />;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-500/50';
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-500/50';
          icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-500/50';
          icon = <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl bg-slate-900/95 border ${borderClass} text-xs text-white shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-2`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition"
              aria-label="Fermer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
