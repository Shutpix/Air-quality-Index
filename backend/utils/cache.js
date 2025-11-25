// utils/cache.js
const QuickLRUModule = require('quick-lru');
const QuickLRU = QuickLRUModule.default || QuickLRUModule; // <- safe import for different versions
const { CACHE_MAX_ITEMS, CACHE_TTL_MS } = require('../config');

const cache = new QuickLRU({
  maxSize: CACHE_MAX_ITEMS,
  maxAge: CACHE_TTL_MS
});

module.exports = cache;
