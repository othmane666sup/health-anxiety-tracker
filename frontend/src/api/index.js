import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data).then(r => r.data),
  login: (data) => api.post('/auth/login', data).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
};

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

export const userSymptomsApi = {
  getAll: () => api.get('/user-symptoms').then(r => r.data),
};

export const timeblocksApi = {
  getByDate: (date) => api.get(`/timeblocks/date/${date}`).then(r => r.data),
  save: (data) => api.post('/timeblocks', data).then(r => r.data),
  remove: (id) => api.delete(`/timeblocks/${id}`).then(r => r.data),
};
