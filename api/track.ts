import { handleTrackDetails } from "../src/server/trendingService.ts";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const id = (req.query?.id as string) || (req.query?.videoId as string);
    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Missing track ID",
        code: "MISSING_TRACK_ID"
      });
    }

    const data = await handleTrackDetails(id);
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Vercel Track Details API Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to retrieve track details",
      code: "TRACK_DETAILS_ERROR"
    });
  }
}
