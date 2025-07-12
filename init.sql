CREATE TABLE IF NOT EXISTS default.events (
    eventType String,
    page String,
    timestamp DateTime,
    sessionId String
) ENGINE = MergeTree()
ORDER BY timestamp;
