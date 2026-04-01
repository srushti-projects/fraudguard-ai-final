const normalizeBaseUrl = (url) => String(url || '').trim().replace(/\/+$/, '');

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
);

export const API_ROUTES = {
  trends: `${API_BASE_URL}/api/trends`,
  redditTrends: `${API_BASE_URL}/reddit/stats/trend`,
  community: `${API_BASE_URL}/community`,
  scan: `${API_BASE_URL}/scan`,
};
