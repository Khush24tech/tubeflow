import React from 'react';
import { X, Download, CheckCircle2, AlertCircle, Loader2, Trash2, FileAudio, FileVideo, ExternalLink, HardDrive } from 'lucide-react';
import { DownloadJob } from '../types';

interface DownloadQueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  downloads: DownloadJob[];
  onClearHistory: () => void;
  onRedownload: (job: DownloadJob) => void;
}

export const DownloadQueueDrawer: React.FC<DownloadQueueDrawerProps> = ({
  isOpen,
  onClose,
  downloads,
  onClearHistory,
  onRedownload,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#141a26] border-l border-[#1e2638] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-[#1e2638] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base font-display">Download Manager</h3>
                <p className="text-xs text-slate-400">{downloads.length} items in history</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {downloads.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-[#1e2638] transition-colors"
                  title="Clear history"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#1e2638] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List of downloads */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {downloads.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <HardDrive className="w-12 h-12 mb-3 text-slate-700 stroke-[1.5]" />
                <p className="text-sm font-medium text-slate-400">No downloads yet</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Search any song or video and click MP3 / MP4 to download directly to your device.
                </p>
              </div>
            ) : (
              downloads.map((job) => {
                const isAudio = job.format === 'mp3' || job.format === 'm4a' || job.format === 'flac';

                return (
                  <div
                    key={job.id}
                    className="p-3.5 rounded-2xl bg-[#0b0f17] border border-[#1e2638] hover:border-[#2b374e] transition-all space-y-2.5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-14 aspect-video rounded-lg overflow-hidden bg-[#141a26] shrink-0">
                        <img
                          src={job.track.thumbnail || `https://i.ytimg.com/vi/${job.track.videoId}/hqdefault.jpg`}
                          alt={job.track.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-white truncate leading-snug" title={job.track.title}>
                          {job.track.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            isAudio ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/40' : 'bg-violet-950 text-violet-400 border border-violet-800/40'
                          }`}>
                            {isAudio ? <FileAudio className="w-2.5 h-2.5" /> : <FileVideo className="w-2.5 h-2.5" />}
                            {job.format} • {job.quality.split(' ')[0]}
                          </span>
                          <span className="text-[10px] text-slate-400">{job.fileSize}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Status */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5">
                          {job.status === 'completed' && (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">Downloaded</span>
                            </>
                          )}
                          {job.status === 'downloading' && (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                              <span className="text-cyan-400">Saving file...</span>
                            </>
                          )}
                          {job.status === 'converting' && (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                              <span className="text-cyan-400">Encoding format...</span>
                            </>
                          )}
                          {job.status === 'error' && (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                              <span className="text-red-400">Failed</span>
                            </>
                          )}
                        </span>
                        <span className="text-slate-400 font-mono text-[10px]">{job.progress}%</span>
                      </div>

                      <div className="w-full h-1.5 bg-[#141a26] rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            job.status === 'completed'
                              ? 'bg-emerald-500'
                              : 'bg-cyan-500'
                          }`}
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    {job.status === 'completed' && (
                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() => onRedownload(job)}
                          className="px-2.5 py-1 rounded-lg bg-[#141a26] hover:bg-[#1e2638] text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1.5 transition-colors border border-[#1e2638]"
                        >
                          <Download className="w-3 h-3 text-cyan-400" />
                          <span>Download Again</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-[#1e2638] bg-[#0b0f17] text-center">
            <p className="text-[11px] text-slate-400">
              Files are saved directly to your browser's default Downloads folder.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
