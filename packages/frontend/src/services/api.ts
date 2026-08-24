import axios from 'axios';

const API_BASE = '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (email: string, name: string, password: string, subject?: string, gradeLevel?: string) =>
    apiClient.post('/auth/register', { email, name, password, subject, gradeLevel }),
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
};

export const chatService = {
  sendMessage: (conversationId: string | undefined, message: string) =>
    apiClient.post('/chat/message', { conversationId, message }),
  getConversations: () => apiClient.get('/chat/conversations'),
  getConversation: (id: string) => apiClient.get(`/chat/conversation/${id}`),
  deleteConversation: (id: string) => apiClient.delete(`/chat/conversation/${id}`),
};

export const documentService = {
  generate: (conversationId: string, type: string, title: string, description?: string) =>
    apiClient.post('/documents/generate', { conversationId, type, title, description }),
  getTypes: () => apiClient.get('/documents/types'),
};

export default apiClient;
