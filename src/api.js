import axios from 'axios';

// Primary API (Azure) - your supplied backend
const PRIMARY_API = 'https://jobbackend-dbd6e4bmh9cee3hb.southeastasia-01.azurewebsites.net';

// Determine local default (dev) as before
let defaultBase = '';
if (typeof window !== 'undefined') {
	const host = window.location.hostname;
	if (host === 'localhost' || host === '127.0.0.1') {
		defaultBase = 'http://localhost:8080';
	}
}

// Fallback chain: REACT_APP_API_URL (if set), then local default, then relative origin ('')
const FALLBACK_APIS = [process.env.REACT_APP_API_URL || defaultBase || '', ''];

// Try primary then fallbacks. Only fallback on network-level errors (no HTTP response).
async function tryWithFallbacks(method, url, data, config) {
	try {
		const primary = axios.create({ baseURL: PRIMARY_API });
		return await primary.request({ method, url, data, ...config });
	} catch (err) {
		if (err && err.response) {
			// HTTP error from primary - surface it
			throw err;
		}
		let lastErr = err;
		for (const base of FALLBACK_APIS) {
			try {
				const client = axios.create({ baseURL: base });
				return await client.request({ method, url, data, ...config });
			} catch (e) {
				if (e && e.response) throw e;
				lastErr = e;
			}
		}
		throw lastErr;
	}
}

const api = {
	get: (url, config) => tryWithFallbacks('get', url, undefined, config),
	post: (url, data, config) => tryWithFallbacks('post', url, data, config),
	put: (url, data, config) => tryWithFallbacks('put', url, data, config),
	delete: (url, config) => tryWithFallbacks('delete', url, undefined, config),
	request: (opts) => tryWithFallbacks(opts.method || 'get', opts.url, opts.data, opts)
};

export default api;
