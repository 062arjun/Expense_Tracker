import api from './api.js'

export const dashboardService = {
  summary: () => api.get('/dashboard/summary').then((res) => res.data),
  monthly: () => api.get('/dashboard/monthly').then((res) => res.data),
  categories: () => api.get('/dashboard/categories').then((res) => res.data),
  recent: () => api.get('/dashboard/recent').then((res) => res.data)
}
