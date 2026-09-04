import React, { useState, useEffect } from 'react';
import { DownloadCloud, Smartphone, ArrowDownToLine } from 'lucide-react';
import { InstallAppModal } from './InstallAppModal';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'menu' | 'hero' | 'floating';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'navbar',
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

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

  const handleOpenInstallModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Navbar Variant - Clear, bright and distinguished */}
      {variant === 'navbar' && (
        <button
          type="button"
          onClick={handleOpenInstallModal}
          className={`px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/35 hover:scale-102 active:scale-98 cursor-pointer ${className}`}
          title="Download & Install Tubeflow Application"
          id="nav-install-app-button"
        >
          <ArrowDownToLine className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          <span className="inline font-extrabold tracking-tight">
            {isInstalled ? 'App Installed' : 'Install App'}
          </span>
        </button>
      )}

      {/* Hero Variant - Large, prominent banner or action button */}
      {variant === 'hero' && (
        <button
          type="button"
          onClick={handleOpenInstallModal}
          className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#141b27] hover:bg-[#1a2333] border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-950/40 hover:shadow-cyan-500/20 transition-all hover:scale-102 cursor-pointer group ${className}`}
          id="hero-install-app-button"
        >
          <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
            <DownloadCloud className="w-3.5 h-3.5" />
          </div>
          <span>Install Tubeflow App</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
            Fast & Free
          </span>
        </button>
      )}

      {/* Mobile Drawer Menu Variant */}
      {variant === 'menu' && (
        <button
          type="button"
          onClick={handleOpenInstallModal}
          className={`w-full text-left px-4 py-3.5 rounded-xl font-bold flex items-center justify-between transition-all bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 cursor-pointer shadow-sm hover:border-cyan-400 ${className}`}
          id="menu-install-app-button"
        >
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <div className="flex flex-col">
              <span className="text-sm text-white">Download & Install App</span>
              <span className="text-[11px] text-slate-400 font-normal">Add to Home Screen or Desktop</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500 text-slate-950 uppercase tracking-wider">
            Install
          </span>
        </button>
      )}

      {/* Complete Step-by-Step Installation Modal */}
      <InstallAppModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        deferredPrompt={deferredPrompt}
        onInstalledSuccess={() => {
          setIsInstalled(true);
        }}
      />
    </>
  );
};

