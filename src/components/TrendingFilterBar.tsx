import React from 'react';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  Search, 
  X, 
  LayoutGrid, 
  List, 
  Clock, 
  Flame, 
  Eye, 
  SortAsc,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { CategoryFilter } from './CategoryFilter';

export type SortOption = 'popular' | 'newest' | 'duration-asc' | 'duration-desc' | 'title-asc';
export type DurationFilter = 'all' | 'short' | 'medium' | 'long';
export type ViewMode = 'grid' | 'list';

interface TrendingFilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  durationFilter: DurationFilter;
  onDurationChange: (duration: DurationFilter) => void;
  searchFilter: string;
  onSearchFilterChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalTracks: number;
  filteredCount: number;
  hasActiveFilters: boolean;
  onResetAllFilters: () => void;
  isSearching: boolean;
}

export const TrendingFilterBar: React.FC<TrendingFilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  durationFilter,
  onDurationChange,
  searchFilter,
  onSearchFilterChange,
  viewMode,
  onViewModeChange,
  totalTracks,
  filteredCount,
  hasActiveFilters,
  onResetAllFilters,
  isSearching,
}) => {
  return (
    <div className="w-full space-y-4 mb-6" id="trending-filter-container">
      {/* Top Bar: Genre Category Bar + View Switcher */}
      <div className="flex flex-col md:flex-row md:items-start lg:items-center justify-between gap-3.5">
        {/* Categories / Genres */}
        <div className="flex-1 w-full min-w-0">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={onSelectCategory}
            hasSearchResults={isSearching}
            onResetSearchResults={onResetAllFilters}
          />
        </div>

        {/* View Mode Switcher (Grid vs List) */}
        <div className="hidden sm:flex items-center gap-1.5 p-1 rounded-xl bg-[#141a26] border border-[#242f44] shrink-0 self-start md:self-center mt-1 md:mt-0">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-[#1e2638]'
            }`}
            title="Grid View"
            aria-label="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden md:inline">Grid</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-white hover:bg-[#1e2638]'
            }`}
            title="List View"
            aria-label="List View"
          >
            <List className="w-4 h-4" />
            <span className="hidden md:inline">List</span>
          </button>
        </div>
      </div>

      {/* Secondary Controls: In-Page Quick Filter, Sort Options, Duration Filter */}
      <div className="p-3.5 rounded-2xl bg-[#101622] border border-[#1e2638] flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3">
        
        {/* Quick Instant Search within Loaded Tracks */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => onSearchFilterChange(e.target.value)}
            placeholder="Filter by song or artist..."
            className="w-full pl-9 pr-8 py-2 bg-[#0b0f17] border border-[#242f44] focus:border-cyan-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
            id="trending-search-filter-input"
          />
          {searchFilter && (
            <button
              onClick={() => onSearchFilterChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-white hover:bg-[#1e2638]"
              title="Clear Filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Duration Selectors */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#0b0f17] border border-[#242f44] rounded-xl px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-[11px] text-slate-400 hidden md:inline font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-1"
              id="trending-sort-select"
            >
              <option value="popular" className="bg-[#141a26] text-white">🔥 Most Popular</option>
              <option value="newest" className="bg-[#141a26] text-white">✨ Recently Released</option>
              <option value="duration-asc" className="bg-[#141a26] text-white">⏱️ Shortest Duration</option>
              <option value="duration-desc" className="bg-[#141a26] text-white">⏱️ Longest Duration</option>
              <option value="title-asc" className="bg-[#141a26] text-white">🔤 Title (A to Z)</option>
            </select>
          </div>

          {/* Duration Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#0b0f17] border border-[#242f44] rounded-xl px-2.5 py-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-[11px] text-slate-400 hidden md:inline font-medium">Length:</span>
            <select
              value={durationFilter}
              onChange={(e) => onDurationChange(e.target.value as DurationFilter)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-1"
              id="trending-duration-select"
            >
              <option value="all" className="bg-[#141a26] text-white">All Lengths</option>
              <option value="short" className="bg-[#141a26] text-white">&lt; 3 mins</option>
              <option value="medium" className="bg-[#141a26] text-white">3 – 5 mins</option>
              <option value="long" className="bg-[#141a26] text-white">&gt; 5 mins</option>
            </select>
          </div>

          {/* Reset All Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetAllFilters}
              className="px-2.5 py-1.5 rounded-xl bg-[#1c2436] hover:bg-[#25324c] text-cyan-400 hover:text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-cyan-500/20 cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Status Summary & Active Badges */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-300">
            Showing <strong className="text-white font-bold">{filteredCount}</strong> of {totalTracks} tracks
          </span>

          {selectedCategory.toLowerCase() !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-semibold">
              Genre: {selectedCategory}
            </span>
          )}

          {durationFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-semibold">
              Length: {durationFilter === 'short' ? '< 3m' : durationFilter === 'medium' ? '3-5m' : '> 5m'}
            </span>
          )}

          {searchFilter.trim() && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-semibold">
              Query: "{searchFilter}"
            </span>
          )}
        </div>

        {/* Small Mobile View Mode Toggle */}
        <div className="flex sm:hidden items-center gap-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-lg border ${viewMode === 'grid' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-[#141a26] text-slate-400 border-[#242f44]'}`}
            title="Grid"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-lg border ${viewMode === 'list' ? 'bg-cyan-500 text-slate-950 border-cyan-400' : 'bg-[#141a26] text-slate-400 border-[#242f44]'}`}
            title="List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
