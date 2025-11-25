// services/waqiService.js
const axios = require('axios');
const cache = require('../utils/cache');
const { WAQI_TOKEN } = require('../config');

// Normalize key: lowercase, trim, replace spaces with single space
function normalizeCity(city) {
  return (city || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

const WAQI_BASE = 'https://api.waqi.info/feed';

async function fetchAqiFromApi(city) {
  const url = `${WAQI_BASE}/${encodeURIComponent(city)}/?token=${WAQI_TOKEN}`;
  try {
    const resp = await axios.get(url, { timeout: 8000 });
    // WAQI returns something like { status: "ok", data: {...} }
    if (resp.data && resp.data.status === 'ok') {
      return { ok: true, data: resp.data.data };
    } else {
      // could be status: "error" or unknown shape
      return { ok: false, error: resp.data && resp.data.data ? resp.data.data : 'Unknown WAQI response' };
    }
  } catch (err) {
    return { ok: false, error: err.message || err.toString() };
  }
}

/**
 * Get AQI for a city with caching.
 * - If cached and not expired: return cached
 * - Otherwise fetch from WAQI, store in cache, return
 */
async function getAqiByCity(city) {
  const key = `city:${normalizeCity(city)}`;
  const cached = cache.get(key);
  if (cached) {
    return { source: 'cache', data: cached };
  }

  const remote = await fetchAqiFromApi(city);
  if (!remote.ok) return { source: 'remote', error: remote.error };

  // Save in cache (QuickLRU uses maxAge automatically from constructor)
  cache.set(key, remote.data);
  return { source: 'remote', data: remote.data };
}

// Helper to list cached items (for paginated listing)
function listCachedCities({ page = 1, limit = 10 }) {
  const entries = Array.from(cache.keys()).filter(k => k.startsWith('city:'));
  // map key->value
  const items = entries.map(k => {
    const city = k.replace(/^city:/, '');
    return { city, data: cache.get(k) };
  });

  // simple pagination
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);
  return {
    total: items.length,
    page,
    limit,
    items: paged
  };
}

module.exports = { getAqiByCity, listCachedCities };
