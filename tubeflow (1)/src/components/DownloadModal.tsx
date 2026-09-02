import React, { useState, useEffect, useRef } from 'react';
import { X, Download, Music, Video, Sparkles, Check, Copy, HardDrive, ShieldCheck, Loader2, ArrowDownCircle, Play, Pause, Zap, ExternalLink } from 'lucide-react';
import { Track, TrackFormats, FormatOption } from '../types';
import { formatViews } from '../utils/audioSynthesizer';

interface DownloadModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  onStartDownload: (track: Track, format: 'mp3' | 'm4a' | 'flac' | 'mp4', quality: string, size: string) => void;
  onPlayPreview: (track: Track) => void;
  isPlaying: boolean;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  track,
  isOpen,
  onClose,
  onStartDownload,
  onPlayPreview,
  isPlaying,
}) => {
  const [activeTab, setActiveTab] = useState<'audio' | 'video'>('audio');
  const [selectedFormat, setSelectedFormat] = useState<FormatOption | null>(null);
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertStep, setConvertStep] = useState('');
  const [cachedDirectUrl, setCachedDirectUrl] = useState<string | null>(null);
  const prewarmController = useRef<AbortController | null>(null);

  const audioFormats: FormatOption[] = [
    { format: 'mp3', quality: '320 kbps (High Fidelity)', size: '8.4 MB', ext: 'mp3', mime: 'audio/mpeg' },
    { format: 'mp3', quality: '256 kbps (Standard HQ)', size: '6.8 MB', ext: 'mp3', mime: 'audio/mpeg' },
    { format: 'mp3', quality: '192 kbps (Medium)', size: '5.1 MB', ext: 'mp3', mime: 'audio/mpeg' },
    { format: 'm4a', quality: '256 kbps (AAC Apple Audio)', size: '6.2 MB', ext: 'm4a', mime: 'audio/mp4' },
    { format: 'flac', quality: 'Lossless Audio (Studio Master)', size: '24.5 MB', ext: 'flac', mime: 'audio/flac' },
  ];

  const videoFormats: FormatOption[] = [
    { format: 'mp4', quality: '1080p Full HD (60fps)', size: '54.2 MB', ext: 'mp4', mime: 'video/mp4' },
    { format: 'mp4', quality: '720p HD', size: '28.6 MB', ext: 'mp4', mime: 'video/mp4' },
    { format: 'mp4', quality: '480p SD', size: '14.1 MB', ext: 'mp4', mime: 'video/mp4' },
    { format: 'mp4', quality: '360p Mobile Compact', size: '9.3 MB', ext: 'mp4', mime: 'video/mp4' },
  ];

  // Pre-warm conversion job in the background as soon as modal opens
  useEffect(() => {
    if (isOpen && track) {
      setSelectedFormat(activeTab === 'audio' ? audioFormats[0] : videoFormats[0]);
      setConverting(false);
      setProgress(0);
      setCachedDirectUrl(null);

      // Pre-warm default format so it's ready before user even clicks
      const targetFormat = activeTab === 'audio' ? 'mp3' : 'mp4';
      const targetQuality = activeTab === 'audio' ? '320' : '720';
      
      const controller = new AbortController();
      prewarmController.current = controller;

      fetch(`/api/download/prepare?id=${track.videoId}&format=${targetFormat}&quality=${targetQuality}`, {
        signal: controller.signal,
      })
        .then((r) => r.json())
        .then((data) => {
          if (data?.ready && data?.downloadUrl) {
            setCachedDirectUrl(data.downloadUrl);
          }
        })
        .catch(() => {});
    }

    return () => {
      if (prewarmController.current) {
        prewarmController.current.abort();
      }
    };
  }, [isOpen, track, activeTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !track) return null;

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDownloadClick = async () => {
    if (!selectedFormat) return;

    setErrorMsg(null);
    setConverting(true);
    setProgress(20);
    setConvertStep('Connecting to high-speed stream...');

    try {
      const cleanTitle = (typeof track.title === 'string' ? track.title : String(track.title || 'Tubeflow_Track')).replace(/[/\\?%*:|"<>]/g, '').trim() || 'Tubeflow_Track';
      const targetUrl = track.url || `https://www.youtube.com/watch?v=${track.videoId}`;
      
      onStartDownload(track, selectedFormat.format, selectedFormat.quality, selectedFormat.size);

      let directDownloadUrl: string | null = cachedDirectUrl;

      if (!directDownloadUrl) {
        const prepareParams = new URLSearchParams({
          url: targetUrl,
          id: track.videoId,
          format: selectedFormat.format,
          quality: selectedFormat.quality,
        });

        const prepRes = await fetch(`/api/download/prepare?${prepareParams.toString()}`);
        if (prepRes.ok) {
          const prepData = await prepRes.json();
          if (prepData.ready && prepData.downloadUrl) {
            directDownloadUrl = prepData.downloadUrl;
            setProgress(90);
          } else if (prepData.jobId) {
            setProgress(35);
            setConvertStep(`Converting ${selectedFormat.quality}...`);

            // Rapid 350ms polling loop for instant reaction
            for (let i = 0; i < 35; i++) {
              await new Promise((r) => setTimeout(r, 350));
              const progParams = new URLSearchParams({
                id: prepData.jobId,
                progressUrl: prepData.progressUrl || '',
                cacheKey: prepData.cacheKey || '',
              });
              const pRes = await fetch(`/api/download/progress?${progParams.toString()}`);
              if (pRes.ok) {
                const pData = await pRes.json();
                if (pData.progress) {
                  setProgress(Math.max(35, Math.min(95, pData.progress)));
                  if (pData.text) setConvertStep(pData.text);
                }
                if (pData.ready && pData.downloadUrl) {
                  directDownloadUrl = pData.downloadUrl;
                  setCachedDirectUrl(pData.downloadUrl);
                  break;
                }
              }
            }
          }
        }
      }

      setProgress(95);
      setConvertStep('Saving file to your device...');

      if (directDownloadUrl) {
        // Direct stream download bypasses browser CORS limitations
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = directDownloadUrl;
        link.download = `${cleanTitle}.${selectedFormat.ext}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        link.remove();

        setProgress(100);
        setConvertStep('Download started!');
        setTimeout(() => {
          setConverting(false);
          onClose();
        }, 800);
        return;
      }

      const queryParams = new URLSearchParams({
        url: targetUrl,
        id: track.videoId,
        format: selectedFormat.format,
        quality: selectedFormat.quality,
        title: cleanTitle,
      });
      const res = await fetch(`/api/download?${queryParams.toString()}`);
      if (!res.ok) {
        let errText = `Server error (${res.status})`;
        try {
          const json = await res.json();
          if (json.error) errText = json.error;
        } catch {}
        throw new Error(errText);
      }
      const blob = await res.blob();

      if (!blob || blob.size === 0) {
        throw new Error('Received empty media stream buffer.');
      }

      setProgress(100);
      setConvertStep('Download complete!');

      // Safe Blob Object download trigger
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = blobUrl;
      link.download = `${cleanTitle}.${selectedFormat.ext}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      link.remove();

      setTimeout(() => {
        setConverting(false);
        onClose();
      }, 800);
    } catch (err: any) {
      console.error('Download error:', err);
      setErrorMsg(err.message || 'The media stream could not be converted.');
      setConverting(false);
    }
  };

  const handleInstantMirror = () => {
    if (!selectedFormat) return;
    const cleanTitle = (typeof track.title === 'string' ? track.title : String(track.title || 'Tubeflow_Track')).replace(/[/\\?%*:|"<>]/g, '').trim() || 'Track';
    const targetUrl = `${window.location.origin}/api/download?id=${track.videoId}&format=${selectedFormat.format}&quality=${selectedFormat.quality}&title=${encodeURIComponent(cleanTitle)}&direct=true`;
    window.open(targetUrl, '_blank');
  };

  const handleCopyLink = () => {
    const directLink = `${window.location.origin}/api/download?id=${track.videoId}&format=${selectedFormat?.format || 'mp3'}`;
    navigator.clipboard.writeText(directLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#141a26] border border-[#242f44] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top border accent line */}
        <div className="h-1 w-full bg-cyan-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2638]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white font-display">Download Media Manager</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1e2638] transition-colors cursor-pointer"
            id="close-download-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          
          {/* Selected Track Banner */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-[#0b0f17] border border-[#1e2638] items-center sm:items-start">
            <div className="relative w-32 aspect-video rounded-xl overflow-hidden shrink-0 bg-[#141a26] group">
              <img
                src={track.thumbnail || `https://i.ytimg.com/vi/${track.videoId}/hqdefault.jpg`}
                alt={track.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onPlayPreview(track)}
                className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-[#0b0f17]/90 text-white flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-colors shadow-lg cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left min-w-0">
              <h3 className="font-bold text-white text-base leading-snug line-clamp-2 mb-1">
                {track.title}
              </h3>
              <p className="text-sm text-cyan-400 font-medium mb-2">{track.author?.name || 'Artist'}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-400">
                <span>⏱️ {track.timestamp}</span>
                <span>•</span>
                <span>👁️ {formatViews(track.views)} views</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Verified Stream</span>
              </div>
            </div>
          </div>

          {/* Format Tabs (Audio vs Video) */}
          <div>
            <div className="flex p-1 rounded-xl bg-[#0b0f17] border border-[#1e2638] max-w-sm mx-auto sm:mx-0 mb-4">
              <button
                onClick={() => {
                  setActiveTab('audio');
                  setSelectedFormat(audioFormats[0]);
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'audio'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Music className="w-4 h-4" />
                Audio (MP3 / M4A)
              </button>

              <button
                onClick={() => {
                  setActiveTab('video');
                  setSelectedFormat(videoFormats[0]);
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'video'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Video className="w-4 h-4" />
                Video (MP4)
              </button>
            </div>

            {/* Quality Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
              {(activeTab === 'audio' ? audioFormats : videoFormats).map((opt) => {
                const isSelected = selectedFormat?.quality === opt.quality && selectedFormat?.format === opt.format;
                return (
                  <div
                    key={`${opt.format}-${opt.quality}`}
                    onClick={() => setSelectedFormat(opt)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#182338] border-cyan-400'
                        : 'bg-[#0b0f17] border-[#1e2638] hover:border-[#2b374e]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-[#1e2638] text-slate-300'
                      }`}>
                        {opt.ext.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-100">{opt.quality}</div>
                        <div className="text-xs text-slate-400">{opt.size} • {opt.mime}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Conversion / Download Progress */}
          {converting && (
            <div className="p-4 rounded-2xl bg-[#0b0f17] border border-cyan-800/60 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between text-xs font-semibold text-cyan-300">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  {convertStep}
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-[#1e2638] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message if Download fails */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-150">
              <div className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5 font-bold">!</div>
              <div className="flex-1">
                <span className="font-semibold block mb-0.5 text-rose-200">Stream Connection Error</span>
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleDownloadClick}
              disabled={converting || !selectedFormat}
              className="flex-1 py-3.5 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              id="confirm-download-button"
            >
              {converting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Download...</span>
                </>
              ) : (
                <>
                  <ArrowDownCircle className="w-5 h-5" />
                  <span>Download Now ({selectedFormat?.size || 'Direct'})</span>
                </>
              )}
            </button>

            <button
              onClick={handleInstantMirror}
              className="py-3 px-3.5 rounded-xl bg-[#0b0f17] hover:bg-[#1e2638] text-cyan-400 hover:text-cyan-300 text-xs font-semibold border border-cyan-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="Open direct streaming pass-through"
            >
              <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              <span>Instant Mirror</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-3 px-3.5 rounded-xl bg-[#0b0f17] hover:bg-[#1e2638] text-slate-300 hover:text-white text-xs font-semibold border border-[#1e2638] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="Copy direct download link"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Trust notice */}
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 pt-2 border-t border-[#1e2638]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Virus Free
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
              No Registration Required
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
