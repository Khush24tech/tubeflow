import fs from 'fs';
import path from 'path';
import type { App, ServiceAccount } from 'firebase-admin/app';
import { initializeApp, getApps, cert, applicationDefault } from 'firebase-admin/app';
import type { Auth, DecodedIdToken } from 'firebase-admin/auth';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App | null = null;
let initError: string | null = null;

/**
 * Parses service account credential from various sources:
 * 1. FIREBASE_SERVICE_ACCOUNT_KEY environment variable (raw JSON string or base64)
 * 2. Path in process.env.GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_PATH
 * 3. Root directory file "serviceAccountKey.json"
 */
function loadServiceAccountCredential(): ServiceAccount | null {
  // 1. Check environment variable (string or base64)
  const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_SERVICE_ACCOUNT;
  if (envKey && envKey.trim()) {
    try {
      const trimmed = envKey.trim();
      let jsonString = trimmed;
      if (trimmed.startsWith('{')) {
        jsonString = trimmed;
      } else {
        // Try base64 decoding
        try {
          const decoded = Buffer.from(trimmed, 'base64').toString('utf8');
          if (decoded.trim().startsWith('{')) {
            jsonString = decoded;
          }
        } catch {
          // not base64, keep original
        }
      }
      const parsed = JSON.parse(jsonString);
      if (parsed.project_id && (parsed.private_key || parsed.client_email)) {
        return parsed as ServiceAccount;
      }
    } catch (err: any) {
      console.warn('[Firebase Admin] Failed to parse credentials from FIREBASE_SERVICE_ACCOUNT_KEY:', err.message);
    }
  }

  // 2. Check path from environment variables
  const envPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (envPath) {
    const resolvedPath = path.isAbsolute(envPath) ? envPath : path.resolve(process.cwd(), envPath);
    if (fs.existsSync(resolvedPath)) {
      try {
        const raw = fs.readFileSync(resolvedPath, 'utf8');
        return JSON.parse(raw) as ServiceAccount;
      } catch (err: any) {
        console.warn(`[Firebase Admin] Failed to read key file at ${resolvedPath}:`, err.message);
      }
    }
  }

  // 3. Check default root serviceAccountKey.json
  const defaultPath = path.resolve(process.cwd(), 'serviceAccountKey.json');
  if (fs.existsSync(defaultPath)) {
    try {
      const raw = fs.readFileSync(defaultPath, 'utf8');
      return JSON.parse(raw) as ServiceAccount;
    } catch (err: any) {
      console.warn(`[Firebase Admin] Failed to read ${defaultPath}:`, err.message);
    }
  }

  return null;
}

/**
 * Lazily get or initialize Firebase Admin SDK.
 * Will not throw on app start if keys are not present.
 */
export function getFirebaseAdminApp(): App | null {
  if (adminApp) {
    return adminApp;
  }

  const existingApps = getApps();
  if (existingApps.length > 0 && existingApps[0]) {
    adminApp = existingApps[0];
    return adminApp;
  }

  try {
    const serviceAccount = loadServiceAccountCredential();

    if (serviceAccount) {
      adminApp = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.projectId || (serviceAccount as any).project_id
      });
      console.log(`[Firebase Admin] Successfully connected service account for project: ${(serviceAccount as any).project_id || serviceAccount.projectId}`);
      initError = null;
      return adminApp;
    }

    // Try application default credentials if in Cloud Run / GCP environment
    if (process.env.K_SERVICE || process.env.GOOGLE_CLOUD_PROJECT) {
      try {
        adminApp = initializeApp({
          credential: applicationDefault(),
          projectId: process.env.GOOGLE_CLOUD_PROJECT || "tubeflow-21845"
        });
        console.log('[Firebase Admin] Connected using Google Cloud Application Default Credentials for project tubeflow-21845');
        initError = null;
        return adminApp;
      } catch {
        // fallback
      }
    }

    initError = 'No service account key found. Provide FIREBASE_SERVICE_ACCOUNT_KEY or place serviceAccountKey.json in the project root.';
    return null;
  } catch (err: any) {
    initError = err.message || 'Failed to initialize Firebase Admin';
    console.error('[Firebase Admin] Initialization error:', initError);
    return null;
  }
}

/**
 * Get Firebase Admin Auth instance (or null if not configured)
 */
export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseAdminApp();
  if (!app) return null;
  try {
    return getAuth(app);
  } catch (err) {
    console.warn('[Firebase Admin] Failed to get Auth instance:', err);
    return null;
  }
}

/**
 * Get Firebase Admin connection status
 */
export function getFirebaseAdminStatus(): {
  isConfigured: boolean;
  projectId: string | null;
  clientEmail: string | null;
  message: string;
} {
  const serviceAccount = loadServiceAccountCredential();
  const app = getFirebaseAdminApp();

  if (app && serviceAccount) {
    const pId = (serviceAccount as any).project_id || serviceAccount.projectId || null;
    const email = (serviceAccount as any).client_email || serviceAccount.clientEmail || null;
    return {
      isConfigured: true,
      projectId: pId,
      clientEmail: email,
      message: 'Firebase Admin SDK is connected and authenticated.'
    };
  }

  if (app) {
    return {
      isConfigured: true,
      projectId: process.env.GOOGLE_CLOUD_PROJECT || 'tubeflow-21845',
      clientEmail: null,
      message: 'Firebase Admin SDK is running via Application Default Credentials.'
    };
  }

  return {
    isConfigured: false,
    projectId: null,
    clientEmail: null,
    message: initError || 'Service account key not yet provided.'
  };
}

/**
 * Verify a client-provided Firebase ID token
 */
export async function verifyFirebaseIdToken(idToken: string): Promise<DecodedIdToken | null> {
  const auth = getFirebaseAuth();
  if (!auth) return null;
  try {
    return await auth.verifyIdToken(idToken);
  } catch (err: any) {
    console.warn('[Firebase Admin] Token verification failed:', err.message);
    return null;
  }
}
