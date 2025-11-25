// routes/aqi.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/aqiController');

// GET /api/aqi?city=delhi
router.get('/', controller.getByCity);

// GET /api/aqi/recent?page=1&limit=10
router.get('/recent', controller.getRecent);

// GET /api/aqi/list?page=1&limit=10  (paginated cached list)
router.get('/list', controller.getCachedList);

module.exports = router;
