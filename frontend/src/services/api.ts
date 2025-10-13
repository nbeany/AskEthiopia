import axios from 'axios';

// Configure your backend API URL here
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { username: string; firstname: string; lastname: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// Questions API
export const questionsAPI = {
  getAll: (params?: { tag?: string; q?: string }) =>
    api.get('/questions', { params }),
  getById: (questionid: string) =>
    api.get(`/questions/${questionid}`),
  create: (data: { title: string; description: string; tag: string }) =>
    api.post('/questions', data),
  update: (questionid: string, data: { title: string; description: string; tag: string }) =>
    api.put(`/questions/${questionid}`, data),
  delete: (questionid: string) =>
    api.delete(`/questions/${questionid}`), 
};

// Answers API
export const answersAPI = {
  getByQuestionId: (questionid: string) =>
    api.get(`/answers/${questionid}`),
  create: (data: { questionid: string; answer: string }) =>
    api.post('/answers', data),
  update: (answerid: string, data: { answer: string }) =>
    api.put(`/answers/${answerid}`, data), // ✅ remove /id/
  delete: (answerid: string) =>
    api.delete(`/answers/${answerid}`), // ✅ remove /id/
};


export default api;
