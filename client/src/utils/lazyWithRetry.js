/**
 * Wrapper around React.lazy that retries failed dynamic imports.
 * Handles transient network errors (ERR_INTERNET_DISCONNECTED, timeouts, etc.)
 * by retrying up to `maxRetries` times with exponential backoff.
 *
 * If all retries fail, it reloads the page once (handles deploy cache misses
 * where old chunk hashes no longer exist on the server).
 */

const RELOAD_KEY = 'chunk-reload-attempted';

export default function lazyWithRetry(importFn, maxRetries = 3) {
  return new Promise((resolve, reject) => {
    const attempt = (retryCount) => {
      importFn()
        .then(resolve)
        .catch((error) => {
          if (retryCount < maxRetries) {
            // Exponential backoff: 1s, 2s, 4s
            const delay = Math.pow(2, retryCount) * 1000;
            console.warn(
              `[lazyWithRetry] Retrying import (attempt ${retryCount + 1}/${maxRetries}) in ${delay}ms...`,
              error.message
            );
            setTimeout(() => attempt(retryCount + 1), delay);
          } else {
            // All retries exhausted — try a full page reload once
            // This handles stale chunk hashes after a new deployment
            const hasReloaded = sessionStorage.getItem(RELOAD_KEY);

            if (!hasReloaded) {
              sessionStorage.setItem(RELOAD_KEY, 'true');
              console.warn('[lazyWithRetry] All retries failed. Reloading page...');
              window.location.reload();
            } else {
              // Already tried reloading, give up and let ErrorBoundary handle it
              sessionStorage.removeItem(RELOAD_KEY);
              reject(error);
            }
          }
        });
    };

    attempt(0);
  });
}
