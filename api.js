/**
 * Small API layer aligned with the supplied FastAPI routers.
 * Set window.FARMLINK_API_URL before loading the app to point at another origin.
 */
export class FarmLinkApi {
  constructor({ baseUrl, token = null }) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.token = token;
  }

  setToken(token) { this.token = token; }

  async request(path, options = {}) {
    const headers = new Headers(options.headers);
    if (this.token) headers.set('Authorization', `Bearer ${this.token}`);
    if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    const response = await fetch(`${this.baseUrl}${path}`, { ...options, headers });
    if (!response.ok) throw new Error((await response.json().catch(() => null))?.detail || 'Something went wrong.');
    return response.status === 204 ? null : response.json();
  }

  listPools(status) { return this.request(`/pools${status ? `?status=${encodeURIComponent(status)}` : ''}`); }
  getPool(poolId) { return this.request(`/pools/${poolId}`); }
  register(payload) { return this.request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }); }
  async login(email, password) {
    const body = new URLSearchParams({ username: email, password });
    const result = await this.request('/auth/login', { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    this.setToken(result.access_token);
    return result;
  }
  currentUser() { return this.request('/auth/me'); }
  createOrder(payload, idempotencyKey) { return this.request('/orders', { method: 'POST', body: JSON.stringify(payload), headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {} }); }
  myOrders() { return this.request('/orders/me'); }
  contribute(payload) { return this.request('/contributions', { method: 'POST', body: JSON.stringify(payload) }); }
}
