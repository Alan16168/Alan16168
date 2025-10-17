import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  getMe: () => apiClient.get('/auth/me'),
  updateProfile: (data) => apiClient.put('/auth/profile', data)
};

// Chat APIs
export const chatAPI = {
  sendMessage: (data) => apiClient.post('/chat/message', data),
  getChatHistory: (sessionId) => apiClient.get(`/chat/history/${sessionId}`),
  getChatSessions: () => apiClient.get('/chat/sessions'),
  deleteChatSession: (sessionId) => apiClient.delete(`/chat/session/${sessionId}`)
};

// Forms APIs
export const formsAPI = {
  getAllForms: (params) => apiClient.get('/forms', { params }),
  getFormById: (id, params) => apiClient.get(`/forms/${id}`, { params }),
  getFormCategories: () => apiClient.get('/forms/categories')
};

// Background Check APIs
export const backgroundCheckAPI = {
  requestCheck: (data) => apiClient.post('/background-check/request', data),
  getCheckStatus: (checkId) => apiClient.get(`/background-check/status/${checkId}`),
  getCheckHistory: () => apiClient.get('/background-check/history'),
  downloadReport: (checkId) => apiClient.get(`/background-check/download/${checkId}`)
};

// Document APIs (Admin only)
export const documentAPI = {
  uploadDocument: (formData) => apiClient.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAllDocuments: (params) => apiClient.get('/documents', { params }),
  deleteDocument: (id) => apiClient.delete(`/documents/${id}`)
};

// User APIs (Admin only)
export const userAPI = {
  getAllUsers: () => apiClient.get('/users'),
  updateUserRole: (userId, role) => apiClient.put(`/users/${userId}/role`, { role })
};

export default apiClient;
