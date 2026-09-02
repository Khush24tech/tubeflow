import React, { useState, useEffect } from 'react';
import { DownloadCloud, Smartphone, X, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'menu' | 'floating';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleMobile = /iphone|ipad|ipod/.test(ua) && !('MSStream' in window);
    setIsIOS(isAppleMobile);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('[PWA] Prompt error:', err);
      } finally {
        setIsInstalling(false);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  // If already running as installed standalone app, do not show button
  if (isInstalled) {
    return null;
  }

  // Only show if browser supports install prompt or is iOS
  if (!deferredPrompt && !isIOS) {
    return null;
  }

  return (
    <>
      {variant === 'navbar' && (
        <button
          type="button"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={`px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-sm hover:border-cyan-400 ${className}`}
          title="Install Tubeflow App"
          id="pwa-install-nav-btn"
        >
          <DownloadCloud className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Install App</span>
        </button>
      )}

      {variant === 'menu' && (
        <button
          type="button"
          onClick={handleInstallClick}
          disabled={isInstalling}
          className={`w-full text-left px-4 py-3 rounded-xl font-semibold flex items-center justify-between transition-colors bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 cursor-pointer ${className}`}
          id="pwa-install-menu-btn"
        >
          <div className="flex items-center gap-3">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span>Install Tubeflow App</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500 text-slate-950 uppercase tracking-wider">
            PWA
          </span>
        </button>
      )}

      {/* iOS Safari Guided Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-[#141a26] border border-[#242f44] p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                </div>
                <h3 className="text-base font-bold text-white font-display">Install Tubeflow</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e2638] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Install Tubeflow directly to your iPhone or iPad home screen for instant access and a full-screen standalone experience:
            </p>

            <div className="space-y-2.5 text-xs bg-[#0e131d] p-3.5 rounded-xl border border-[#1e2638]">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                <span className="text-slate-200">Tap the <strong>Share</strong> button in the bottom Safari toolbar.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                <span className="text-slate-200">Scroll down and select <strong>Add to Home Screen</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                <span className="text-slate-200">Tap <strong>Add</strong> in the top-right corner to finish.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
