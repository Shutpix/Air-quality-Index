// server.js
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { PORT } = require('./config');

const aqiRoutes = require('./routes/aqi');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// mount
app.use('/api/aqi', aqiRoutes);

// health
app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, () => {
  console.log(`AQI backend listening on http://localhost:${PORT}`);
});
