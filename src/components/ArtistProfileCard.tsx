import React from 'react';
import { BadgeCheck, Users, Music2, Play, Sparkles } from 'lucide-react';
import { ArtistProfile } from '../types';

interface ArtistProfileCardProps {
  artist: ArtistProfile;
  totalTracksCount?: number;
  onPlayTopTrack?: () => void;
}

export const ArtistProfileCard: React.FC<ArtistProfileCardProps> = ({
  artist,
  totalTracksCount,
  onPlayTopTrack,
}) => {
  const formatFans = (count?: number | string) => {
    if (!count) return 'Top Global Artist';
    if (typeof count === 'string') return count;
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M fans`;
    if (count >= 1000) return `${Math.round(count / 1000)}K fans`;
    return `${count} fans`;
  };

  return (
    <div 
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111726] via-[#141d2e] to-[#0c121e] border border-[#232f48] shadow-2xl p-6 sm:p-8 mb-8"
      id="artist-profile-banner"
    >
      {/* Subtle background ambient glow using artist photo */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 blur-3xl pointer-events-none"
        style={{ backgroundImage: `url(${artist.picture})` }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
        
        {/* Real Artist Portrait Photo */}
        <div className="relative shrink-0 group">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-cyan-500/40 shadow-xl bg-[#090d15] relative">
            <img 
              src={artist.picture} 
              alt={artist.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-cyan-500 text-slate-950 shadow-md">
            <BadgeCheck className="w-5 h-5 fill-current" />
          </div>
        </div>

        {/* Artist Information & Metadata */}
        <div className="flex-1 text-center sm:text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Artist Profile</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {artist.name}
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {artist.bio || `Stream and download the latest authentic songs, top global releases, and official music tracks by ${artist.name}.`}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="font-medium text-slate-200">{formatFans(artist.fans)}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
            <div className="flex items-center gap-1.5">
              <Music2 className="w-4 h-4 text-cyan-400" />
              <span className="font-medium text-slate-200">
                {totalTracksCount ? `${totalTracksCount} tracks available` : 'Latest Discography'}
              </span>
            </div>
            {artist.genre && (
              <>
                <div className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block" />
                <span className="px-2.5 py-0.5 rounded-md bg-[#192233] text-slate-300 font-medium">
                  {artist.genre}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Quick Action Button */}
        {onPlayTopTrack && (
          <div className="shrink-0 self-center sm:self-center">
            <button
              type="button"
              onClick={onPlayTopTrack}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:scale-103 active:scale-98 transition-all flex items-center gap-2.5 cursor-pointer"
              id="btn-artist-play-top"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Play Top Track</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
