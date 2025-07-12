const express = require('express');
const { ClickHouse } = require('clickhouse');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

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

  
// API route to track events
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
    console.error('ClickHouse insert error:', err.response?.data || err.message || err);

  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Analytics service running on port ${PORT}`);
});
