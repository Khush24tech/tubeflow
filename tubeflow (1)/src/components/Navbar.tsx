import React, { useState } from 'react';
import { Music, Download, Search, Sparkles, Menu, X, Radio, Disc3, ShieldCheck } from 'lucide-react';
import { DownloadJob } from '../types';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onSearchClick: () => void;
  activeDownloads: DownloadJob[];
  onOpenQueue: () => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  onOpenSecurity?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchClick,
  activeDownloads,
  onOpenQueue,
  onSelectCategory,
  selectedCategory,
  onOpenSecurity,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const completedCount = activeDownloads.filter(d => d.status === 'completed').length;
  const activeCount = activeDownloads.filter(d => d.status === 'downloading' || d.status === 'converting').length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f17] border-b border-[#1e2638] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            onClick={() => {
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo"
          >
            <div className="w-10 h-10 rounded-xl bg-[#141a26] border border-[#242f44] flex items-center justify-center shadow-md">
              <Music className="w-5 h-5 text-cyan-400" />
            </div>
            
            <span className="font-extrabold text-2xl tracking-tight text-white font-display">
              Tube<span className="text-cyan-400">flow</span>
            </span>
          </div>

          {/* Desktop Navigation Links (Visible on large screens lg+) */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#141a26] p-1.5 rounded-full border border-[#242f44]">
            <button
              onClick={() => {
                onSelectCategory('all');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-[#1e2638]'
              }`}
              id="nav-home"
            >
              Home
            </button>
            <button
              onClick={() => {
                onSelectCategory('Trending');
                const el = document.getElementById('results-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'Trending'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-[#1e2638]'
              }`}
              id="nav-trending"
            >
              Trending
            </button>
            <button
              onClick={() => {
                onSelectCategory('Pop');
                const el = document.getElementById('results-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'Pop'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-[#1e2638]'
              }`}
              id="nav-charts"
            >
              Top Charts
            </button>
            <a
              href="#how-it-works"
              className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1e2638] transition-all"
              id="nav-how-it-works"
            >
              How It Works
            </a>
            <a
              href="#faq"
              className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1e2638] transition-all"
              id="nav-faq"
            >
              FAQ
            </a>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Search trigger */}
            <button
              onClick={onSearchClick}
              className="p-2.5 rounded-xl bg-[#141a26] hover:bg-[#1c2436] text-slate-300 hover:text-cyan-400 border border-[#242f44] transition-all flex items-center justify-center cursor-pointer"
              title="Search Tracks"
              id="nav-search-button"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cloudflare Security Shield Badge */}
            {onOpenSecurity && (
              <button
                type="button"
                onClick={onOpenSecurity}
                className="px-2.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="Cloudflare Security Shield (100% Protected)"
                id="nav-security-button"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="hidden xl:inline text-[11px]">Shield Active</span>
              </button>
            )}

            {/* PWA Install Button (desktop / tablet) */}
            <PWAInstallButton variant="navbar" />

            {/* Downloads Queue Button with Live Counter Badge */}
            <button
              onClick={onOpenQueue}
              className="relative p-2.5 rounded-xl bg-[#141a26] hover:bg-[#1c2436] text-slate-200 border border-[#242f44] transition-all flex items-center gap-2 cursor-pointer group"
              title="Downloads Manager"
              id="nav-downloads-button"
            >
              <Download className={`w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform ${activeCount > 0 ? 'animate-bounce' : ''}`} />
              <span className="text-xs font-semibold hidden sm:inline text-slate-300">Downloads</span>
              {activeDownloads.length > 0 && (
                <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-cyan-500 text-slate-950 min-w-[20px] text-center">
                  {activeDownloads.length}
                </span>
              )}
            </button>

            {/* Mobile & Tablet Hamburger Toggle (Visible up to lg) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#141a26] text-slate-300 lg:hidden border border-[#242f44] hover:text-white hover:bg-[#1c2436] transition-colors cursor-pointer"
              id="mobile-menu-toggle"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e131d] border-b border-[#1e2638] px-4 sm:px-6 py-5 space-y-2 animate-in slide-in-from-top-4 duration-200 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => {
                onSelectCategory('all');
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center justify-between transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-200 hover:bg-[#182030] bg-[#141a26]/60 border border-[#1e2638]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Disc3 className="w-4 h-4 text-cyan-400" />
                <span>Home & All Tracks</span>
              </div>
              {selectedCategory === 'all' && (
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              )}
            </button>

            <button
              onClick={() => {
                onSelectCategory('Trending');
                setMobileMenuOpen(false);
                document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center justify-between transition-colors ${
                selectedCategory === 'Trending'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-200 hover:bg-[#182030] bg-[#141a26]/60 border border-[#1e2638]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Radio className="w-4 h-4 text-violet-400" />
                <span>Trending Music</span>
              </div>
              {selectedCategory === 'Trending' && (
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              )}
            </button>

            <button
              onClick={() => {
                onSelectCategory('Pop');
                setMobileMenuOpen(false);
                document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center justify-between transition-colors ${
                selectedCategory === 'Pop'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-200 hover:bg-[#182030] bg-[#141a26]/60 border border-[#1e2638]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Top Charts</span>
              </div>
              {selectedCategory === 'Pop' && (
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              )}
            </button>

            <button
              onClick={() => {
                onSelectCategory('Afrobeats');
                setMobileMenuOpen(false);
                document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium flex items-center justify-between transition-colors ${
                selectedCategory === 'Afrobeats'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-200 hover:bg-[#182030] bg-[#141a26]/60 border border-[#1e2638]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>Afrobeats Hits</span>
              </div>
              {selectedCategory === 'Afrobeats' && (
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              )}
            </button>

            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-4 py-3 rounded-xl text-slate-200 hover:bg-[#182030] bg-[#141a26]/60 border border-[#1e2638] font-medium flex items-center gap-3 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>How It Works</span>
            </a>

            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left px-4 py-3 rounded-xl text-slate-200 hover:bg-[#182030] bg-[#141a26]/60 border border-[#1e2638] font-medium flex items-center gap-3 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>FAQ & Support</span>
            </a>

            {onOpenSecurity && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSecurity();
                }}
                className="w-full text-left px-4 py-3 rounded-xl font-semibold flex items-center justify-between transition-colors bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Cloudflare Security Shield</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 uppercase tracking-wider">
                  Active
                </span>
              </button>
            )}

            <PWAInstallButton variant="menu" />
          </div>

          <div className="pt-3 border-t border-[#1e2638] flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Tubeflow Music & Video Hub</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onSearchClick();
              }}
              className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Search className="w-3.5 h-3.5" />
              Search Library
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
