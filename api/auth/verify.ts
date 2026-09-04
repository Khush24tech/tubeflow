import { verifyFirebaseIdToken } from "../../src/server/firebaseAdmin.ts";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed", code: "METHOD_NOT_ALLOWED" });
  }

  const { idToken } = req.body || {};
  if (!idToken || typeof idToken !== "string") {
    return res.status(400).json({ success: false, error: "idToken string required in request body", code: "MISSING_ID_TOKEN" });
  }

  const decoded = await verifyFirebaseIdToken(idToken);
  if (!decoded) {
    return res.status(401).json({ success: false, error: "Invalid or expired Firebase ID token", code: "INVALID_TOKEN" });
  }

  return res.status(200).json({
    success: true,
    uid: decoded.uid,
    email: decoded.email,
    verified: true,
    user: decoded
  });
}
