import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import cors from "cors";
import { createServer as createViteServer } from "vite";
// @ts-ignore - yt-search does not have strict types
import yts from "yt-search";
// @ts-ignore
import ytdl from "@distube/ytdl-core";
import { Innertube } from "youtubei.js";
import { getFirebaseAdminApp, getFirebaseAdminStatus, verifyFirebaseIdToken } from "./src/server/firebaseAdmin";
import { CURATED_TRACKS, getCuratedTracksByCategory, findArtistProfile } from "./src/data/curatedTracks";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let ytClient: Innertube | null = null;
async function getYouTubeClient(): Promise<Innertube> {
  if (!ytClient) {
    ytClient = await Innertube.create({ lang: "en", location: "US", retrieve_player: true });
  }
  return ytClient;
}

// Helper to extract YouTube video ID from URL or return original query
function extractVideoId(query: string): string | null {
  const urlPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = query.match(urlPattern);
  return match ? match[1] : null;
}

// Curated top trending tracks fallback & starter list
const CURATED_TRENDING = CURATED_TRACKS;

// Safe text parsers to prevent TypeError: title.trim is not a function
function parseSafeTitle(rawTitle: any): string {
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

function parseSafeAuthor(rawAuthor: any): string {
  if (!rawAuthor) return "Unknown Artist";
  if (typeof rawAuthor === "string") return rawAuthor.trim();
  if (typeof rawAuthor.name === "string") return rawAuthor.name.trim();
  if (typeof rawAuthor.text === "string") return rawAuthor.text.trim();
  try {
    const str = String(rawAuthor);
    return str === "[object Object]" ? "Unknown Artist" : str.trim();
  } catch {
    return "Unknown Artist";
  }
}

// 1. Search API endpoint (Powered by Innertube & youtubei.js)
app.get("/api/search", async (req: Request, res: Response) => {
  try {
    const rawQ = req.query.q;
    const query = typeof rawQ === "string" ? rawQ.trim() : String(rawQ || "").trim();
    if (!query) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
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
          return res.json({
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
            query
          });
        }
      } catch (err) {
        console.warn("Direct video lookup via Innertube notice:", err);
      }
    }

    // 2. Search query with Innertube (youtubei.js)
    try {
      const yt = await getYouTubeClient();
      const searchResults = await yt.search(query, { type: "video" });
      
      const videos: any[] = [];
      const rawList = (searchResults as any).results || (searchResults as any).videos || [];

      for (const item of rawList) {
        const vidId = item.id || item.videoId;
        if (!vidId || typeof vidId !== "string") continue;

        const itemTitle = parseSafeTitle(item.title);
        const itemAuthor = parseSafeAuthor(item.author);
        const itemDuration = typeof item.duration?.text === "string" 
          ? item.duration.text 
          : (typeof item.duration?.toString === "function" ? item.duration.toString() : "3:45");
        const itemThumbnail = item.thumbnails?.[0]?.url || item.thumbnail || `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`;
        const itemViews = item.short_view_count?.text || item.view_count?.text || "1.2M views";

        videos.push({
          videoId: vidId,
          title: itemTitle,
          author: { name: itemAuthor },
          timestamp: itemDuration,
          views: itemViews,
          ago: item.published?.text || "Recent",
          thumbnail: itemThumbnail,
          description: item.description || "",
          url: `https://www.youtube.com/watch?v=${vidId}`
        });

        if (videos.length >= 24) break;
      }

      const matchedArtist = findArtistProfile(query);

      if (videos.length > 0) {
        return res.json({
          results: videos,
          artist: matchedArtist || undefined,
          type: "search",
          query,
          count: videos.length
        });
      }
    } catch (innerSearchErr) {
      console.warn("Innertube search error, falling back to curated library:", innerSearchErr);
    }

    // 3. Curated filter fallback
    const qLower = query.toLowerCase();
    const matchedArtist = findArtistProfile(query);
    const filtered = CURATED_TRENDING.filter(item => {
      const t = parseSafeTitle(item.title).toLowerCase();
      const a = parseSafeAuthor(item.author?.name).toLowerCase();
      return t.includes(qLower) || a.includes(qLower);
    });

    return res.json({
      results: filtered.length > 0 ? filtered : CURATED_TRENDING,
      artist: matchedArtist || undefined,
      fallback: true,
      query
    });
  } catch (error: any) {
    console.error("Search error:", error);
    const fallbackQ = (req.query.q as string) || "";
    return res.json({
      results: CURATED_TRENDING,
      artist: findArtistProfile(fallbackQ) || undefined,
      fallback: true,
      query: fallbackQ
    });
  }
});

// 2. Trending / Top Charts API
app.get("/api/trending", async (req: Request, res: Response) => {
  try {
    const category = (req.query.category as string || "all").toLowerCase();
    
    // Attempt live trending query via Innertube
    if (category !== "all") {
      try {
        const yt = await getYouTubeClient();
        const liveResults = await yt.search(`top ${category} hit songs music`, { type: "video" });
        const rawList = (liveResults as any).results || (liveResults as any).videos || [];
        const mapped: any[] = [];

        for (const item of rawList) {
          const vidId = item.id || item.videoId;
          if (!vidId || typeof vidId !== "string") continue;

          mapped.push({
            videoId: vidId,
            title: parseSafeTitle(item.title),
            author: { name: parseSafeAuthor(item.author) },
            timestamp: typeof item.duration?.text === "string" ? item.duration.text : "3:30",
            views: item.short_view_count?.text || "1.5M views",
            ago: "Trending",
            thumbnail: item.thumbnails?.[0]?.url || `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`,
            category: category.toUpperCase()
          });

          if (mapped.length >= 16) break;
        }

        if (mapped.length > 0) {
          return res.json({ trending: mapped, category });
        }
      } catch (trendErr) {
        console.warn("Innertube trending fetch error, using curated:", trendErr);
      }
    }

    return res.json({ trending: CURATED_TRENDING, category: "all" });
  } catch (error) {
    console.error("Trending error:", error);
    return res.json({ trending: CURATED_TRENDING, category: "all" });
  }
});

// 3. Track Details API with download options & simulated/real formats
app.get("/api/track/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let trackInfo: any = null;

    try {
      trackInfo = await yts({ videoId: id });
    } catch {
      // Fallback from curated list
      trackInfo = CURATED_TRENDING.find(t => t.videoId === id) || {
        videoId: id,
        title: "Selected Music Track",
        author: { name: "Artist" },
        timestamp: "3:30",
        views: 1250000,
        ago: "Recent",
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
      };
    }

    // Estimate file sizes based on duration (avg ~3.5 min)
    const formats = {
      audio: [
        { format: "mp3", quality: "320 kbps (High Fidelity)", size: "8.4 MB", ext: "mp3", mime: "audio/mpeg" },
        { format: "mp3", quality: "256 kbps (Standard HQ)", size: "6.8 MB", ext: "mp3", mime: "audio/mpeg" },
        { format: "mp3", quality: "192 kbps (Medium)", size: "5.1 MB", ext: "mp3", mime: "audio/mpeg" },
        { format: "m4a", quality: "256 kbps (AAC Apple Audio)", size: "6.2 MB", ext: "m4a", mime: "audio/mp4" },
        { format: "flac", quality: "Lossless Audio", size: "24.5 MB", ext: "flac", mime: "audio/flac" }
      ],
      video: [
        { format: "mp4", quality: "1080p Full HD (60fps)", size: "54.2 MB", ext: "mp4", mime: "video/mp4" },
        { format: "mp4", quality: "720p HD", size: "28.6 MB", ext: "mp4", mime: "video/mp4" },
        { format: "mp4", quality: "480p SD", size: "14.1 MB", ext: "mp4", mime: "video/mp4" },
        { format: "mp4", quality: "360p Mobile", size: "9.3 MB", ext: "mp4", mime: "video/mp4" }
      ]
    };

    return res.json({
      track: {
        videoId: trackInfo.videoId || id,
        title: trackInfo.title || "Track Title",
        author: trackInfo.author?.name || "Music Artist",
        duration: trackInfo.timestamp || "3:30",
        seconds: trackInfo.seconds || 210,
        views: trackInfo.views || 1000000,
        thumbnail: trackInfo.thumbnail || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        description: trackInfo.description || "",
        url: `https://www.youtube.com/watch?v=${id}`
      },
      formats
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// In-memory cache for ultra-fast instant downloads
interface CachedMedia {
  downloadUrl: string;
  title: string;
  expiresAt: number;
}
const mediaDownloadCache = new Map<string, CachedMedia>();
const pendingConversionJobs = new Map<string, Promise<any>>();

// Helper to map formats to loader.to format strings
function mapToLoaderFormat(format: string, quality?: string): string {
  const f = (format || "mp3").toLowerCase();
  const q = (quality || "").toLowerCase();

  if (f === "mp3") return "mp3";
  if (f === "m4a") return "m4a";
  if (f === "flac") return "flac";
  if (f === "wav") return "wav";

  if (f === "mp4" || f === "video") {
    if (q.includes("1080")) return "1080";
    if (q.includes("720") || q.includes("hd")) return "720";
    if (q.includes("480")) return "480";
    if (q.includes("360")) return "360";
    if (q.includes("4k") || q.includes("2160")) return "4k";
    return "720";
  }

  return "mp3";
}

// 4a. Ultra-Fast Media Conversion Preparation API (with instant cache check)
app.get("/api/download/prepare", async (req: Request, res: Response) => {
  try {
    const rawUrl = (req.query.url as string) || (req.query.id as string);
    const format = ((req.query.format as string) || "mp3").toLowerCase();
    const quality = (req.query.quality as string) || "";
    
    if (!rawUrl) {
      return res.status(400).json({ error: "Missing YouTube URL or video ID" });
    }

    let videoId = rawUrl;
    if (rawUrl.includes("v=")) {
      videoId = rawUrl.split("v=")[1]?.split("&")[0] || rawUrl;
    } else if (rawUrl.includes("youtu.be/")) {
      videoId = rawUrl.split("youtu.be/")[1]?.split("?")[0] || rawUrl;
    }
    const inputUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const loaderFormat = mapToLoaderFormat(format, quality);
    const cacheKey = `${videoId}_${loaderFormat}`;

    // Instant Cache Hit Check
    const cached = mediaDownloadCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return res.json({
        success: true,
        cached: true,
        ready: true,
        downloadUrl: cached.downloadUrl,
        title: cached.title,
        format: loaderFormat,
        progress: 100,
      });
    }

    // Check if an existing conversion job is already active for this track
    if (pendingConversionJobs.has(cacheKey)) {
      const activeJob = await pendingConversionJobs.get(cacheKey);
      return res.json(activeJob);
    }

    // Launch new fast conversion job
    const jobPromise = (async () => {
      const initRes = await fetch(
        `https://loader.to/ajax/download.php?button=1&start=1&end=1&format=${loaderFormat}&url=${encodeURIComponent(inputUrl)}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          }
        }
      );

      if (!initRes.ok) {
        throw new Error("Failed to initialize media converter");
      }

      const initData: any = await initRes.json();
      return {
        success: true,
        jobId: initData.id,
        progressUrl: initData.progress_url || `https://lto2.affadaffa.com/api/progress?id=${initData.id}`,
        title: initData.title || initData.info?.title || "Track",
        format: loaderFormat,
        cacheKey,
      };
    })();

    pendingConversionJobs.set(cacheKey, jobPromise);
    const result = await jobPromise;
    setTimeout(() => pendingConversionJobs.delete(cacheKey), 30000); // clear promise after 30s

    return res.json(result);
  } catch (error: any) {
    console.error("Prepare download error:", error);
    return res.status(500).json({ error: error.message || "Failed to initialize media extraction" });
  }
});

// 4b. Fast media progress status API (with automatic cache saving)
app.get("/api/download/progress", async (req: Request, res: Response) => {
  try {
    const id = req.query.id as string;
    const cacheKey = req.query.cacheKey as string;
    const progressUrl = (req.query.progressUrl as string) || `https://lto2.affadaffa.com/api/progress?id=${id}`;

    if (!id) {
      return res.status(400).json({ error: "Missing job ID" });
    }

    const pRes = await fetch(progressUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      }
    });

    if (!pRes.ok) {
      return res.status(502).json({ error: "Failed to query progress" });
    }

    const data: any = await pRes.json();
    const progressNum = Math.min(100, Math.max(0, Math.round((data.progress || 0) / 10)));
    const isReady = !!data.download_url;

    if (isReady && data.download_url) {
      if (cacheKey) {
        mediaDownloadCache.set(cacheKey, {
          downloadUrl: data.download_url,
          title: parseSafeTitle(data.title) || "Track",
          expiresAt: Date.now() + 2 * 60 * 60 * 1000, // 2 hours TTL
        });
      }
    }

    return res.json({
      progress: isReady ? 100 : Math.max(25, progressNum),
      rawProgress: data.progress,
      text: data.text || (isReady ? "Download ready!" : "Processing media stream..."),
      ready: isReady,
      downloadUrl: isReady && data.download_url ? data.download_url : null
    });
  } catch (error: any) {
    console.error("Progress check error:", error);
    return res.status(500).json({ error: error.message || "Failed to check conversion status" });
  }
});

// 4c. Primary Direct Media Stream & Pass-Through API endpoint (with instant cache acceleration)
app.get("/api/download", async (req: Request, res: Response) => {
  try {
    const rawUrl = (req.query.url as string) || (req.query.id as string);
    const format = ((req.query.format as string) || "mp4").toLowerCase();
    const quality = (req.query.quality as string) || "";
    const rawTitle = (req.query.title as string) || "Tubeflow_Track";
    const cleanTitle = rawTitle.replace(/[/\\?%*:|"<>]/g, "").trim() || "Tubeflow_Track";

    if (!rawUrl) {
      return res.status(400).json({ error: "Missing URL or video ID" });
    }

    let videoId = rawUrl;
    if (rawUrl.includes("v=")) {
      videoId = rawUrl.split("v=")[1]?.split("&")[0] || rawUrl;
    } else if (rawUrl.includes("youtu.be/")) {
      videoId = rawUrl.split("youtu.be/")[1]?.split("?")[0] || rawUrl;
    }

    const inputUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const isAudio = format === "mp3" || format === "m4a" || format === "flac" || format === "wav";
    const loaderFormat = mapToLoaderFormat(format, quality);
    const cacheKey = `${videoId}_${loaderFormat}`;

    let readyDownloadUrl: string | null = null;

    // Check memory cache first
    const cached = mediaDownloadCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      readyDownloadUrl = cached.downloadUrl;
    } else {
      // Wait for high-speed conversion pipeline with polling (up to 45s)
      try {
        const initRes = await fetch(
          `https://loader.to/ajax/download.php?button=1&start=1&end=1&format=${loaderFormat}&url=${encodeURIComponent(inputUrl)}`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            }
          }
        );

        if (initRes.ok) {
          const initData: any = await initRes.json();
          const pollUrl = initData.progress_url || `https://lto2.affadaffa.com/api/progress?id=${initData.id}`;

          for (let attempt = 0; attempt < 50; attempt++) {
            await new Promise(r => setTimeout(r, 450));
            const pRes = await fetch(pollUrl, {
              headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
              }
            });

            if (pRes.ok) {
              const pData: any = await pRes.json();
              if (pData.download_url) {
                readyDownloadUrl = pData.download_url;
                mediaDownloadCache.set(cacheKey, {
                  downloadUrl: pData.download_url,
                  title: cleanTitle,
                  expiresAt: Date.now() + 2 * 60 * 60 * 1000,
                });
                break;
              }
            }
          }
        }
      } catch (convErr) {
        console.warn("Primary conversion engine notice:", convErr);
      }
    }

    if (readyDownloadUrl) {
      // If direct redirect requested
      if (req.query.direct === "true") {
        return res.redirect(readyDownloadUrl);
      }

      // Fast streaming pass-through to client
      const mediaRes = await fetch(readyDownloadUrl);
      if (mediaRes.ok && mediaRes.body) {
        const ext = isAudio ? (format === "m4a" ? "m4a" : "mp3") : "mp4";
        const contentType = isAudio ? (format === "m4a" ? "audio/mp4" : "audio/mpeg") : "video/mp4";
        const contentLength = mediaRes.headers.get("content-length");

        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(cleanTitle)}.${ext}"`);
        res.setHeader("Content-Type", contentType);
        if (contentLength) {
          res.setHeader("Content-Length", contentLength);
        }
        res.setHeader("Cache-Control", "public, max-age=3600");
        res.setHeader("Access-Control-Allow-Origin", "*");

        // @ts-ignore
        const reader = mediaRes.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        return res.end();
      }
    }

    return res.status(503).json({
      error: "The media conversion engine is taking longer than usual. Please try clicking 'Instant Mirror' or choose another format.",
    });
  } catch (error: any) {
    console.error("Download processing error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Failed to process media stream" });
    }
  }
});

// 4.5 Firebase Admin Authentication Routes
app.get("/api/auth/status", (_req, res) => {
  const status = getFirebaseAdminStatus();
  res.json(status);
});

app.post("/api/auth/verify", async (req, res) => {
  const { idToken } = req.body || {};
  if (!idToken) {
    return res.status(400).json({ error: "Missing idToken parameter" });
  }

  const decoded = await verifyFirebaseIdToken(idToken);
  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired token, or Admin SDK not initialized" });
  }

  return res.json({
    valid: true,
    uid: decoded.uid,
    email: decoded.email,
    name: decoded.name,
    picture: decoded.picture
  });
});

// 5. SEO Routes: sitemap.xml & robots.txt
app.get("/robots.txt", (_req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *\nAllow: /\nSitemap: https://tubeflow.app/sitemap.xml`);
});

app.get("/sitemap.xml", (_req, res) => {
  res.type("application/xml");
  const urls = [
    { loc: "https://tubeflow.app/", priority: "1.0", changefreq: "daily" },
    { loc: "https://tubeflow.app/#trending", priority: "0.9", changefreq: "daily" },
    { loc: "https://tubeflow.app/#top-charts", priority: "0.8", changefreq: "weekly" },
    { loc: "https://tubeflow.app/#how-it-works", priority: "0.7", changefreq: "monthly" },
    { loc: "https://tubeflow.app/#faq", priority: "0.6", changefreq: "monthly" }
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      u => `
  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;
  res.send(xml);
});

// Start server with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tubeflow server active on http://localhost:${PORT}`);
  });
}

startServer();
