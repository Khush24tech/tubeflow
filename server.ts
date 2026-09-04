import express from "express";
import type { Request, Response } from "express";
import path from "path";
import cors from "cors";
import { getFirebaseAdminStatus, verifyFirebaseIdToken } from "./src/server/firebaseAdmin.ts";
import { executeSearch } from "./src/server/searchService.ts";
import { handleDownloadPrepare, handleDownloadProgress, handleDownloadStream } from "./src/server/downloadService.ts";
import { handleTrendingRequest, handleTrackDetails } from "./src/server/trendingService.ts";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 0. Health check endpoint for monitoring & ingress
app.get(["/api/health", "/health"], (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "tubeflow-server",
    timestamp: new Date().toISOString()
  });
});

// 1. Search API endpoint (Universal multi-tier YouTube & artist search)
app.get(["/api/search", "/search"], async (req: Request, res: Response) => {
  try {
    const rawQ = req.query.q;
    const query = typeof rawQ === "string" ? rawQ.trim() : String(rawQ || "").trim();
    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query parameter 'q' is required",
        code: "MISSING_QUERY"
      });
    }

    const data = await executeSearch(query);
    return res.json(data);
  } catch (error: any) {
    console.error("Search endpoint error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to process search query",
      code: "SEARCH_ERROR"
    });
  }
});

// 2. Trending / Top Charts API
app.get(["/api/trending", "/trending"], async (req: Request, res: Response) => {
  try {
    const category = (req.query.category as string) || "all";
    const data = await handleTrendingRequest(category);
    return res.json(data);
  } catch (error: any) {
    console.error("Trending endpoint error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch trending tracks",
      code: "TRENDING_ERROR"
    });
  }
});

// 3. Track Details API
app.get(["/api/track/:id", "/api/track", "/track/:id"], async (req: Request, res: Response) => {
  try {
    const id = req.params.id || (req.query.id as string);
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Missing track ID parameter",
        code: "MISSING_TRACK_ID"
      });
    }
    const data = await handleTrackDetails(id);
    return res.json(data);
  } catch (error: any) {
    console.error("Track details endpoint error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to retrieve track details",
      code: "TRACK_ERROR"
    });
  }
});

// 4a. Ultra-Fast Media Conversion Preparation API
app.get(["/api/download/prepare", "/download/prepare"], async (req: Request, res: Response) => {
  try {
    const result = await handleDownloadPrepare({
      url: req.query.url as string,
      id: req.query.id as string,
      format: req.query.format as string,
      quality: req.query.quality as string
    });
    return res.status(result.status).json(result.data);
  } catch (error: any) {
    console.error("Prepare download endpoint error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to initialize media conversion",
      code: "PREPARE_ERROR"
    });
  }
});

// 4b. Fast media progress status API
app.get(["/api/download/progress", "/download/progress"], async (req: Request, res: Response) => {
  try {
    const result = await handleDownloadProgress({
      id: req.query.id as string,
      cacheKey: req.query.cacheKey as string,
      progressUrl: req.query.progressUrl as string
    });
    return res.status(result.status).json(result.data);
  } catch (error: any) {
    console.error("Progress check endpoint error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to check conversion status",
      code: "PROGRESS_ERROR"
    });
  }
});

// 4c. Primary Direct Media Stream & Pass-Through API endpoint
app.get(["/api/download", "/download"], async (req: Request, res: Response) => {
  try {
    return await handleDownloadStream(
      {
        url: req.query.url as string,
        id: req.query.id as string,
        format: req.query.format as string,
        quality: req.query.quality as string,
        title: req.query.title as string,
        direct: req.query.direct as string
      },
      res
    );
  } catch (error: any) {
    console.error("Download processing endpoint error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to process media download",
        code: "DOWNLOAD_ERROR"
      });
    }
  }
});

// 4.5 Firebase Admin Authentication Routes
app.get(["/api/auth/status", "/auth/status"], (_req: Request, res: Response) => {
  const status = getFirebaseAdminStatus();
  res.json(status);
});

app.post(["/api/auth/verify", "/auth/verify"], async (req: Request, res: Response) => {
  const { idToken } = req.body || {};
  if (!idToken) {
    return res.status(400).json({
      success: false,
      error: "Missing idToken parameter",
      code: "MISSING_ID_TOKEN"
    });
  }

  const decoded = await verifyFirebaseIdToken(idToken);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: "Invalid or expired token, or Admin SDK not initialized",
      code: "INVALID_TOKEN"
    });
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
app.get("/robots.txt", (_req: Request, res: Response) => {
  res.type("text/plain");
  res.send(`User-agent: *\nAllow: /\nSitemap: https://tubeflow.app/sitemap.xml`);
});

app.get("/sitemap.xml", (_req: Request, res: Response) => {
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

// Export app for Vercel Serverless / external runners
export default app;

// Start server with Vite middleware when not running inside Vercel serverless
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tubeflow server active on http://localhost:${PORT}`);
  });
}

// Only launch standalone listening port when running in local / container environment
if (process.env.VERCEL !== "1" && !process.env.NOW_REGION) {
  startServer();
}
