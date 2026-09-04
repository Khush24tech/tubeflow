import { handleTrendingRequest } from "../src/server/trendingService.ts";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const category = req.query?.category as string;
    const data = await handleTrendingRequest(category);

    res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=86400");
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Vercel Trending API Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch trending songs",
      code: "TRENDING_FETCH_ERROR"
    });
  }
}
