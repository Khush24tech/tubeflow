import { handleDownloadStream } from "../../src/server/downloadService.ts";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    return await handleDownloadStream(
      {
        url: req.query?.url as string,
        id: req.query?.id as string,
        format: req.query?.format as string,
        quality: req.query?.quality as string,
        title: req.query?.title as string,
        direct: req.query?.direct as string
      },
      res
    );
  } catch (error: any) {
    console.error("Vercel Download Stream API Error:", error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to process download stream",
        code: "DOWNLOAD_STREAM_ERROR"
      });
    }
  }
}
