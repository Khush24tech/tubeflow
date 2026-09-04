// Service Worker registration & update manager

type UpdateCallback = (registration: ServiceWorkerRegistration) => void;

let swRegistration: ServiceWorkerRegistration | null = null;
let updateCallback: UpdateCallback | null = null;
let refreshing = false;

export function registerServiceWorker(onUpdate?: UpdateCallback) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // In development mode, NEVER register service worker to avoid stale Vite chunks and React duplication
  const isDev = Boolean(
    (import.meta as any).env?.DEV || 
    window.location.hostname === 'localhost' || 
    window.location.hostname.includes('run.app') ||
    window.location.port === '3000'
  );
  if (isDev) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const key of keys) {
          if (key.includes('tubeflow')) {
            caches.delete(key);
          }
        }
      });
    }
    return;
  }

  if (onUpdate) {
    updateCallback = onUpdate;
  }

  // Prevent multiple reload loops on controller change
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        swRegistration = registration;

        // 1. Check if there's an already waiting service worker
        if (registration.waiting && updateCallback) {
          updateCallback(registration);
        }

        // 2. Listen for newly discovered updates
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (
              installingWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // New update ready to activate
              if (updateCallback) {
                updateCallback(registration);
              }
            }
          });
        });
      })
      .catch((err) => {
        console.warn('[SW] Registration failed:', err);
      });
  });
}

export function applyServiceWorkerUpdate(registration?: ServiceWorkerRegistration) {
  const targetRegistration = registration || swRegistration;
  if (!targetRegistration || !targetRegistration.waiting) {
    window.location.reload();
    return;
  }

  targetRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
}
