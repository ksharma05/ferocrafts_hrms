const NodeCache = require('node-cache');

/**
 * Simple in-memory caching middleware
 * For production, consider using Redis for distributed caching
 */

// Create cache instance with default TTL of 5 minutes
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false, // Don't clone data (better performance)
});

/**
 * Cache middleware factory
 * @param {Number} duration - Cache duration in seconds
 * @returns {Function} Express middleware
 */
const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key from URL and query params
    const key = `__express__${req.originalUrl || req.url}`;

    // Try to get cached response
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      // Return cached response
      return res.json(cachedResponse);
    }

    // Store original res.json function
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = (body) => {
      // Cache successful responses only
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, body, duration);
      }
      return originalJson(body);
    };

    next();
  };
};

/**
 * Clear cache for specific pattern
 * @param {String} pattern - Pattern to match keys
 */
const clearCache = (pattern) => {
  if (!pattern) {
    cache.flushAll();
    return;
  }

  const keys = cache.keys();
  const matchingKeys = keys.filter((key) => key.includes(pattern));
  cache.del(matchingKeys);
};

/**
 * Clear cache middleware - to be used after mutations
 * @param {String} pattern - Pattern to clear
 */
const clearCacheMiddleware = (pattern) => {
  return (req, res, next) => {
    res.on('finish', () => {
      // Only clear cache on successful mutations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        clearCache(pattern);
      }
    });
    next();
  };
};

module.exports = {
  cache,
  cacheMiddleware,
  clearCache,
  clearCacheMiddleware,
};

