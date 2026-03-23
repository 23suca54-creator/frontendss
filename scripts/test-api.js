const api = require('../src/api').default;

(async () => {
  try {
    const res = await api.get('/jobs');
    console.log('status', res.status);
    console.log('data', Array.isArray(res.data) ? `array(${res.data.length})` : typeof res.data);
  } catch (err) {
    console.error('error', err && err.message ? err.message : err);
    if (err && err.response) console.error('status', err.response.status, 'data', err.response.data);
  }
})();
