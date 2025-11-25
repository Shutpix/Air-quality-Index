// config.js
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  // WAQI token: default to the token you gave, but recommend using .env
  WAQI_TOKEN: process.env.WAQI_TOKEN || '8aa761297decba3c13180cd33537f5f67adebafb',
  // Cache: max number of cached city responses and TTL in ms
  CACHE_MAX_ITEMS: Number(process.env.CACHE_MAX_ITEMS) || 200,
  CACHE_TTL_MS: Number(process.env.CACHE_TTL_MS) || 1000 * 60 * 10, // 10 minutes
  // Recent queries list (for pagination)
  RECENT_HISTORY_MAX: Number(process.env.RECENT_HISTORY_MAX) || 1000
};
