import { handleDownloadPrepare } from "../../src/server/downloadService.ts";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const result = await handleDownloadPrepare({
      url: req.query?.url as string,
      id: req.query?.id as string,
      format: req.query?.format as string,
      quality: req.query?.quality as string
    });

    return res.status(result.status).json(result.data);
  } catch (error: any) {
    console.error("Vercel Download Prepare API Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to initialize media conversion",
      code: "PREPARE_ERROR"
    });
  }
}
