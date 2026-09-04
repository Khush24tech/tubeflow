import type { Response } from "express";
import { parseSafeTitle } from "./searchService.ts";

export interface CacheEntry {
  downloadUrl: string;
  title: string;
  expiresAt: number;
}

export const mediaDownloadCache = new Map<string, CacheEntry>();
export const pendingConversionJobs = new Map<string, Promise<any>>();

export function mapToLoaderFormat(format: string, quality?: string): string {
  const f = (format || "mp3").toLowerCase().trim();
  const q = (quality || "").toLowerCase().trim();

  if (f === "mp3") {
    if (q.includes("320")) return "mp3";
    if (q.includes("128")) return "128";
    if (q.includes("192")) return "192";
    return "mp3";
  }
  if (f === "m4a") return "m4a";
  if (f === "flac") return "flac";
  if (f === "wav") return "wav";

  if (f === "mp4") {
    if (q.includes("1080")) return "1080";
    if (q.includes("720")) return "720";
    if (q.includes("480")) return "480";
    if (q.includes("360")) return "360";
    if (q.includes("4k") || q.includes("2160")) return "4k";
    return "720";
  }

  return "mp3";
}

export function extractVideoId(rawUrl: string): string {
  let videoId = rawUrl;
  if (rawUrl.includes("v=")) {
    videoId = rawUrl.split("v=")[1]?.split("&")[0] || rawUrl;
  } else if (rawUrl.includes("youtu.be/")) {
    videoId = rawUrl.split("youtu.be/")[1]?.split("?")[0] || rawUrl;
  }
  return videoId.replace(/[^a-zA-Z0-9_-]/g, "");
}

export async function handleDownloadPrepare(params: {
  url?: string;
  id?: string;
  format?: string;
  quality?: string;
}) {
  const rawUrl = params.url || params.id;
  const format = ((params.format as string) || "mp3").toLowerCase();
  const quality = (params.quality as string) || "";

  if (!rawUrl) {
    return {
      status: 400,
      data: {
        success: false,
        error: "Missing YouTube URL or video ID",
        code: "INVALID_ARGUMENTS"
      }
    };
  }

  const videoId = extractVideoId(rawUrl);
  const inputUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const loaderFormat = mapToLoaderFormat(format, quality);
  const cacheKey = `${videoId}_${loaderFormat}`;

  // Check cache
  const cached = mediaDownloadCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return {
      status: 200,
      data: {
        success: true,
        cached: true,
        ready: true,
        downloadUrl: cached.downloadUrl,
        title: cached.title,
        format: loaderFormat,
        progress: 100
      }
    };
  }

  // Check pending job
  if (pendingConversionJobs.has(cacheKey)) {
    const activeJob = await pendingConversionJobs.get(cacheKey);
    return { status: 200, data: activeJob };
  }

  // Initialize conversion job
  const jobPromise = (async () => {
    const initRes = await fetch(
      `https://loader.to/ajax/download.php?button=1&start=1&end=1&format=${loaderFormat}&url=${encodeURIComponent(inputUrl)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        },
        signal: AbortSignal.timeout(8000)
      }
    );

    if (!initRes.ok) {
      throw new Error(`Media conversion service returned HTTP ${initRes.status}`);
    }

    const initData: any = await initRes.json();
    return {
      success: true,
      jobId: initData.id,
      progressUrl: initData.progress_url || `https://lto2.affadaffa.com/api/progress?id=${initData.id}`,
      title: initData.title || initData.info?.title || "Track",
      format: loaderFormat,
      cacheKey
    };
  })();

  pendingConversionJobs.set(cacheKey, jobPromise);
  try {
    const result = await jobPromise;
    setTimeout(() => pendingConversionJobs.delete(cacheKey), 30000);
    return { status: 200, data: result };
  } catch (error: any) {
    pendingConversionJobs.delete(cacheKey);
    return {
      status: 502,
      data: {
        success: false,
        error: error.message || "Failed to initialize media extraction",
        code: "CONVERSION_INIT_FAILED"
      }
    };
  }
}

export async function handleDownloadProgress(params: {
  id?: string;
  cacheKey?: string;
  progressUrl?: string;
}) {
  const id = params.id;
  const cacheKey = params.cacheKey;
  const progressUrl = params.progressUrl || (id ? `https://lto2.affadaffa.com/api/progress?id=${id}` : "");

  if (!id && !progressUrl) {
    return {
      status: 400,
      data: {
        success: false,
        error: "Missing conversion job ID",
        code: "MISSING_JOB_ID"
      }
    };
  }

  try {
    const pRes = await fetch(progressUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
      },
      signal: AbortSignal.timeout(6000)
    });

    if (!pRes.ok) {
      return {
        status: 502,
        data: {
          success: false,
          error: "Failed to query conversion progress",
          code: "PROGRESS_QUERY_FAILED"
        }
      };
    }

    const data: any = await pRes.json();
    const progressNum = Math.min(100, Math.max(0, Math.round((data.progress || 0) / 10)));
    const isReady = !!data.download_url;

    if (isReady && data.download_url && cacheKey) {
      mediaDownloadCache.set(cacheKey, {
        downloadUrl: data.download_url,
        title: parseSafeTitle(data.title) || "Track",
        expiresAt: Date.now() + 2 * 60 * 60 * 1000
      });
    }

    return {
      status: 200,
      data: {
        success: true,
        progress: isReady ? 100 : Math.max(25, progressNum),
        rawProgress: data.progress,
        text: data.text || (isReady ? "Download ready!" : "Processing media stream..."),
        ready: isReady,
        downloadUrl: isReady && data.download_url ? data.download_url : null
      }
    };
  } catch (error: any) {
    return {
      status: 500,
      data: {
        success: false,
        error: error.message || "Failed to check conversion status",
        code: "STATUS_CHECK_ERROR"
      }
    };
  }
}

export async function handleDownloadStream(
  params: {
    url?: string;
    id?: string;
    format?: string;
    quality?: string;
    title?: string;
    direct?: string;
  },
  res: Response | any
) {
  const rawUrl = params.url || params.id;
  const format = ((params.format as string) || "mp3").toLowerCase();
  const quality = (params.quality as string) || "";
  const rawTitle = (params.title as string) || "Tubeflow_Track";
  const cleanTitle = rawTitle.replace(/[/\\?%*:|"<>]/g, "").trim() || "Tubeflow_Track";

  if (!rawUrl) {
    if (res.status) {
      return res.status(400).json({
        success: false,
        error: "Missing URL or video ID",
        code: "INVALID_REQUEST"
      });
    }
    return;
  }

  const videoId = extractVideoId(rawUrl);
  const inputUrl = `https://www.youtube.com/watch?v=${videoId}`;
  const isAudio = format === "mp3" || format === "m4a" || format === "flac" || format === "wav";
  const loaderFormat = mapToLoaderFormat(format, quality);
  const cacheKey = `${videoId}_${loaderFormat}`;

  let readyDownloadUrl: string | null = null;

  // 1. Check memory cache
  const cached = mediaDownloadCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    readyDownloadUrl = cached.downloadUrl;
  } else {
    // 2. Poll for conversion (safe duration: max 12 attempts ~ 6 seconds to stay well below serverless timeout)
    try {
      const initRes = await fetch(
        `https://loader.to/ajax/download.php?button=1&start=1&end=1&format=${loaderFormat}&url=${encodeURIComponent(inputUrl)}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
          },
          signal: AbortSignal.timeout(6000)
        }
      );

      if (initRes.ok) {
        const initData: any = await initRes.json();
        const pollUrl = initData.progress_url || `https://lto2.affadaffa.com/api/progress?id=${initData.id}`;

        for (let attempt = 0; attempt < 12; attempt++) {
          await new Promise(r => setTimeout(r, 450));
          const pRes = await fetch(pollUrl, {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            },
            signal: AbortSignal.timeout(3000)
          });

          if (pRes.ok) {
            const pData: any = await pRes.json();
            if (pData.download_url) {
              readyDownloadUrl = pData.download_url;
              mediaDownloadCache.set(cacheKey, {
                downloadUrl: pData.download_url,
                title: cleanTitle,
                expiresAt: Date.now() + 2 * 60 * 60 * 1000
              });
              break;
            }
          }
        }
      }
    } catch (convErr) {
      console.warn("Conversion pipeline notice:", convErr);
    }
  }

  if (readyDownloadUrl) {
    // Direct redirect requested or browser direct link
    if (params.direct === "true") {
      if (res.redirect) {
        return res.redirect(302, readyDownloadUrl);
      }
      res.writeHead(302, { Location: readyDownloadUrl });
      return res.end();
    }

    // Stream pass-through
    try {
      const mediaRes = await fetch(readyDownloadUrl, {
        signal: AbortSignal.timeout(15000)
      });
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
    } catch (streamErr) {
      console.warn("Stream pipe notice, falling back to direct redirect:", streamErr);
      if (res.redirect) {
        return res.redirect(302, readyDownloadUrl);
      }
      res.writeHead(302, { Location: readyDownloadUrl });
      return res.end();
    }
  }

  // Not ready within immediate synchronous window
  if (!res.headersSent) {
    return res.status(503).json({
      success: false,
      inProgress: true,
      error: "The media conversion engine is processing. Please use the download modal for progress tracking or retry in a few seconds.",
      code: "CONVERSION_IN_PROGRESS",
      retryAfter: 3
    });
  }
}
