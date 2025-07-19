const analyticsEndpoint = '{{ANALYTICS_ENDPOINT}}';
const sessionId = Date.now().toString() + Math.random().toString(36).substring(2);
const page = window.location.pathname;

async function sendEvent(eventType, extra = {}) {
  const payload = {
    eventType,
    page,
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    sessionId,
    ...extra
  };

  try {
    await fetch(analyticsEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error('Analytics tracking failed:', e);
  }
}

sendEvent('page_view');

document.addEventListener('click', (e) => {
  const targetText = e.target.innerText || e.target.alt || e.target.tagName;
  sendEvent('click', { target: targetText });
});

let startTime = Date.now();
window.addEventListener('beforeunload', () => {
  const timeSpent = Math.floor((Date.now() - startTime) / 1000);
  sendEvent('time_on_page', { seconds: timeSpent });
});
