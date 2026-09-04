import { executeSearch } from "../src/server/searchService.ts";

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const rawQ = req.query?.q;
    const query = typeof rawQ === "string" ? rawQ.trim() : String(rawQ || "").trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "Query parameter 'q' is required",
        code: "MISSING_QUERY"
      });
    }

    const data = await executeSearch(query);

    // Cache successful search results for 15 minutes on CDN edge
    res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=3600");
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Vercel Search API Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Search query processing failed",
      code: "SEARCH_EXECUTION_ERROR"
    });
  }
}
