import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const daysApi = {
  getAll: () => api.get('/days').then(r => r.data),
  getByDate: (date) => api.get(`/days/${date}`).then(r => r.data),
  save: (data) => api.post('/days', data).then(r => r.data),
  remove: (id) => api.delete(`/days/${id}`).then(r => r.data),
};

export const symptomsApi = {
  getByDate: (date) => api.get(`/symptoms/date/${date}`).then(r => r.data),
  getByDayId: (dayId) => api.get(`/symptoms/day/${dayId}`).then(r => r.data),
  add: (data) => api.post('/symptoms', data).then(r => r.data),
  update: (id, data) => api.put(`/symptoms/${id}`, data).then(r => r.data),
  remove: (id) => api.delete(`/symptoms/${id}`).then(r => r.data),
};

export const statsApi = {
  getSummary: (days = 7) => api.get(`/stats/summary?days=${days}`).then(r => r.data),
  getTrend: (days = 30) => api.get(`/stats/trend?days=${days}`).then(r => r.data),
  getTopSymptoms: (days = 30) => api.get(`/stats/top-symptoms?days=${days}`).then(r => r.data),
  getHourDistribution: (days = 30) => api.get(`/stats/hour-distribution?days=${days}`).then(r => r.data),
};

export const timeblocksApi = {
  getByDate: (date) => api.get(`/timeblocks/date/${date}`).then(r => r.data),
  save: (data) => api.post('/timeblocks', data).then(r => r.data),
  remove: (id) => api.delete(`/timeblocks/${id}`).then(r => r.data),
};
