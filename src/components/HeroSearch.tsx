import React, { useState, useRef } from 'react';
import { Search, Sparkles, Music2, Video, ArrowRight, Loader2, X, Clipboard } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeroSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  onQuickFormatSelect?: (format: 'mp3' | 'mp4') => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearch,
  isLoading,
  onQuickFormatSelect,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setQuery(text);
          onSearch(text);
        }
      }
    } catch {
      inputRef.current?.focus();
    }
  };

  const trendingTags = [
    "Sauti Sol",
    "Bien",
    "Nyashinski",
    "Otile Brown",
    "Burna Boy",
    "Sabrina Carpenter",
    "Kendrick Lamar",
    "Wakadinali",
    "Afrobeats",
    "Latin Hits"
  ];

  return (
    <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8" id="hero-section">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-5 font-display leading-[1.15]">
          Your Ultimate <span className="text-cyan-400">Music Hub</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-6 font-normal leading-relaxed">
          Search, stream and download your favorite songs and videos directly from YouTube. Get high-fidelity 320kbps MP3 audio or 1080p MP4 video — fast, free and unlimited!
        </p>

        {/* Clear Prominent Download & Install Application Button */}
        <div className="flex items-center justify-center mb-9">
          <PWAInstallButton variant="hero" />
        </div>

        {/* Main Clean Search Bar */}
        <div className="relative max-w-3xl mx-auto mb-6">
          <div className="relative rounded-2xl bg-[#141a26] border border-[#242f44] focus-within:border-cyan-500 transition-all duration-200 shadow-lg">
            <form onSubmit={handleSubmit} className="relative flex items-center rounded-2xl overflow-hidden p-1.5">
              
              <div className="pl-3.5 pr-2 text-slate-400">
                <Search className="w-5 h-5 text-cyan-400" />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any artist worldwide (e.g. Sauti Sol, Bien, Burna Boy, Sabrina Carpenter) or YouTube link..."
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-base font-normal px-2 py-3 focus:outline-none"
                id="main-search-input"
              />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1e2638] transition-colors mr-1"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={handlePaste}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-[#1a2130] hover:bg-[#232c40] rounded-xl border border-[#2b374e] mr-2 transition-all"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5 text-cyan-400" />
                <span>Paste</span>
              </button>

              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0 cursor-pointer"
                id="search-submit-btn"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Quick Suggestion Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-xs sm:text-sm">
          <span className="text-slate-400 font-medium">Try searching:</span>
          {trendingTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                onSearch(tag);
              }}
              className="px-3 py-1 rounded-full bg-[#141a26] hover:bg-[#1c2436] text-slate-300 hover:text-cyan-300 border border-[#242f44] transition-all hover:scale-105"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* High-Level Quick Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <button
            onClick={() => {
              if (onQuickFormatSelect) onQuickFormatSelect('mp3');
              if (query.trim()) onSearch(query.trim());
              else onSearch('Top Music Hits 2026');
            }}
            className="group relative overflow-hidden p-4 rounded-2xl bg-[#141a26] border border-[#242f44] hover:border-cyan-500/60 transition-all duration-200 text-left flex items-center gap-4 shadow-md cursor-pointer"
            id="quick-download-mp3"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-200 shrink-0">
              <Music2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-slate-100 group-hover:text-cyan-300 text-base flex items-center gap-1.5">
                Download MP3
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-slate-400">High Quality Audio (320kbps)</p>
            </div>
          </button>

          <button
            onClick={() => {
              if (onQuickFormatSelect) onQuickFormatSelect('mp4');
              if (query.trim()) onSearch(query.trim());
              else onSearch('Trending 4K Music Videos');
            }}
            className="group relative overflow-hidden p-4 rounded-2xl bg-[#141a26] border border-[#242f44] hover:border-violet-500/60 transition-all duration-200 text-left flex items-center gap-4 shadow-md cursor-pointer"
            id="quick-download-mp4"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-105 group-hover:bg-violet-500 group-hover:text-slate-950 transition-all duration-200 shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-slate-100 group-hover:text-violet-300 text-base flex items-center gap-1.5">
                Download MP4
                <Sparkles className="w-3.5 h-3.5 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-xs text-slate-400">High Quality Video (1080p HD)</p>
            </div>
          </button>
        </div>

      </div>
    </section>
  );
};
