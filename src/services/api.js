/**
 * Client API Service to interface with spin_wheel_backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getAuthHeader = () => {
  try {
    const saved = localStorage.getItem('myspecz_admin_auth');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.token) return { Authorization: `Bearer ${parsed.token}` };
    }
  } catch (e) {
    console.error(e);
  }
  return {};
};

const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...options.headers,
      },
      ...options,
    });

    const data = await res.json();
    if (!res.ok) {
      const error = new Error(data.message || `API error ${res.status}`);
      error.data = data;
      error.status = res.status;
      throw error;
    }
    return data;
  } catch (err) {
    console.error(`[API ERROR] ${endpoint}:`, err.message);
    throw err;
  }
};

export const api = {
  // Leads
  getLeads: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/leads${query ? `?${query}` : ''}`);
  },

  getLeadById: (id) => request(`/leads/${id}`),

  createLead: (leadData) =>
    request('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    }),

  updateLead: (id, updates) =>
    request(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteLead: (id) =>
    request(`/leads/${id}`, {
      method: 'DELETE',
    }),

  resetLeads: () =>
    request('/leads/reset', {
      method: 'DELETE',
    }),

  getExportCSVUrl: () => `${API_BASE_URL}/leads/export/csv`,

  // Spin & Wheel (Records won prize in MongoDB)
  executeSpin: ({ leadId, mobile, email, name, spectaclesUser, forceIndex, prize, prizeCode, prizeId, voucherCode } = {}) =>
    request('/spin', {
      method: 'POST',
      body: JSON.stringify({ leadId, mobile, email, name, spectaclesUser, forceIndex, prize, prizeCode, prizeId, voucherCode }),
    }),

  clearLeadSpin: ({ leadId, mobile, email } = {}) =>
    request('/spin/clear-spin', {
      method: 'POST',
      body: JSON.stringify({ leadId, mobile, email }),
    }),

  verifyVoucher: (code) =>
    request('/spin/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  // Prizes
  getPrizes: () => request('/prizes'),

  // Admin Auth & Stats & Settings
  adminLogin: ({ email, password }) =>
    request('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  adminVerifySession: () => request('/admin/me'),

  getTargetIndex: () => request('/admin/target'),

  setTargetIndex: (targetIndex) =>
    request('/admin/target', {
      method: 'POST',
      body: JSON.stringify({ targetIndex }),
    }),

  getStats: () => request('/admin/stats'),

  getAdminSettings: () => request('/admin/settings'),

  updateAdminSettings: (settings) =>
    request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),

  // Health
  checkHealth: () => request('/health'),
};

