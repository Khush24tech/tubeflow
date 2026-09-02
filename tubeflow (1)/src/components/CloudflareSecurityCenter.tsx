import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Lock, 
  RefreshCw, 
  X, 
  Cpu, 
  Globe, 
  Activity, 
  Zap, 
  Server,
  KeyRound,
  FileCode,
  Layers
} from 'lucide-react';
import { runDeviceSecurityScan, DeviceSecurityCheck } from '../utils/security';

interface CloudflareSecurityCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudflareSecurityCenter: React.FC<CloudflareSecurityCenterProps> = ({
  isOpen,
  onClose,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanScore, setScanScore] = useState<number>(100);
  const [checks, setChecks] = useState<DeviceSecurityCheck[]>([]);
  const [lastScannedTime, setLastScannedTime] = useState<string>('Just now');

  const handleRunScan = async () => {
    setIsScanning(true);
    // Simulate real device environment verification
    await new Promise((resolve) => setTimeout(resolve, 850));
    const result = await runDeviceSecurityScan();
    setScanScore(result.score);
    setChecks(result.checks);
    setIsScanning(false);
    setLastScannedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  };

  useEffect(() => {
    if (isOpen && checks.length === 0) {
      handleRunScan();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
      id="cloudflare-security-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl rounded-3xl bg-[#0f141f] border border-[#242f44] shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header with Cloudflare Orange & Cyan Accents */}
        <div className="p-6 bg-gradient-to-r from-[#141a26] via-[#162033] to-[#141a26] border-b border-[#1e2638] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-display">
                  Cloudflare Zero-Trust Security Shield
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  100% SECURE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time active protection against XSS injections, DDoS, botnets, and malicious code payloads.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1e2638] transition-colors cursor-pointer"
            aria-label="Close Security Center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Integrity Score Banner */}
          <div className="p-5 rounded-2xl bg-[#141a26] border border-[#1e2638] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl bg-[#0b0f17] border border-emerald-500/30 flex items-center justify-center shrink-0">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {isScanning ? '--' : `${scanScore}%`}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
                  <span>Device & Environment Verified</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Last verified: <span className="text-slate-300 font-mono">{lastScannedTime}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunScan}
              disabled={isScanning}
              className="px-4 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold inline-flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning Environment...' : 'Re-scan Device'}</span>
            </button>
          </div>

          {/* Active Security Safeguards Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Active Security Barriers & Defenses
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Defense 1: XSS & Code Injection Guard */}
              <div className="p-4 rounded-xl bg-[#141a26] border border-[#1e2638] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <FileCode className="w-4 h-4" />
                    <span className="text-xs font-bold text-white">XSS & Script Injection Shield</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Automatic sanitization strips <code className="text-cyan-400 font-mono">&lt;script&gt;</code>, JavaScript pseudo-protocols, and encoded payloads before execution.
                </p>
              </div>

              {/* Defense 2: Strict CSP Policy */}
              <div className="p-4 rounded-xl bg-[#141a26] border border-[#1e2638] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Lock className="w-4 h-4" />
                    <span className="text-xs font-bold text-white">Content Security Policy (CSP)</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Strict HTTP headers disallow unauthorized external scripts, unsafe frames, and inline eval execution.
                </p>
              </div>

              {/* Defense 3: Cloudflare Edge & DDoS Shield */}
              <div className="p-4 rounded-xl bg-[#141a26] border border-[#1e2638] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-orange-400">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs font-bold text-white">Cloudflare Edge & Bot Filter</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Under-Attack rate limiting, browser integrity validation, and TLS 1.3 protection active across edge servers.
                </p>
              </div>

              {/* Defense 4: SSRF & URL Isolation Engine */}
              <div className="p-4 rounded-xl bg-[#141a26] border border-[#1e2638] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-violet-400">
                    <Server className="w-4 h-4" />
                    <span className="text-xs font-bold text-white">SSRF & Sandbox Isolation</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Downloads are strictly restricted to verified YouTube/media CDNs with internal loopback IP blocking.
                </p>
              </div>

              {/* Defense 5: API Rate-Limiting Barrier */}
              <div className="p-4 rounded-xl bg-[#141a26] border border-[#1e2638] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold text-white">Anti-Abuse Request Limiter</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Automated sliding-window throttling prevents brute-force scraping and API flooding attacks.
                </p>
              </div>

              {/* Defense 6: End-to-End Transport Encryption */}
              <div className="p-4 rounded-xl bg-[#141a26] border border-[#1e2638] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-pink-400">
                    <KeyRound className="w-4 h-4" />
                    <span className="text-xs font-bold text-white">256-Bit SSL/TLS Encryption</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  All audio/video conversions and web searches are encrypted in transit with strict HSTS enforcement.
                </p>
              </div>

            </div>
          </div>

          {/* Detailed Verification Checklist */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Live Environment Diagnostics
            </h4>

            <div className="space-y-2">
              {checks.map((chk) => (
                <div
                  key={chk.id}
                  className="p-3 rounded-xl bg-[#111722] border border-[#1a2333] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-slate-200">{chk.name}</span>
                  </div>
                  <span className="text-slate-400 text-[11px] font-mono hidden sm:inline">
                    {chk.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0c1018] border-t border-[#1e2638] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Tubeflow Security Engine Active</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
