import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Flame, 
  Sparkles, 
  Music, 
  Video, 
  Filter, 
  Search, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Loader2,
  Headphones,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Disc3
} from 'lucide-react';
import { Track, DownloadJob, ToastMessage, FormatOption, ArtistProfile } from './types';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { TrackCard } from './components/TrackCard';
import { TrackListItem } from './components/TrackListItem';
import { ArtistProfileCard } from './components/ArtistProfileCard';
import { DownloadModal } from './components/DownloadModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { DownloadQueueDrawer } from './components/DownloadQueueDrawer';
import { CategoryFilter } from './components/CategoryFilter';
import { TrendingFilterBar, SortOption, DurationFilter, ViewMode } from './components/TrendingFilterBar';
import { HowItWorks } from './components/HowItWorks';
import { FeatureHighlights } from './components/FeatureHighlights';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { PWAUpdateToast } from './components/PWAUpdateToast';
import { AuthModal } from './components/AuthModal';
import { registerServiceWorker } from './utils/registerSW';
import { audioPlayer, parseDurationToSeconds } from './utils/audioSynthesizer';
import { subscribeToAuth, logOut } from './utils/firebase';
import { User } from 'firebase/auth';
import { CURATED_TRACKS, getCuratedTracksByCategory } from './data/curatedTracks';
import { performClientFallbackSearch } from './utils/clientSearch';

export default function App() {
  // Main State
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [searchedArtist, setSearchedArtist] = useState<ArtistProfile | null>(null);
  const [trendingTracks, setTrendingTracks] = useState<Track[]>(CURATED_TRACKS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [formatFilter, setFormatFilter] = useState<'all' | 'mp3' | 'mp4'>('all');
  
  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Modal & Downloader State
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadQueue, setDownloadQueue] = useState<DownloadJob[]>([]);
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  // Audio Playback State
  const [currentPlaybackTrack, setCurrentPlaybackTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(180);

  // Trending Section Filter & View State
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [durationFilter, setDurationFilter] = useState<DurationFilter>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Toast Notification
  const [toast, setToast] = useState<ToastMessage | null>(null);
  
  // PWA Service Worker Update State
  const [swWaitingRegistration, setSwWaitingRegistration] = useState<ServiceWorkerRegistration | null>(null);

  const resultsSectionRef = useRef<HTMLDivElement>(null);

  // Subscribe to Firebase Auth state
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = subscribeToAuth((currentUser) => {
        setUser(currentUser);
      });
    } catch (e) {
      console.warn('Failed to subscribe to auth state:', e);
    }
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Register PWA Service Worker on mount
  useEffect(() => {
    registerServiceWorker((registration) => {
      setSwWaitingRegistration(registration);
    });
  }, []);

  // Load user-isolated downloads when account changes
  useEffect(() => {
    const storageKey = user ? `tubeflow_downloads_${user.uid}` : 'tubeflow_downloads_guest';
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setDownloadQueue(JSON.parse(saved));
      } else {
        // Fallback for transition from legacy guest downloads
        const legacy = localStorage.getItem('tubeflow_downloads');
        if (legacy && !user) {
          setDownloadQueue(JSON.parse(legacy));
        } else {
          setDownloadQueue([]);
        }
      }
    } catch {
      setDownloadQueue([]);
    }
  }, [user]);

  // Persist download queue to user's isolated account storage
  useEffect(() => {
    const storageKey = user ? `tubeflow_downloads_${user.uid}` : 'tubeflow_downloads_guest';
    try {
      localStorage.setItem(storageKey, JSON.stringify(downloadQueue));
    } catch {}
  }, [downloadQueue, user]);

  const handleSignOut = async () => {
    try {
      await logOut();
      showToast('Signed Out', 'You have been safely signed out.', 'info');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Load Initial Trending Music on Mount
  useEffect(() => {
    fetchTrending('all');
  }, []);

  // Show Toast Helper
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const fetchTrending = async (category: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/trending?category=${encodeURIComponent(category)}`);
      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.trending && Array.isArray(data.trending) && data.trending.length > 0) {
        setTrendingTracks(data.trending);
      } else {
        setTrendingTracks(getCuratedTracksByCategory(category));
      }
    } catch (err) {
      console.warn('Backend trending API unavailable, using built-in curated tracks:', err);
      setTrendingTracks(getCuratedTracksByCategory(category));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) {
        throw new Error(`API returned HTTP ${res.status}`);
      }
      const data = await res.json();
      
      if (data.results && Array.isArray(data.results) && data.results.length > 0) {
        setResults(data.results);
        setSearchedArtist(data.artist || null);
        showToast(
          'Results Loaded',
          `Found ${data.results.length} songs matching "${searchQuery}"`,
          'info'
        );
      } else {
        // Try fallback if backend returned zero results
        const fallbackResults = await performClientFallbackSearch(searchQuery);
        setResults(fallbackResults.results);
        setSearchedArtist(fallbackResults.artistProfile || null);
        if (fallbackResults.results.length > 0) {
          showToast(
            'Results Loaded',
            `Showing ${fallbackResults.results.length} tracks matching "${searchQuery}"`,
            'info'
          );
        } else {
          setResults([]);
          setSearchedArtist(null);
          showToast('Notice', 'No matching results found. Try another keyword.', 'info');
        }
      }
    } catch (err) {
      console.warn('Primary search API unreachable (e.g. GitHub Pages or offline), running client fallback search:', err);
      try {
        const fallbackResults = await performClientFallbackSearch(searchQuery);
        setResults(fallbackResults.results);
        setSearchedArtist(fallbackResults.artistProfile || null);
        if (fallbackResults.results.length > 0) {
          showToast(
            'Results Loaded',
            `Showing ${fallbackResults.results.length} tracks matching "${searchQuery}"`,
            'info'
          );
        } else {
          setResults([]);
          setSearchedArtist(null);
          showToast('Notice', 'No matching tracks found. Try another keyword.', 'info');
        }
      } catch (fallbackErr) {
        console.error('Fallback search error:', fallbackErr);
        setResults(getCuratedTracksByCategory('all').slice(0, 10));
        setSearchedArtist(null);
        showToast('Notice', 'Showing top trending songs.', 'info');
      }
    } finally {
      setIsLoading(false);
      // Smooth scroll to results
      setTimeout(() => {
        resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all' || category === 'Trending') {
      fetchTrending('all');
    } else {
      fetchTrending(category);
    }
  };

  // Playback Control
  const handlePlayPreview = (track: Track) => {
    if (currentPlaybackTrack?.videoId === track.videoId && isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
    } else {
      setCurrentPlaybackTrack(track);
      setIsPlaying(true);
      const durSec = parseDurationToSeconds(track.timestamp);
      setPlaybackDuration(durSec);

      // Play the actual genuine YouTube song audio or high-quality audio stream
      audioPlayer.play(
        track.videoId,
        durSec,
        (time, dur) => {
          setPlaybackTime(time);
          if (dur > 0) setPlaybackDuration(dur);
        },
        () => {
          setIsPlaying(false);
          setPlaybackTime(0);
        },
        (state) => {
          if (state === 'playing') {
            setIsPlaying(true);
          } else if (state === 'paused' || state === 'ended') {
            setIsPlaying(false);
          }
        },
        track.previewUrl
      );

      showToast('Playing Song', `Now streaming "${track.title}"`, 'info');
    }
  };

  const handleNextTrack = () => {
    const list = results.length > 0 ? results : trendingTracks;
    if (!currentPlaybackTrack || list.length === 0) return;
    const currentIndex = list.findIndex(t => t.videoId === currentPlaybackTrack.videoId);
    const nextIndex = (currentIndex + 1) % list.length;
    handlePlayPreview(list[nextIndex]);
  };

  const handlePrevTrack = () => {
    const list = results.length > 0 ? results : trendingTracks;
    if (!currentPlaybackTrack || list.length === 0) return;
    const currentIndex = list.findIndex(t => t.videoId === currentPlaybackTrack.videoId);
    const prevIndex = (currentIndex - 1 + list.length) % list.length;
    handlePlayPreview(list[prevIndex]);
  };

  const handleTogglePlay = () => {
    if (!currentPlaybackTrack) return;
    if (isPlaying) {
      audioPlayer.pause();
      setIsPlaying(false);
    } else {
      audioPlayer.resume();
      setIsPlaying(true);
    }
  };

  const handleSeek = (seconds: number) => {
    setPlaybackTime(seconds);
    audioPlayer.seek(seconds);
  };

  const handleClosePlayer = () => {
    audioPlayer.stop();
    setIsPlaying(false);
    setCurrentPlaybackTrack(null);
  };

  // Quick Direct Download triggers using Fast Converter Pipeline & Safe Blob processing
  const handleQuickDownload = async (track: Track, format: 'mp3' | 'mp4') => {
    const quality = format === 'mp3' ? '320 kbps (High Fidelity)' : '720p HD';
    const size = format === 'mp3' ? '8.4 MB' : '28.6 MB';
    const cleanTitle = (typeof track.title === 'string' ? track.title : String(track.title || 'Tubeflow_Track')).replace(/[/\\?%*:|"<>]/g, '').trim() || 'Tubeflow_Track';
    
    const jobId = `${track.videoId}-${Date.now()}`;
    const newJob: DownloadJob = {
      id: jobId,
      track,
      format,
      quality,
      progress: 15,
      status: 'converting',
      fileSize: size,
      timestamp: Date.now(),
    };

    setDownloadQueue((prev) => [newJob, ...prev]);
    showToast('Download Queued', `Extracting ${format.toUpperCase()} for "${track.title}"`, 'info');

    try {
      const targetUrl = track.url || `https://www.youtube.com/watch?v=${track.videoId}`;

      // Fast prepare and rapid 350ms polling
      let directDownloadUrl: string | null = null;
      try {
        const prepareParams = new URLSearchParams({
          url: targetUrl,
          id: track.videoId,
          format,
          quality,
        });

        const prepRes = await fetch(`/api/download/prepare?${prepareParams.toString()}`);
        if (prepRes.ok) {
          const prepData = await prepRes.json();
          if (prepData.ready && prepData.downloadUrl) {
            directDownloadUrl = prepData.downloadUrl;
            setDownloadQueue((prev) =>
              prev.map((job) => (job.id === jobId ? { ...job, progress: 95, status: 'downloading' } : job))
            );
          } else if (prepData.jobId) {
            setDownloadQueue((prev) =>
              prev.map((job) => (job.id === jobId ? { ...job, progress: 35, status: 'converting' } : job))
            );

            for (let i = 0; i < 35; i++) {
              await new Promise((r) => setTimeout(r, 350));
              const progParams = new URLSearchParams({
                id: prepData.jobId,
                progressUrl: prepData.progressUrl || '',
                cacheKey: prepData.cacheKey || '',
              });
              const pRes = await fetch(`/api/download/progress?${progParams.toString()}`);
              if (pRes.ok) {
                const pData = await pRes.json();
                if (pData.progress) {
                  setDownloadQueue((prev) =>
                    prev.map((job) => (job.id === jobId ? { ...job, progress: Math.max(35, Math.min(92, pData.progress)), status: 'downloading' } : job))
                  );
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
        console.warn('Quick download prepare note:', prepErr);
      }

      setDownloadQueue((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, progress: 95, status: 'downloading' } : job))
      );

      if (directDownloadUrl) {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = directDownloadUrl;
        link.download = `${cleanTitle}.${format}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        link.remove();

        setDownloadQueue((prev) =>
          prev.map((job) => (job.id === jobId ? { ...job, progress: 100, status: 'completed' } : job))
        );

        showToast(
          'Download Complete',
          `Successfully initiated download for "${track.title}.${format}"!`,
          'success'
        );
        return;
      }

      const queryParams = new URLSearchParams({
        url: targetUrl,
        id: track.videoId,
        format,
        quality,
        title: cleanTitle,
      });
      const res = await fetch(`/api/download?${queryParams.toString()}`);
      if (!res.ok) {
        let errMessage = `Download error (${res.status})`;
        try {
          const json = await res.json();
          if (json.error) errMessage = json.error;
        } catch {}

        if (res.status === 404) {
          errMessage = 'Download service endpoint or track media not found (404). Please try another format.';
        } else if (res.status === 429) {
          errMessage = 'Too many requests. Please wait a moment before downloading again.';
        } else if (res.status === 503 || res.status === 504) {
          errMessage = 'Media conversion engine is busy. Please try another format or link.';
        }
        throw new Error(errMessage);
      }
      const blob = await res.blob();

      if (!blob || blob.size === 0) {
        throw new Error('Received empty media buffer from server');
      }

      // Safe Blob Object download trigger
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = blobUrl;
      link.download = `${cleanTitle}.${format}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(blobUrl);
      link.remove();

      setDownloadQueue((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, progress: 100, status: 'completed' } : job))
      );

      showToast(
        'Download Complete',
        `Successfully saved "${track.title}.${format}" to your device!`,
        'success'
      );
    } catch (err: any) {
      console.error('Quick download error:', err);
      setDownloadQueue((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, status: 'error' } : job))
      );
      showToast(
        'Download Failed',
        err.message || 'The video stream could not be downloaded.',
        'error'
      );
    }
  };

  const handleStartDownload = (
    track: Track, 
    format: 'mp3' | 'm4a' | 'flac' | 'mp4', 
    quality: string, 
    fileSize: string
  ) => {
    const jobId = `${track.videoId}-${Date.now()}`;
    const newJob: DownloadJob = {
      id: jobId,
      track,
      format,
      quality,
      progress: 100,
      status: 'completed',
      fileSize,
      timestamp: Date.now(),
    };

    setDownloadQueue((prev) => [newJob, ...prev]);
    showToast(
      'Download Started',
      `Downloading "${track.title}" (${format.toUpperCase()})`,
      'success'
    );
  };

  const baseTracks = useMemo(() => {
    const rawList = results.length > 0 ? results : trendingTracks;
    const seen = new Set<string>();
    return rawList.filter((track) => {
      if (!track || !track.videoId) return false;
      if (seen.has(track.videoId)) return false;
      seen.add(track.videoId);
      return true;
    });
  }, [results, trendingTracks]);

  const displayedTracks = useMemo(() => {
    let list = [...baseTracks];

    // 1. In-section search filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.author?.name?.toLowerCase().includes(q) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    // 2. Duration filter
    if (durationFilter !== 'all') {
      list = list.filter((t) => {
        const secs = parseDurationToSeconds(t.timestamp);
        if (durationFilter === 'short') return secs < 180;
        if (durationFilter === 'medium') return secs >= 180 && secs <= 300;
        if (durationFilter === 'long') return secs > 300;
        return true;
      });
    }

    // 3. Sorting
    list.sort((a, b) => {
      if (sortBy === 'popular') {
        const vA = typeof a.views === 'number' ? a.views : parseInt(String(a.views || 0), 10) || 0;
        const vB = typeof b.views === 'number' ? b.views : parseInt(String(b.views || 0), 10) || 0;
        return vB - vA;
      }
      if (sortBy === 'duration-asc') {
        return parseDurationToSeconds(a.timestamp) - parseDurationToSeconds(b.timestamp);
      }
      if (sortBy === 'duration-desc') {
        return parseDurationToSeconds(b.timestamp) - parseDurationToSeconds(a.timestamp);
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'newest') {
        const getAgoWeight = (str?: string) => {
          if (!str) return 9999;
          const s = str.toLowerCase();
          if (s.includes('hour') || s.includes('day')) return 1;
          if (s.includes('week')) return 7;
          if (s.includes('month')) return 30;
          if (s.includes('year')) {
            const y = parseInt(s, 10) || 1;
            return y * 365;
          }
          return 500;
        };
        return getAgoWeight(a.ago) - getAgoWeight(b.ago);
      }
      return 0;
    });

    return list;
  }, [baseTracks, searchFilter, durationFilter, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    durationFilter !== 'all' ||
    searchFilter.trim() !== '' ||
    sortBy !== 'popular';

  const handleResetAllFilters = () => {
    setSelectedCategory('all');
    setDurationFilter('all');
    setSearchFilter('');
    setSortBy('popular');
    if (results.length > 0) {
      setResults([]);
      setSearchedArtist(null);
      setQuery('');
    }
  };

  const categories = [
    'All',
    'Trending',
    'Kenyan & East Africa',
    'Afrobeats',
    'Hip-Hop',
    'Pop',
    'Latin',
    'R&B',
    'Rock',
    'Acoustic',
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-24 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top duration-300">
          <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 ${
            toast.type === 'success' 
              ? 'bg-[#141a26] border-emerald-500/50 text-emerald-300' 
              : toast.type === 'error'
              ? 'bg-[#141a26] border-red-500/50 text-red-300'
              : 'bg-[#141a26] border-cyan-500/50 text-cyan-300'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />}
            
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug truncate">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <Navbar
        onSearchClick={() => {
          document.getElementById('main-search-input')?.focus();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeDownloads={downloadQueue}
        onOpenQueue={() => setIsQueueOpen(true)}
        onSelectCategory={handleCategorySelect}
        selectedCategory={selectedCategory}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Hero & Search Engine */}
        <HeroSearch
          onSearch={handleSearch}
          isLoading={isLoading}
          onQuickFormatSelect={(fmt) => setFormatFilter(fmt)}
        />

        {/* Results / Trending Section */}
        <section 
          ref={resultsSectionRef} 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" 
          id="results-section"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#1e2638]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#141a26] border border-[#242f44] text-cyan-400">
                {results.length > 0 ? (
                  <Search className="w-5 h-5" />
                ) : (
                  <Flame className="w-5 h-5 fill-cyan-400/20" />
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display flex items-center gap-2">
                  {results.length > 0 ? (
                    <>
                      <span>Search Results for</span>
                      <span className="text-cyan-400">"{query}"</span>
                    </>
                  ) : (
                    <>
                      <span>Trending Now</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/70 text-cyan-400 border border-cyan-800/50 font-bold">
                        HOT
                      </span>
                    </>
                  )}
                </h2>
                <p className="text-xs text-slate-400">
                  {results.length > 0 
                    ? `Showing ${results.length} tracks available for MP3 & MP4 download`
                    : 'Top global songs and charts everyone is downloading today'}
                </p>
              </div>
            </div>
          </div>

          {/* Real Artist Profile Banner when artist is searched */}
          {searchedArtist && results.length > 0 && (
            <ArtistProfileCard
              artist={searchedArtist}
              totalTracksCount={results.length}
              onPlayTopTrack={() => results[0] && handlePlayPreview(results[0])}
            />
          )}

          {/* Optimized Trending Filters Bar: Genre, Search, Sort & View Mode */}
          <TrendingFilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            sortBy={sortBy}
            onSortChange={(s) => setSortBy(s)}
            durationFilter={durationFilter}
            onDurationChange={(d) => setDurationFilter(d)}
            searchFilter={searchFilter}
            onSearchFilterChange={(q) => setSearchFilter(q)}
            viewMode={viewMode}
            onViewModeChange={(m) => setViewMode(m)}
            totalTracks={baseTracks.length}
            filteredCount={displayedTracks.length}
            hasActiveFilters={hasActiveFilters}
            onResetAllFilters={handleResetAllFilters}
            isSearching={results.length > 0}
          />

          {/* Loading Skeleton or Track Grid / List */}
          {isLoading ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5" : "space-y-3"}>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#141a26] border border-[#1e2638] space-y-3 animate-pulse">
                  <div className="aspect-video w-full rounded-xl bg-[#1e2638]" />
                  <div className="h-4 bg-[#1e2638] rounded w-3/4" />
                  <div className="h-3 bg-[#1e2638]/60 rounded w-1/2" />
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="h-8 bg-[#1e2638]/80 rounded-xl" />
                    <div className="h-8 bg-[#1e2638]/80 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedTracks.length === 0 ? (
            <div className="text-center py-16 bg-[#141a26] rounded-3xl border border-[#1e2638] px-4">
              <Headphones className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white font-display">No matching tracks found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                No songs matched your current filter criteria ({searchFilter ? `"${searchFilter}"` : selectedCategory}). Try clearing your search or resetting filters.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                {hasActiveFilters && (
                  <button
                    onClick={handleResetAllFilters}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                )}
                <button
                  onClick={() => fetchTrending('all')}
                  className="px-4 py-2 rounded-xl bg-[#1c2436] hover:bg-[#27344e] text-slate-200 font-semibold text-xs inline-flex items-center gap-2 transition-all border border-[#2e3e5c] cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Reload Trending Tracks</span>
                </button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {displayedTracks.map((track, idx) => (
                <TrackCard
                  key={`${track.videoId}-${idx}`}
                  track={track}
                  onDownload={(t, fmt) => handleQuickDownload(t, fmt)}
                  onOpenModal={(t) => {
                    setSelectedTrack(t);
                    setIsModalOpen(true);
                  }}
                  onPlayPreview={(t) => handlePlayPreview(t)}
                  isPlaying={currentPlaybackTrack?.videoId === track.videoId && isPlaying}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayedTracks.map((track, idx) => (
                <TrackListItem
                  key={`${track.videoId}-${idx}`}
                  track={track}
                  index={idx}
                  onDownload={(t, fmt) => handleQuickDownload(t, fmt)}
                  onOpenModal={(t) => {
                    setSelectedTrack(t);
                    setIsModalOpen(true);
                  }}
                  onPlayPreview={(t) => handlePlayPreview(t)}
                  isPlaying={currentPlaybackTrack?.videoId === track.videoId && isPlaying}
                />
              ))}
            </div>
          )}

        </section>

        {/* How It Works 3-Step Section */}
        <HowItWorks />

        {/* Feature Highlights & Badges */}
        <FeatureHighlights />

        {/* FAQ Section */}
        <FAQSection />

      </main>

      {/* Footer */}
      <Footer />

      {/* Download / Bitrate Selection Modal */}
      <DownloadModal
        track={selectedTrack}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartDownload={(t, fmt, qual, sz) => handleStartDownload(t, fmt, qual, sz)}
        onPlayPreview={(t) => handlePlayPreview(t)}
        isPlaying={currentPlaybackTrack?.videoId === selectedTrack?.videoId && isPlaying}
      />

      {/* Downloads Manager Drawer */}
      <DownloadQueueDrawer
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        downloads={downloadQueue}
        onClearHistory={() => setDownloadQueue([])}
        onRedownload={(job) => handleQuickDownload(job.track, job.format === 'mp4' ? 'mp4' : 'mp3')}
      />

      {/* Bottom Floating Audio Player Previewer */}
      {currentPlaybackTrack && (
        <AudioPlayerBar
          track={currentPlaybackTrack}
          isPlaying={isPlaying}
          currentTime={playbackTime}
          duration={playbackDuration}
          onTogglePlay={handleTogglePlay}
          onSeek={handleSeek}
          onClose={handleClosePlayer}
          onNext={handleNextTrack}
          onPrev={handlePrevTrack}
          onDownload={(t) => {
            setSelectedTrack(t);
            setIsModalOpen(true);
          }}
        />
      )}

      {/* PWA New Version Update Toast */}
      <PWAUpdateToast
        registration={swWaitingRegistration}
        onDismiss={() => setSwWaitingRegistration(null)}
      />

      {/* Authentication Modal (Firebase Google OAuth & Email/Password) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(email) => {
          showToast('Account Connected', `Signed in as ${email || 'user'}`, 'success');
        }}
      />

    </div>
  );
}
