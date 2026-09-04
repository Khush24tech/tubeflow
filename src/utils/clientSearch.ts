import { Track } from '../types';
import { CURATED_TRACKS } from '../data/curatedTracks';

/**
 * Parses YouTube video ID from URL or returns null
 */
export function extractYouTubeId(query: string): string | null {
  const urlPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = query.match(urlPattern);
  if (match) return match[1];

  // If directly entered an 11-char YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(query.trim())) {
    return query.trim();
  }
  return null;
}

/**
 * Format milliseconds to MM:SS string
 */
function formatMillisToTimestamp(millis: number): string {
  if (!millis || isNaN(millis)) return '3:30';
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

/**
 * Fallback client-side search engine.
 * Used when running on GitHub Pages (static), offline, or when backend API is unreachable.
 */
export async function performClientFallbackSearch(query: string): Promise<Track[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // 1. Check if user pasted direct YouTube URL or Video ID
  const directId = extractYouTubeId(trimmed);
  if (directId) {
    // Check if it already exists in our curated database for exact metadata
    const existing = CURATED_TRACKS.find(t => t.videoId === directId);
    if (existing) {
      return [existing];
    }
    return [{
      videoId: directId,
      title: `YouTube Video (${directId})`,
      author: { name: 'YouTube Creator' },
      timestamp: '3:45',
      views: 1250000,
      ago: 'Uploaded on YouTube',
      thumbnail: `https://i.ytimg.com/vi/${directId}/hqdefault.jpg`,
      category: 'Pop',
      url: `https://www.youtube.com/watch?v=${directId}`
    }];
  }

  // 2. Search local curated tracks
  const lowerQuery = trimmed.toLowerCase();
  const queryTokens = lowerQuery.split(/\s+/).filter(Boolean);
  
  const localMatches = CURATED_TRACKS.filter(track => {
    const titleLower = track.title.toLowerCase();
    const artistLower = track.author.name.toLowerCase();
    const categoryLower = (track.category || '').toLowerCase();
    
    // Exact or token match
    return (
      titleLower.includes(lowerQuery) ||
      artistLower.includes(lowerQuery) ||
      categoryLower.includes(lowerQuery) ||
      queryTokens.some(token => titleLower.includes(token) || artistLower.includes(token))
    );
  });

  // 3. Query online open CORS-friendly iTunes Music API for live millions-of-songs discovery
  try {
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(trimmed)}&entity=song&limit=15`;
    const res = await fetch(itunesUrl, { mode: 'cors' });
    if (res.ok) {
      const data = await res.json();
      if (data.results && Array.isArray(data.results) && data.results.length > 0) {
        const itunesTracks: Track[] = data.results.map((item: any) => {
          // Generate a deterministic pseudo-id or find closest matching curated track
          const matchedCurated = CURATED_TRACKS.find(
            t => t.title.toLowerCase().includes(item.trackName?.toLowerCase()) ||
                 t.author.name.toLowerCase().includes(item.artistName?.toLowerCase())
          );

          // Get higher resolution artwork (600x600 instead of 100x100)
          const artwork = item.artworkUrl100
            ? item.artworkUrl100.replace('100x100bb', '600x600bb')
            : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop';

          return {
            videoId: matchedCurated ? matchedCurated.videoId : `yt_${item.trackId}`,
            title: `${item.artistName} - ${item.trackName}`,
            author: { name: item.artistName || 'Unknown Artist' },
            timestamp: formatMillisToTimestamp(item.trackTimeMillis),
            views: Math.floor(Math.random() * 50000000) + 1000000,
            ago: item.releaseDate ? `${new Date(item.releaseDate).getFullYear()}` : 'Popular Track',
            thumbnail: artwork,
            category: item.primaryGenreName || 'Pop',
            url: item.trackViewUrl || undefined
          };
        });

        // Merge local matches with itunes tracks, avoiding duplicates by title
        const combined = [...localMatches];
        for (const track of itunesTracks) {
          if (!combined.some(t => t.title.toLowerCase() === track.title.toLowerCase())) {
            combined.push(track);
          }
        }
        return combined;
      }
    }
  } catch (onlineErr) {
    console.warn('[Search] Online fallback API error, using local catalog matches:', onlineErr);
  }

  // Return local matches or top trending if nothing matched
  if (localMatches.length > 0) {
    return localMatches;
  }

  // If user searched something obscure with no direct match offline, return top popular tracks
  return CURATED_TRACKS.slice(0, 8);
}
