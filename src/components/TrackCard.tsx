import React from 'react';
import { Play, Pause, Download, Music, Video, Eye, Clock, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { Track } from '../types';
import { formatViews } from '../utils/audioSynthesizer';
import { DownloadButton } from './DownloadButton';

interface TrackCardProps {
  track: Track;
  onDownload: (track: Track, format: 'mp3' | 'mp4') => void;
  onOpenModal: (track: Track) => void;
  onPlayPreview: (track: Track) => void;
  isPlaying: boolean;
}

export const TrackCard: React.FC<TrackCardProps> = ({
  track,
  onDownload,
  onOpenModal,
  onPlayPreview,
  isPlaying,
}) => {
  return (
    <div 
      className="group relative bg-[#141a26] hover:bg-[#182030] border border-[#1e2638] hover:border-cyan-500/50 rounded-2xl p-3.5 transition-all duration-200 shadow-md flex flex-col justify-between"
      id={`track-card-${track.videoId}`}
    >
      {/* Thumbnail Header with Duration and Quick Play */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-3 bg-[#0b0f17]">
        <img
          src={track.thumbnail || `https://i.ytimg.com/vi/${track.videoId}/hqdefault.jpg`}
          alt={track.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17]/90 via-transparent to-transparent opacity-80" />

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-[#0b0f17]/90 backdrop-blur-md text-[11px] font-semibold text-slate-200 border border-[#1e2638] flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-cyan-400" />
          {track.timestamp || '3:30'}
        </div>

        {/* Play/Pause Button Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayPreview(track);
          }}
          className={`absolute inset-0 m-auto w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer ${
            isPlaying
              ? 'bg-cyan-500 text-slate-950 scale-100 ring-4 ring-cyan-400/30'
              : 'bg-[#0b0f17]/80 text-white opacity-90 sm:opacity-0 sm:group-hover:opacity-100 group-hover:scale-105 hover:bg-cyan-500 hover:text-slate-950'
          }`}
          title={isPlaying ? 'Pause Preview' : 'Play Preview'}
          aria-label={isPlaying ? 'Pause Preview' : 'Play Preview'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Playing Animated Equalizer pill */}
        {isPlaying && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-cyan-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1 h-2 bg-slate-950 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-3 bg-slate-950 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-2 bg-slate-950 animate-bounce" style={{ animationDelay: '300ms' }} />
            <span>Playing</span>
          </div>
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 
            onClick={() => onOpenModal(track)}
            className="font-bold text-slate-100 text-sm line-clamp-2 hover:text-cyan-400 cursor-pointer transition-colors leading-snug mb-1" 
            title={track.title}
          >
            {track.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <span className="truncate font-medium text-slate-300">{track.author?.name || 'Artist'}</span>
            <CheckCircle className="w-3 h-3 text-cyan-400 shrink-0 fill-cyan-400/20" />
          </div>
        </div>

        <div className="pt-2 border-t border-[#1e2638]">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-400" />
              <span>{formatViews(track.views || 0)} views</span>
            </div>
            <span>{track.ago || 'Popular'}</span>
          </div>

          {/* Download Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <DownloadButton
              videoId={track.videoId}
              title={track.title}
              format="mp3"
              quality="320 kbps (High Fidelity)"
              variant="cyan"
              className="py-2 text-xs font-semibold"
              onStart={() => onDownload(track, 'mp3')}
            />

            <DownloadButton
              videoId={track.videoId}
              title={track.title}
              format="mp4"
              quality="1080p Full HD"
              variant="violet"
              className="py-2 text-xs font-semibold"
              onStart={() => onDownload(track, 'mp4')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
