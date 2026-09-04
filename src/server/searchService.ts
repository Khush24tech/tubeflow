import { Innertube } from "youtubei.js";
import { CURATED_TRACKS, findArtistProfile } from "../data/curatedTracks.ts";

let ytClient: Innertube | null = null;
export async function getYouTubeClient(): Promise<Innertube> {
  if (!ytClient) {
    ytClient = await Innertube.create({ lang: "en" });
  }
  return ytClient;
}

export function extractVideoId(query: string): string | null {
  const urlPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = query.match(urlPattern);
  return match ? match[1] : null;
}

export function parseSafeTitle(rawTitle: any): string {
  if (!rawTitle) return "Unknown Title";
  if (typeof rawTitle === "string") return rawTitle.trim();
  if (typeof rawTitle.text === "string") return rawTitle.text.trim();
  if (Array.isArray(rawTitle.runs)) {
    const joined = rawTitle.runs.map((r: any) => r?.text || "").join("").trim();
    if (joined) return joined;
  }
  try {
    const str = String(rawTitle);
    return str === "[object Object]" ? "Unknown Title" : str.trim();
  } catch {
    return "Unknown Title";
  }
}

export function parseSafeAuthor(rawAuthor: any): string {
  if (!rawAuthor) return "Unknown Artist";
  if (typeof rawAuthor === "string") return rawAuthor.trim();
  if (typeof rawAuthor.name === "string") return rawAuthor.name.trim();
  if (typeof rawAuthor.text === "string") return rawAuthor.text.trim();
  if (Array.isArray(rawAuthor.runs)) {
    const joined = rawAuthor.runs.map((r: any) => r?.text || "").join("").trim();
    if (joined) return joined;
  }
  try {
    const str = String(rawAuthor);
    return str === "[object Object]" ? "Unknown Artist" : str.trim();
  } catch {
    return "Unknown Artist";
  }
}

export async function resolveArtistProfile(
  query: string,
  channelArtist: any | null,
  topVideoAuthor?: string
): Promise<any | null> {
  // 1. Official YouTube channel info
  if (channelArtist && channelArtist.picture) {
    return channelArtist;
  }

  // 2. Curated artist profile
  const curated = findArtistProfile(query);
  if (curated) return curated;

  const qTrim = query.trim();

  // 3. Dynamic lookup via Deezer API
  try {
    const deezerRes = await fetch(
      `https://api.deezer.com/search/artist?q=${encodeURIComponent(qTrim)}&limit=1`,
      { signal: AbortSignal.timeout(3500) }
    );
    if (deezerRes.ok) {
      const d = await deezerRes.json();
      if (d.data && Array.isArray(d.data) && d.data[0]) {
        const a = d.data[0];
        const qNorm = qTrim.toLowerCase();
        const aNorm = a.name.toLowerCase();
        if (qNorm.includes(aNorm) || aNorm.includes(qNorm) || (a.nb_fan && a.nb_fan > 50)) {
          return {
            id: a.id,
            name: a.name,
            picture: a.picture_xl || a.picture_big || a.picture_medium || a.picture,
            fans: a.nb_fan || 100000,
            monthlyListeners: a.nb_fan ? `${Number(a.nb_fan).toLocaleString()} Fans` : "Popular Artist",
            genre: "Verified Global Artist",
            verified: true,
            bio: `Explore top releases and discography from ${a.name}.`
          };
        }
      }
    }
  } catch {}

  // 4. iTunes Search API lookup
  try {
    const itunesRes = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(qTrim)}&entity=musicArtist&limit=1`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (itunesRes.ok) {
      const itunesData = await itunesRes.json();
      if (itunesData.results && itunesData.results.length > 0) {
        const art = itunesData.results[0];
        return {
          name: art.artistName,
          picture: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop",
          genre: art.primaryGenreName || "Music",
          verified: true,
          bio: `Verified artist profile for ${art.artistName}.`
        };
      }
    }
  } catch {}

  // 5. Top video author match
  if (topVideoAuthor && qTrim.toLowerCase() === topVideoAuthor.toLowerCase().trim()) {
    return {
      name: topVideoAuthor,
      picture: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop",
      genre: "YouTube Music Artist",
      verified: true,
      bio: `Official videos and releases by ${topVideoAuthor}.`
    };
  }

  return null;
}

export async function searchYouTubeWebDirect(query: string): Promise<any[]> {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%253D%253D`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return [];
    const html = await res.text();
    const match = html.match(/var ytInitialData = ({.*?});<\/script>/s) || html.match(/ytInitialData\s*=\s*({.+?});/s);
    if (!match) return [];
    const data = JSON.parse(match[1]);
    const videos: any[] = [];
    
    function findVideos(obj: any) {
      if (!obj || typeof obj !== "object") return;
      if (obj.videoRenderer) {
        const vr = obj.videoRenderer;
        const id = vr.videoId;
        const title = vr.title?.runs?.map((r: any) => r.text).join("") || vr.title?.simpleText || "";
        const author = vr.ownerText?.runs?.[0]?.text || vr.longBylineText?.runs?.[0]?.text || "";
        const timestamp = vr.lengthText?.simpleText || vr.lengthText?.runs?.[0]?.text || "3:30";
        const views = vr.viewCountText?.simpleText || vr.shortViewCountText?.simpleText || "100K views";
        const ago = vr.publishedTimeText?.simpleText || "Recent";
        const thumbnail = vr.thumbnail?.thumbnails?.[vr.thumbnail.thumbnails.length - 1]?.url || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
        
        if (id && typeof id === "string" && id.length === 11 && title) {
          if (!videos.some(v => v.videoId === id)) {
            videos.push({
              videoId: id,
              title,
              author: { name: author || "YouTube Artist" },
              timestamp,
              views,
              ago,
              thumbnail,
              url: `https://www.youtube.com/watch?v=${id}`
            });
          }
        }
      }
      for (const k of Object.keys(obj)) {
        if (videos.length >= 24) break;
        findVideos(obj[k]);
      }
    }
    
    findVideos(data);
    return videos;
  } catch (err) {
    console.warn("Direct YouTube web search notice:", err);
    return [];
  }
}

export async function executeSearch(rawQ: any): Promise<{
  results: any[];
  artist?: any;
  type: string;
  query: string;
  count: number;
}> {
  const query = typeof rawQ === "string" ? rawQ.trim() : String(rawQ || "").trim();
  if (!query) {
    throw new Error("Query parameter 'q' is required");
  }

  const videoId = extractVideoId(query);

  // 1. Direct Video ID / URL lookup
  if (videoId) {
    try {
      const yt = await getYouTubeClient();
      const info = await yt.getInfo(videoId);
      if (info && info.basic_info) {
        const directTitle = parseSafeTitle(info.basic_info.title);
        const directAuthor = parseSafeAuthor(info.basic_info.author);
        return {
          results: [
            {
              videoId,
              title: directTitle,
              author: { name: directAuthor },
              timestamp: info.basic_info.duration ? `${Math.floor(info.basic_info.duration / 60)}:${String(info.basic_info.duration % 60).padStart(2, "0")}` : "3:30",
              views: info.basic_info.view_count || 100000,
              ago: "Recent",
              thumbnail: info.basic_info.thumbnail?.[0]?.url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
              description: info.basic_info.short_description || "",
              url: `https://www.youtube.com/watch?v=${videoId}`
            }
          ],
          type: "direct_video",
          query,
          count: 1
        };
      }
    } catch (err) {
      console.warn("Direct video lookup via Innertube notice:", err);
    }
  }

  // 2. Search query with Innertube (youtubei.js)
  try {
    const yt = await getYouTubeClient();
    const searchResults = await yt.search(query, { type: "video" });
    
    let channelArtist: any = null;
    const videos: any[] = [];
    const rawList = (searchResults as any).results || (searchResults as any).videos || [];

    const processItem = (item: any) => {
      if (!item) return;
      const vidId = item.id || item.videoId;
      const idStr = typeof vidId === "string" ? vidId.trim() : "";

      if (item.type === "Channel" || (idStr.startsWith("UC") && idStr.length > 15)) {
        if (!channelArtist) {
          const chName = item.author?.name || parseSafeTitle(item.title) || query;
          const chPic = item.author?.thumbnails?.[0]?.url || item.thumbnails?.[0]?.url || item.thumbnail;
          const chSubs = item.subscriber_count?.text || item.video_count?.text || item.subscribers?.text || "Official Channel";
          channelArtist = {
            name: chName,
            picture: chPic,
            fans: chSubs,
            monthlyListeners: chSubs,
            genre: "Official YouTube Artist",
            verified: item.author?.is_verified_artist ?? true,
            bio: `Official channel & discography for ${chName} on Tubeflow.`
          };
        }
        return;
      }

      const validId = idStr && idStr.length === 11 ? idStr : null;
      if (!validId) return;

      const title = parseSafeTitle(item.title);
      const author = parseSafeAuthor(item.author?.name || item.author);
      const timestamp = item.duration?.text || (item.duration?.seconds ? `${Math.floor(item.duration.seconds / 60)}:${String(item.duration.seconds % 60).padStart(2, "0")}` : "3:30");
      const views = item.view_count?.text || (item.views ? `${item.views} views` : "100K views");
      const ago = item.published?.text || "Recent";
      const thumbnail = item.thumbnails?.[0]?.url || item.thumbnail?.thumbnails?.[0]?.url || `https://i.ytimg.com/vi/${validId}/hqdefault.jpg`;

      if (!videos.some(v => v.videoId === validId)) {
        videos.push({
          videoId: validId,
          title,
          author: { name: author },
          timestamp,
          views,
          ago,
          thumbnail,
          url: `https://www.youtube.com/watch?v=${validId}`
        });
      }
    };

    for (const item of rawList) {
      processItem(item);
      if (item.contents && Array.isArray(item.contents)) {
        for (const sub of item.contents) processItem(sub);
      }
      if (videos.length >= 24) break;
    }

    if (videos.length > 0) {
      const topAuthor = videos[0]?.author?.name;
      const matchedArtist = await resolveArtistProfile(query, channelArtist, topAuthor);
      return {
        results: videos,
        artist: matchedArtist || undefined,
        type: "search",
        query,
        count: videos.length
      };
    }
  } catch (innerSearchErr) {
    console.warn("Innertube search error, trying direct web search:", innerSearchErr);
  }

  // 3. Direct YouTube Web search (bulletproof on cloud datacenter IPs)
  try {
    let webVideos = await searchYouTubeWebDirect(query);
    
    if (webVideos.length < 5) {
      const extraVideos = await searchYouTubeWebDirect(`${query} songs`);
      for (const ev of extraVideos) {
        if (!webVideos.some(v => v.videoId === ev.videoId)) {
          webVideos.push(ev);
        }
        if (webVideos.length >= 24) break;
      }
    }

    if (webVideos.length > 0) {
      const topAuthor = webVideos[0]?.author?.name;
      const matchedArtist = await resolveArtistProfile(query, null, topAuthor);
      return {
        results: webVideos,
        artist: matchedArtist || undefined,
        type: "web_search",
        query,
        count: webVideos.length
      };
    }
  } catch (webErr) {
    console.warn("Direct YouTube web search fallback error:", webErr);
  }

  // 4. Curated catalog search
  const qLower = query.toLowerCase();
  const matchedArtist = await resolveArtistProfile(query, null);
  const curatedMatches = CURATED_TRACKS.filter(item => {
    const t = parseSafeTitle(item.title).toLowerCase();
    const a = parseSafeAuthor(item.author?.name).toLowerCase();
    return t.includes(qLower) || a.includes(qLower);
  });

  if (curatedMatches.length > 0) {
    return {
      results: curatedMatches,
      artist: matchedArtist || undefined,
      type: "curated_match",
      query,
      count: curatedMatches.length
    };
  }

  // 5. iTunes search fallback with strict artist matching
  try {
    const itunesRes = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=25`,
      { signal: AbortSignal.timeout(3500) }
    );
    if (itunesRes.ok) {
      const itunesData = await itunesRes.json();
      if (itunesData.results && itunesData.results.length > 0) {
        const filteredSongs = itunesData.results.filter((song: any) => {
          const artLower = (song.artistName || "").toLowerCase();
          const trackLower = (song.trackName || "").toLowerCase();
          if (qLower.length <= 4) {
            return artLower.includes(qLower);
          }
          return artLower.includes(qLower) || trackLower.includes(qLower);
        });

        if (filteredSongs.length > 0) {
          const itunesTracks = filteredSongs.map((song: any) => ({
            videoId: `yt_${song.trackId}`,
            title: `${song.artistName} - ${song.trackName}`,
            author: { name: song.artistName },
            timestamp: song.trackTimeMillis ? `${Math.floor(song.trackTimeMillis / 60000)}:${String(Math.floor((song.trackTimeMillis % 60000) / 1000)).padStart(2, "0")}` : "3:30",
            views: "1.5M views",
            ago: song.releaseDate ? `${new Date(song.releaseDate).getFullYear()}` : "Latest",
            thumbnail: song.artworkUrl100 ? song.artworkUrl100.replace("100x100bb", "600x600bb") : "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop",
            previewUrl: song.previewUrl,
            category: song.primaryGenreName || "Music",
            url: song.trackViewUrl
          }));

          const resolvedArtist = await resolveArtistProfile(query, null, filteredSongs[0].artistName);
          return {
            results: itunesTracks,
            artist: resolvedArtist || undefined,
            type: "itunes_fallback",
            query,
            count: itunesTracks.length
          };
        }
      }
    }
  } catch {}

  // 6. Global fallback
  return {
    results: CURATED_TRACKS.slice(0, 12),
    artist: matchedArtist || undefined,
    type: "curated_fallback",
    query,
    count: Math.min(12, CURATED_TRACKS.length)
  };
}
