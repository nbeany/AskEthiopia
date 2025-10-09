import axios from 'axios';
import { API_BASE_URL } from '@/lib/config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
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

// Questions API
export const questionsApi = {
  getAll: (params?: { tag?: string; q?: string }) => 
    api.get('/questions', { params }),
  
  getById: (questionid: string) => 
    api.get(`/questions/${questionid}`),
  
  create: (data: { title: string; description: string; tag: string; questionid?: string }) => 
    api.post('/questions', data),
  
  update: (questionid: string, data: { title: string; description: string; tag: string }) => 
    api.put(`/questions/${questionid}`, data),
  
  delete: (questionid: string) => 
    api.delete(`/questions/${questionid}`),
};

// Answers API
export const answersApi = {
  create: (data: { questionid: string; answer: string }) => 
    api.post('/answers', data),
  
  getByQuestion: (questionid: string) => 
    api.get(`/answers/${questionid}`),
  
  update: (answerid: string, data: { answer: string }) => 
    api.put(`/answers/id/${answerid}`, data),
  
  delete: (answerid: string) => 
    api.delete(`/answers/id/${answerid}`),
};

export default api;
