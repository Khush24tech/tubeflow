import React, { useState, useEffect } from 'react';
import { Play, Pause, Download, Volume2, VolumeX, SkipForward, SkipBack, X, Music2, Video, Sparkles, Maximize2 } from 'lucide-react';
import { Track } from '../types';
import { formatDuration, audioPlayer } from '../utils/audioSynthesizer';

interface AudioPlayerBarProps {
  track: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onClose: () => void;
  onDownload: (track: Track) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  track,
  isPlaying,
  currentTime,
  duration,
  onTogglePlay,
  onSeek,
  onClose,
  onDownload,
  onNext,
  onPrev,
}) => {
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    audioPlayer.setVideoVisibility(showVideo);
  }, [showVideo]);

  if (!track) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onSeek(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
    audioPlayer.setVolume(val);
  };

  const toggleMute = () => {
    const muted = audioPlayer.toggleMute();
    setIsMuted(muted);
  };

  const toggleVideo = () => {
    const nextState = !showVideo;
    setShowVideo(nextState);
    audioPlayer.setVideoVisibility(nextState);
  };

  const handleClose = () => {
    setShowVideo(false);
    audioPlayer.setVideoVisibility(false);
    onClose();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0e131d] border-t border-[#1e2638] shadow-2xl animate-in slide-in-from-bottom duration-300">
      
      {/* Interactive Progress Bar across entire top edge */}
      <div className="relative group w-full h-1.5 bg-[#141a26] cursor-pointer">
        <div 
          className="h-full bg-cyan-500 transition-all"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
        <input
          type="range"
          min="0"
          max={duration || 180}
          step="0.5"
          value={currentTime}
          onChange={handleSeekChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title="Seek playback"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Track Details & Video Switcher */}
          <div className="flex items-center gap-3 min-w-0 max-w-[280px] sm:max-w-xs md:max-w-sm">
            <div 
              onClick={toggleVideo}
              className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#141a26] shrink-0 border border-[#1e2638] group cursor-pointer"
              title="Click to toggle Video Player"
            >
              <img
                src={track.thumbnail || `https://i.ytimg.com/vi/${track.videoId}/hqdefault.jpg`}
                alt={track.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-[#0b0f17]/30 group-hover:bg-[#0b0f17]/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#0b0f17]/60">
                <Video className="w-4 h-4 text-cyan-400" />
              </div>
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white truncate leading-tight mb-0.5" title={track.title}>
                {track.title}
              </h4>
              <div className="flex items-center gap-2">
                <p className="text-xs text-cyan-400 truncate">{track.author?.name || 'Artist'}</p>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono hidden sm:inline">
                  Real YouTube Stream
                </span>
              </div>
            </div>
          </div>

          {/* Center: Playback Controls & Waveform visualizer */}
          <div className="flex flex-col items-center gap-1 flex-1 max-w-md">
            <div className="flex items-center gap-4">
              {onPrev && (
                <button
                  onClick={onPrev}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1e2638] transition-colors hidden sm:block cursor-pointer"
                  title="Previous Track"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={onTogglePlay}
                className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-md transition-all hover:scale-105 cursor-pointer"
                title={isPlaying ? "Pause" : "Play Real Track"}
                id="player-play-toggle"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              {onNext && (
                <button
                  onClick={onNext}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block cursor-pointer"
                  title="Next Track"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Time progress label */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span>{formatDuration(currentTime)}</span>
              <span>/</span>
              <span>{formatDuration(duration)}</span>

              {/* Waveform graphic visualization */}
              <div className="hidden md:flex items-center gap-0.5 ml-2 h-3">
                {[4, 8, 12, 6, 10, 14, 7, 11, 5, 9].map((height, i) => (
                  <span
                    key={i}
                    className={`w-0.5 bg-cyan-400 rounded-full transition-all duration-150 ${
                      isPlaying ? 'animate-pulse' : 'opacity-30'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(3, (height * (i % 2 === 0 ? 1.2 : 0.8)))}px` : '3px',
                      animationDelay: `${i * 70}ms`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Video Mode Toggle, Volume & Download CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Toggle Video/Audio Mode */}
            <button
              onClick={toggleVideo}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                showVideo
                  ? 'bg-violet-600 text-white border-violet-400 shadow-md shadow-violet-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
              }`}
              title={showVideo ? "Hide Video Window" : "Watch Official Music Video"}
              id="player-video-toggle"
            >
              <Video className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">{showVideo ? 'Hide Video' : 'Watch Video'}</span>
            </button>

            {/* Volume Control */}
            <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={toggleMute}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-slate-300" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                title="Volume"
              />
            </div>

            {/* Quick Download Button */}
            <button
              onClick={() => onDownload(track)}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
              title="Download Track"
              id="player-download-btn"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            {/* Close Player */}
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Audio Player"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};
