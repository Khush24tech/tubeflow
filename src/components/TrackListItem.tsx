import React from 'react';
import { Play, Pause, Download, Music, Video, Eye, Clock, CheckCircle, MoreHorizontal } from 'lucide-react';
import { Track } from '../types';
import { formatViews } from '../utils/audioSynthesizer';
import { DownloadButton } from './DownloadButton';

interface TrackListItemProps {
  track: Track;
  index: number;
  onDownload: (track: Track, format: 'mp3' | 'mp4') => void;
  onOpenModal: (track: Track) => void;
  onPlayPreview: (track: Track) => void;
  isPlaying: boolean;
}

export const TrackListItem: React.FC<TrackListItemProps> = ({
  track,
  index,
  onDownload,
  onOpenModal,
  onPlayPreview,
  isPlaying,
}) => {
  return (
    <div 
      className={`group relative bg-[#141a26] hover:bg-[#182133] border border-[#1e2638] hover:border-cyan-500/40 rounded-2xl p-3 sm:p-3.5 transition-all duration-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 ${
        isPlaying ? 'border-cyan-500/60 bg-[#162035]' : ''
      }`}
      id={`track-list-item-${track.videoId}`}
    >
      {/* Left: Index & Thumbnail with play button */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
        {/* Index indicator */}
        <span className="hidden sm:block text-xs font-bold text-slate-500 w-5 text-center shrink-0">
          {(index + 1).toString().padStart(2, '0')}
        </span>

        {/* Thumbnail with overlay play */}
        <div className="relative w-20 sm:w-24 aspect-video rounded-xl overflow-hidden bg-[#0b0f17] shrink-0">
          <img
            src={track.thumbnail || `https://i.ytimg.com/vi/${track.videoId}/hqdefault.jpg`}
            alt={track.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlayPreview(track);
            }}
            className={`absolute inset-0 m-auto w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isPlaying
                ? 'bg-cyan-500 text-slate-950 scale-100'
                : 'bg-[#0b0f17]/80 text-white opacity-90 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-cyan-500 hover:text-slate-950'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          {/* Mini duration badge */}
          <div className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[10px] font-semibold text-slate-200">
            {track.timestamp || '3:30'}
          </div>
        </div>

        {/* Title, Artist, and Tags */}
        <div className="min-w-0 flex-1">
          <h3 
            onClick={() => onOpenModal(track)}
            className="font-bold text-slate-100 text-sm truncate hover:text-cyan-400 cursor-pointer transition-colors"
            title={track.title}
          >
            {track.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span className="truncate text-slate-300 font-medium">{track.author?.name || 'Artist'}</span>
            <CheckCircle className="w-3 h-3 text-cyan-400 shrink-0 fill-cyan-400/20" />
            <span className="text-slate-500 hidden md:inline">•</span>
            <span className="hidden md:inline text-[11px] text-slate-400">{formatViews(track.views || 0)} views</span>
            {track.ago && (
              <>
                <span className="text-slate-500 hidden lg:inline">•</span>
                <span className="hidden lg:inline text-[11px] text-slate-400">{track.ago}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Quick actions & Download buttons */}
      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1e2638]">
        <div className="flex items-center gap-1.5 sm:hidden text-xs text-slate-400">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{track.timestamp || '3:30'}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick MP3 Button */}
          <DownloadButton
            videoId={track.videoId}
            title={track.title}
            format="mp3"
            quality="320 kbps"
            variant="cyan"
            className="py-1.5 px-3 text-xs font-semibold"
            onStart={() => onDownload(track, 'mp3')}
          />

          {/* Quick MP4 Button */}
          <DownloadButton
            videoId={track.videoId}
            title={track.title}
            format="mp4"
            quality="1080p HD"
            variant="violet"
            className="py-1.5 px-3 text-xs font-semibold"
            onStart={() => onDownload(track, 'mp4')}
          />

          {/* Options / Open Modal Button */}
          <button
            type="button"
            onClick={() => onOpenModal(track)}
            className="p-1.5 rounded-xl bg-[#0b0f17] hover:bg-[#1e2638] text-slate-400 hover:text-white border border-[#242f44] transition-colors cursor-pointer"
            title="All Format Options"
            aria-label="All Format Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
