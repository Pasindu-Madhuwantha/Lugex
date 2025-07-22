const express = require('express');
const { ClickHouse } = require('clickhouse');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Setup ClickHouse connection
const clickhouse = new ClickHouse({
  url: 'http://clickhouse',
  port: 8123,
  debug: false,
  basicAuth: {
    username: 'admin',
    password: 'secret'
  },
  isUseGzip: false,
  format: "json",
});

// Track event
app.post('/track', async (req, res) => {
  const { eventType, page, timestamp, sessionId } = req.body;

  try {
    await clickhouse.query(`
      INSERT INTO default.events (eventType, page, timestamp, sessionId)
      VALUES ('${eventType}', '${page}', '${timestamp}', '${sessionId}')
    `).toPromise();

    res.status(201).json({ message: 'Event tracked successfully' });
  } catch (err) {
    console.error('ClickHouse insert error:', err);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

const PORT = 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Analytics service running on port ${PORT}`);
});

// Deploy All