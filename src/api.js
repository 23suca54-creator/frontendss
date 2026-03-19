import axios from 'axios';

// Use REACT_APP_API_URL when provided (set in environment / Azure App Settings).
// Fallback to empty string so calls are relative to the current origin.
const baseURL = process.env.REACT_APP_API_URL || '';

const api = axios.create({ baseURL });

export default api;
