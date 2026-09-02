import React from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';
import { applyServiceWorkerUpdate } from '../utils/registerSW';

interface PWAUpdateToastProps {
  registration: ServiceWorkerRegistration | null;
  onDismiss: () => void;
}

export const PWAUpdateToast: React.FC<PWAUpdateToastProps> = ({
  registration,
  onDismiss,
}) => {
  if (!registration) return null;

  const handleUpdate = () => {
    applyServiceWorkerUpdate(registration);
  };

  return (
    <div 
      className="fixed bottom-24 right-4 sm:right-6 z-50 max-w-sm rounded-2xl bg-[#141a26]/95 backdrop-blur-md border border-cyan-500/40 p-4 shadow-2xl text-slate-100 animate-in slide-in-from-bottom-5 duration-300"
      id="pwa-update-toast"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
          <Sparkles className="w-5 h-5 animate-spin-slow" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white font-display">New version available</h4>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
            An updated version of Tubeflow is ready. Refresh now to apply the latest improvements.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleUpdate}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Update Now</span>
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="px-2.5 py-1.5 rounded-lg bg-[#1c2436] hover:bg-[#27344e] text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
            >
              Later
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
