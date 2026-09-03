import React, { useState, useEffect } from 'react';
import { 
  DownloadCloud, 
  Smartphone, 
  Monitor, 
  X, 
  Check, 
  Sparkles, 
  ExternalLink, 
  Share2, 
  PlusSquare, 
  ArrowRight,
  WifiOff,
  Zap,
  HardDriveDownload
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: BeforeInstallPromptEvent | null;
  onInstalledSuccess: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstalledSuccess,
}) => {
  const [isInstalling, setIsInstalling] = useState(false);
  const [activeTab, setActiveTab] = useState<'auto' | 'chrome' | 'ios' | 'edge'>('auto');
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua) && !('MSStream' in window)) {
      setDeviceType('ios');
      setActiveTab('ios');
    } else if (/android/.test(ua)) {
      setDeviceType('android');
      setActiveTab(deferredPrompt ? 'auto' : 'chrome');
    } else {
      setDeviceType('desktop');
      setActiveTab(deferredPrompt ? 'auto' : 'chrome');
    }
  }, [deferredPrompt]);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      setIsInstalling(true);
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          onInstalledSuccess();
          onClose();
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      } finally {
        setIsInstalling(false);
      }
    } else if (deviceType === 'ios') {
      setActiveTab('ios');
    }
  };

  const isStandalone = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200"
      id="install-app-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-lg rounded-3xl bg-[#101622] border border-[#242f44] shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
        id="install-app-modal-dialog"
      >
        {/* Header with App Branding */}
        <div className="relative bg-gradient-to-r from-cyan-950/80 via-[#141d2c] to-blue-950/60 p-6 border-b border-[#242f44]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1f293d] transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <img 
                src="/pwa-192x192.png" 
                alt="Tubeflow Icon" 
                className="w-16 h-16 rounded-2xl shadow-xl border border-cyan-500/30 object-cover bg-[#090d14]"
                onError={(e) => {
                  // Fallback to svg icon if png not loaded
                  (e.target as HTMLImageElement).src = '/icon.svg';
                }}
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-cyan-500 text-slate-950 font-black text-[9px] uppercase tracking-wider">
                APP
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-white font-display">
                  Install Tubeflow
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                  Free
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Download and install Tubeflow on your device for lightning-fast music streaming & downloads!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body & Benefits */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Primary Install CTA (If native prompt available) */}
          {deferredPrompt ? (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-cyan-500/10 to-blue-500/10 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 1-Click Fast Install
                </span>
                <p className="text-sm font-semibold text-white">
                  Add Tubeflow to your Home Screen or Desktop
                </p>
                <p className="text-xs text-slate-400">
                  No app store account required. Uses zero extra storage.
                </p>
              </div>

              <button
                type="button"
                onClick={handleNativeInstall}
                disabled={isInstalling}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                id="modal-direct-install-btn"
              >
                <HardDriveDownload className="w-4 h-4" />
                <span>{isInstalling ? 'Installing...' : 'Install Now'}</span>
              </button>
            </div>
          ) : isStandalone ? (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">App Already Installed!</h4>
                <p className="text-xs text-slate-300">You are running the full standalone app experience.</p>
              </div>
            </div>
          ) : null}

          {/* Key Advantages of Installing */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Why Install Tubeflow?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#141a26] border border-[#242f44] flex flex-col gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white">Instant Launch</span>
                <span className="text-[11px] text-slate-400 leading-relaxed">Opens full-screen directly from your dock or home screen without browser bars.</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141a26] border border-[#242f44] flex flex-col gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <HardDriveDownload className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white">Offline Access</span>
                <span className="text-[11px] text-slate-400 leading-relaxed">Cached UI and instant player capabilities ready even when connection drops.</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141a26] border border-[#242f44] flex flex-col gap-1.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-white">Auto Updates</span>
                <span className="text-[11px] text-slate-400 leading-relaxed">Always updated automatically with the latest fast audio conversion engines.</span>
              </div>
            </div>
          </div>

          {/* Browser / Device Instructions Tabs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Step-by-Step Instructions
              </h4>
              <span className="text-[11px] text-cyan-400">
                Works on Chrome, Safari, Edge & Firefox
              </span>
            </div>

            {/* Instruction Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0b0e14] border border-[#1e2638] mb-4">
              <button
                type="button"
                onClick={() => setActiveTab('chrome')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'chrome' 
                    ? 'bg-cyan-500 text-slate-950 shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Chrome / Android</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'ios' 
                    ? 'bg-cyan-500 text-slate-950 shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>iPhone / iPad</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('edge')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'edge' 
                    ? 'bg-cyan-500 text-slate-950 shadow-sm' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>PC / Mac / Edge</span>
              </button>
            </div>

            {/* Tab 1: Chrome / Android */}
            {activeTab === 'chrome' && (
              <div className="space-y-3 bg-[#0d121b] p-4 rounded-2xl border border-[#1e2638] text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <div>
                    <span className="font-bold text-white block">Look at the browser address bar or menu</span>
                    <span className="text-slate-400">Click the install icon (a small computer screen with down arrow) on the right side of the address bar, or tap the three dots menu (⋮).</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <div>
                    <span className="font-bold text-white block">Select "Install Tubeflow" or "Add to Home Screen"</span>
                    <span className="text-slate-400">Click the prompt confirming you want to install Tubeflow.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <div>
                    <span className="font-bold text-white block">Launch like a native application</span>
                    <span className="text-slate-400">Tubeflow will now appear on your desktop or app drawer with its own high-res icon!</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: iOS Safari */}
            {activeTab === 'ios' && (
              <div className="space-y-3 bg-[#0d121b] p-4 rounded-2xl border border-[#1e2638] text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <div>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      Tap the <Share2 className="w-3.5 h-3.5 text-cyan-400 inline" /> Share button
                    </span>
                    <span className="text-slate-400">In Apple Safari, tap the Share icon at the bottom center of your screen.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <div>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      Scroll and choose <PlusSquare className="w-3.5 h-3.5 text-cyan-400 inline" /> "Add to Home Screen"
                    </span>
                    <span className="text-slate-400">Scroll down through the share actions sheet and tap "Add to Home Screen".</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <div>
                    <span className="font-bold text-white block">Tap "Add" in top-right</span>
                    <span className="text-slate-400">Tubeflow is instantly added to your iPhone/iPad home screen with full offline caching!</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Edge / PC */}
            {activeTab === 'edge' && (
              <div className="space-y-3 bg-[#0d121b] p-4 rounded-2xl border border-[#1e2638] text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <div>
                    <span className="font-bold text-white block">Click "App Available" in URL bar</span>
                    <span className="text-slate-400">On Windows/Mac in Edge or Brave, click the (+) or install icon at the right edge of the address bar.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <div>
                    <span className="font-bold text-white block">Click "Install"</span>
                    <span className="text-slate-400">The app will open in its own clean window without any browser navigation tabs.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <div>
                    <span className="font-bold text-white block">Pin to Taskbar or Dock</span>
                    <span className="text-slate-400">Optionally check "Pin to taskbar" or "Create Desktop Shortcut" for instant access.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0c1018] border-t border-[#1e2638] flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            Progressive Web App • Standalone Mode Supported
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#182030] hover:bg-[#202c42] text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>

            {deferredPrompt && (
              <button
                type="button"
                onClick={handleNativeInstall}
                disabled={isInstalling}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <DownloadCloud className="w-3.5 h-3.5" />
                <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
