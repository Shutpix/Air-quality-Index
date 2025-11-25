// controllers/aqiController.js
const { getAqiByCity, listCachedCities } = require('../services/waqiService');
const { RECENT_HISTORY_MAX } = require('../config');

// in-memory recent queries (most recent first)
const recentQueries = [];

function pushRecent(city, source) {
  const normalized = (city || '').trim();
  if (!normalized) return;
  // push an object with timestamp & source
  recentQueries.unshift({ city: normalized, ts: Date.now(), source });
  // trim
  if (recentQueries.length > RECENT_HISTORY_MAX) recentQueries.length = RECENT_HISTORY_MAX;
}

exports.getByCity = async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'Missing query param "city"' });

  const result = await getAqiByCity(city);
  if (result.error) {
    // still record failed attempt (optional)
    pushRecent(city, 'error');
    return res.status(502).json({ error: 'Failed to fetch AQI', details: result.error });
  }

  // record successful query
  pushRecent(city, result.source);

  // Build helpful response with WAQI data + standard explanation sample
  const response = {
    source: result.source,
    query: city,
    fetchedAt: new Date().toISOString(),
    data: result.data,
    // simple derived summary — you can expand to proper standards mapping
    summary: {
      aqi: (result.data.aqi !== undefined ? result.data.aqi : null),
      category: healthCategoryFromAqi(result.data.aqi)
    }
  };

  return res.json(response);
};

function healthCategoryFromAqi(aqi) {
  if (aqi == null) return { label: 'Unknown', level: -1 };
  if (aqi <= 50) return { label: 'Good', level: 0 };
  if (aqi <= 100) return { label: 'Moderate', level: 1 };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', level: 2 };
  if (aqi <= 200) return { label: 'Unhealthy', level: 3 };
  if (aqi <= 300) return { label: 'Very Unhealthy', level: 4 };
  return { label: 'Hazardous', level: 5 };
}

exports.getRecent = (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
  const start = (page - 1) * limit;
  const items = recentQueries.slice(start, start + limit);
  return res.json({
    total: recentQueries.length,
    page,
    limit,
    items
  });
};

exports.getCachedList = (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
  const result = listCachedCities({ page, limit });
  return res.json(result);
};
