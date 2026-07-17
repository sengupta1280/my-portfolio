import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || `${window.location.protocol}//${window.location.hostname}:5000`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat endpoints
export const chatAPI = {
  sendMessage: (conversationId, message, fileIds = []) =>
    api.post('/api/chat', { conversationId, message, fileIds }),

  streamMessage: (conversationId, message, fileIds = []) =>
    api.post('/api/chat/stream', { conversationId, message, fileIds }, {
      responseType: 'stream',
    }),
};

// File endpoints
export const fileAPI = {
  uploadFile: (file, conversationId) => {
    const formData = new FormData();
    formData.append('file', file);
    if (conversationId) {
      formData.append('conversationId', conversationId);
    }
    return api.post('/api/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getFileDetails: (fileId) =>
    api.get(`/api/files/${fileId}`),

  getFileContentUrl: (fileId) =>
    `${API_BASE_URL}/api/files/${fileId}/content`,

  deleteFile: (fileId) =>
    api.delete(`/api/files/${fileId}`),
};

// History endpoints
export const historyAPI = {
  getAllConversations: () =>
    api.get('/api/history'),

  getConversation: (conversationId) =>
    api.get(`/api/history/${conversationId}`),

  createConversation: (title = 'New Conversation') =>
    api.post('/api/history', { title }),

  updateConversationTitle: (conversationId, title) =>
    api.put(`/api/history/${conversationId}`, { title }),

  deleteConversation: (conversationId) =>
    api.delete(`/api/history/${conversationId}`),
};

export default api;
