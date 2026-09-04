export default function handler(_req: any, res: any) {
  res.setHeader("Cache-Control", "no-cache");
  return res.status(200).json({
    status: "ok",
    service: "tubeflow-serverless",
    deployment: "vercel",
    timestamp: new Date().toISOString()
  });
}
