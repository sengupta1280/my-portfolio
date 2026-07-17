export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const MESSAGE_TYPES = {
  USER: 'user',
  ASSISTANT: 'assistant',
};

export const FILE_TYPES = {
  PDF: 'application/pdf',
  IMAGE: 'image/*',
  TEXT: 'text/*',
  DOCUMENT: 'application/msword',
};
