import React, { useState, useRef, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  ChevronDown, 
  Check, 
  Flame, 
  Sparkles, 
  Radio, 
  Music, 
  Disc3, 
  Headphones, 
  Zap, 
  RefreshCw,
  Layers
} from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  hasSearchResults: boolean;
  onResetSearchResults: () => void;
}

// Icon helper for genres
const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat === 'all') return <Layers className="w-4 h-4 text-cyan-400" />;
  if (cat === 'trending') return <Flame className="w-4 h-4 text-amber-400 fill-amber-400/20" />;
  if (cat === 'pop') return <Sparkles className="w-4 h-4 text-pink-400" />;
  if (cat === 'afrobeats') return <Radio className="w-4 h-4 text-emerald-400" />;
  if (cat === 'hip-hop') return <Disc3 className="w-4 h-4 text-violet-400" />;
  if (cat === 'rock') return <Zap className="w-4 h-4 text-red-400" />;
  if (cat === 'latin') return <Flame className="w-4 h-4 text-orange-400" />;
  if (cat === 'r&b') return <Headphones className="w-4 h-4 text-indigo-400" />;
  return <Music className="w-4 h-4 text-cyan-400" />;
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  hasSearchResults,
  onResetSearchResults,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const activeCategoryDisplay = categories.find(
    (c) => c.toLowerCase() === selectedCategory.toLowerCase()
  ) || selectedCategory;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ========================================================================= */}
      {/* MOBILE VIEW: Sleek Dropdown Filter (Visible on small screens) */}
      {/* ========================================================================= */}
      <div className="block md:hidden w-full">
        <div className="flex items-center gap-2">
          {/* Main Dropdown Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex-1 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border transition-all cursor-pointer select-none ${
              isOpen
                ? 'bg-[#182338] border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                : 'bg-[#141a26] hover:bg-[#1a2334] border-[#242f44]'
            }`}
            id="mobile-category-dropdown-trigger"
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1 rounded-lg bg-[#0b0f17] border border-[#1e2638] shrink-0">
                {getCategoryIcon(activeCategoryDisplay)}
              </div>
              
              <div className="flex flex-col text-left truncate">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Genre / Mood Filter
                </span>
                <span className="text-sm font-bold text-white truncate">
                  {activeCategoryDisplay}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                {categories.length} Genres
              </span>
              <ChevronDown 
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-cyan-400' : ''
                }`} 
              />
            </div>
          </button>

          {/* Reset Search Button if search query is active */}
          {hasSearchResults && (
            <button
              onClick={onResetSearchResults}
              className="p-2.5 rounded-xl bg-[#141a26] hover:bg-[#1a2334] text-slate-300 hover:text-white border border-[#242f44] shrink-0 transition-colors"
              title="Reset to Trending"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
            </button>
          )}
        </div>

        {/* Floating Dropdown Menu (Mobile) */}
        {isOpen && (
          <div 
            className="absolute left-0 right-0 top-full mt-2 z-40 p-2.5 bg-[#141a26] border border-[#242f44] rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            id="mobile-category-dropdown-menu"
          >
            <div className="px-2 py-1.5 mb-1.5 border-b border-[#1e2638] flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Select Music Category</span>
              <span className="text-[10px] text-cyan-400">Tap to filter</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 max-h-72 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                        : 'bg-[#0b0f17] hover:bg-[#1c2436] text-slate-200 border border-[#1e2638]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={isSelected ? 'text-slate-950' : ''}>
                        {getCategoryIcon(cat)}
                      </span>
                      <span className="truncate">{cat}</span>
                    </div>

                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-slate-950 shrink-0 stroke-[3]" />
                    )}
                  </button>
                );
              })}
            </div>

            {hasSearchResults && (
              <div className="pt-2 mt-2 border-t border-[#1e2638]">
                <button
                  type="button"
                  onClick={() => {
                    onResetSearchResults();
                    setIsOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#0b0f17] hover:bg-[#1a2334] text-xs font-semibold text-slate-300 hover:text-white border border-[#1e2638] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Reset Search & Return to Trending</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TABLET & DESKTOP VIEW: Fast-Access Wrapping Pill Bar (Visible on md+ screens) */}
      {/* ========================================================================= */}
      <div className="hidden md:flex flex-wrap items-center gap-2 sm:gap-2.5">
        {categories.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'bg-[#141a26] hover:bg-[#1c2436] text-slate-300 hover:text-white border border-[#242f44]'
              }`}
            >
              <span className={isSelected ? 'text-slate-950' : ''}>
                {getCategoryIcon(cat)}
              </span>
              <span>{cat}</span>
            </button>
          );
        })}

        {hasSearchResults && (
          <button
            onClick={onResetSearchResults}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#1a2130] hover:bg-[#232c40] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors border border-[#2b374e] whitespace-nowrap cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-cyan-400" />
            <span>Reset to Trending</span>
          </button>
        )}
      </div>
    </div>
  );
};
