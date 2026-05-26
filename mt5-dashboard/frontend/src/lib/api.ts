import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const accountsApi = {
  list: () => api.get('/accounts/').then(r => r.data),
  create: (payload: { label: string; login: string; server: string; password: string }) =>
    api.post('/accounts/', payload).then(r => r.data),
  activate: (id: number) => api.post(`/accounts/${id}/activate`).then(r => r.data),
  delete: (id: number) => api.delete(`/accounts/${id}`).then(r => r.data),
  summary: () => api.get('/accounts/active/summary').then(r => r.data),
}

export const tradesApi = {
  list: (status?: string) =>
    api.get('/trades/', { params: status ? { status } : {} }).then(r => r.data),
  updateJournal: (id: number, payload: { journal_notes?: string; strategy_tag?: string; lessons?: string }) =>
    api.patch(`/trades/${id}/journal`, payload).then(r => r.data),
}

export const analyticsApi = {
  metrics: () => api.get('/analytics/metrics').then(r => r.data),
  charts: () => api.get('/analytics/charts').then(r => r.data),
}

export default api
