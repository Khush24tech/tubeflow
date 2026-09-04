import React, { useState } from 'react';
import { Download, Loader2, Music, Video, CheckCircle2, AlertCircle } from 'lucide-react';

interface DownloadButtonProps {
  videoUrl?: string;
  videoId?: string;
  title: string;
  format?: 'mp3' | 'mp4' | 'm4a' | 'flac';
  quality?: string;
  label?: string;
  className?: string;
  variant?: 'cyan' | 'violet' | 'glass' | 'primary' | 'icon-only';
  onStart?: () => void;
  onSuccess?: (title: string, format: string) => void;
  onError?: (errorMessage: string) => void;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  videoUrl,
  videoId,
  title,
  format = 'mp3',
  quality = '320kbps',
  label,
  className = '',
  variant = 'cyan',
  onStart,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string>('');

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    const targetUrl = videoUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : '');

    if (!targetUrl && !videoId) {
      const errMsg = 'No video URL or ID provided for download.';
      onError ? onError(errMsg) : alert(errMsg);
      return;
    }

    setLoading(true);
    setDownloadSuccess(false);
    setDownloadStatus('Connecting to stream...');
    onStart?.();

    try {
      const cleanTitle = (typeof title === 'string' ? title : String(title || 'Tubeflow_Media')).replace(/[/\\?%*:|"<>]/g, '').trim() || 'Tubeflow_Media';
      const cleanVideoId = videoId || (targetUrl.includes('v=') ? targetUrl.split('v=')[1]?.split('&')[0] : '');

      let directDownloadUrl: string | null = null;

      // Phase 1: Check ultra-fast conversion preparation API
      try {
        const prepareParams = new URLSearchParams({
          url: targetUrl,
          id: cleanVideoId,
          format,
          quality,
        });

        const prepRes = await fetch(`/api/download/prepare?${prepareParams.toString()}`);
        if (prepRes.ok) {
          const prepData = await prepRes.json();
          if (prepData.ready && prepData.downloadUrl) {
            directDownloadUrl = prepData.downloadUrl;
          } else if (prepData.jobId) {
            setDownloadStatus('Converting...');

            // Rapid polling loop for instant progress
            for (let i = 0; i < 25; i++) {
              await new Promise((r) => setTimeout(r, 400));
              const progParams = new URLSearchParams({
                id: prepData.jobId,
                progressUrl: prepData.progressUrl || '',
                cacheKey: prepData.cacheKey || '',
              });
              const pRes = await fetch(`/api/download/progress?${progParams.toString()}`);
              if (pRes.ok) {
                const pData = await pRes.json();
                if (pData.progress) {
                  setDownloadStatus(`Converting ${Math.round(pData.progress)}%`);
                }
                if (pData.ready && pData.downloadUrl) {
                  directDownloadUrl = pData.downloadUrl;
                  break;
                }
              }
            }
          }
        }
      } catch (prepErr) {
        console.warn('Prepare API notice, falling back to direct stream:', prepErr);
      }

      // If direct URL is obtained from the converter pipeline, trigger direct download
      if (directDownloadUrl) {
        setDownloadStatus('Saving file...');
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = directDownloadUrl;
        link.download = `${cleanTitle}.${format}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        link.remove();

        setDownloadSuccess(true);
        setDownloadStatus('Done!');
        onSuccess?.(cleanTitle, format);

        setTimeout(() => {
          setDownloadSuccess(false);
          setDownloadStatus('');
        }, 3000);
        return;
      }

      // Phase 2: Stream pass-through fallback
      const queryParams = new URLSearchParams({
        url: targetUrl,
        id: cleanVideoId,
        format,
        quality,
        title: cleanTitle,
      });

      setDownloadStatus('Fetching media buffer...');
      const res = await fetch(`/api/download?${queryParams.toString()}`);

      if (!res.ok) {
        let errorMessage = `Download failed (HTTP ${res.status})`;
        try {
          const errData = await res.json();
          if (errData.error) {
            errorMessage = errData.error;
          }
        } catch {}

        if (res.status === 404) {
          errorMessage = 'The media resource or download service was not found (404). Please try again or select another format.';
        } else if (res.status === 429) {
          errorMessage = 'Download rate limit reached. Please wait a moment before downloading again.';
        } else if (res.status === 503 || res.status === 504) {
          errorMessage = 'The conversion server is busy. Please click the track options to use the Instant Mirror.';
        }

        throw new Error(errorMessage);
      }

      setDownloadStatus('Processing file blob...');
      const blob = await res.blob();

      if (!blob || blob.size === 0) {
        throw new Error('Received an empty media buffer. Please try another format or link.');
      }

      // Safe asynchronous Blob object trigger
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = `${cleanTitle}.${format}`;
      document.body.appendChild(a);
      a.click();

      // Clean up object memory
      window.URL.revokeObjectURL(blobUrl);
      a.remove();

      setDownloadSuccess(true);
      setDownloadStatus('Done!');
      onSuccess?.(cleanTitle, format);

      setTimeout(() => {
        setDownloadSuccess(false);
        setDownloadStatus('');
      }, 3000);
    } catch (err: any) {
      console.error('Blob Download Error:', err);
      const msg = err.message || 'Download failed. The video may be restricted.';
      onError ? onError(msg) : alert(`Download Notice: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // Style variants
  const variantStyles = {
    cyan: 'bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/80 hover:border-cyan-500/80 text-cyan-300 hover:text-cyan-100 shadow-sm',
    violet: 'bg-violet-950/80 hover:bg-violet-900 border border-violet-800/80 hover:border-violet-500/80 text-violet-300 hover:text-violet-100 shadow-sm',
    primary: 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-600 hover:opacity-95 text-white shadow-lg shadow-cyan-500/20 font-bold',
    glass: 'bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 hover:text-white',
    'icon-only': 'p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700',
  };

  const defaultLabel = format === 'mp4' ? 'MP4' : 'MP3';

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`relative inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 cursor-pointer select-none disabled:opacity-70 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`}
      title={downloadStatus || (format === 'mp4' ? 'Download High-Res MP4 Video' : 'Download High-Fidelity MP3 Audio')}
      aria-label={`Download ${format.toUpperCase()}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current shrink-0" />
          <span className="truncate">{downloadStatus || 'Downloading...'}</span>
        </>
      ) : downloadSuccess ? (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Saved</span>
        </>
      ) : (
        <>
          {format === 'mp4' ? (
            <Video className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <Music className="w-3.5 h-3.5 shrink-0" />
          )}
          <span>{label || defaultLabel}</span>
        </>
      )}
    </button>
  );
};
