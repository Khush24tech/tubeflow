import { handleDownloadProgress } from "../../src/server/downloadService.ts";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const result = await handleDownloadProgress({
      id: req.query?.id as string,
      cacheKey: req.query?.cacheKey as string,
      progressUrl: req.query?.progressUrl as string
    });

    return res.status(result.status).json(result.data);
  } catch (error: any) {
    console.error("Vercel Download Progress API Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to check conversion status",
      code: "PROGRESS_ERROR"
    });
  }
}
