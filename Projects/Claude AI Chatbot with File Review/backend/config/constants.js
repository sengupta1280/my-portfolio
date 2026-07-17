import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT || 5000,
  ANTHROPIC_AUTH_TOKEN: process.env.ANTHROPIC_AUTH_TOKEN,
  ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL,
  ROUTER_BASE_URL: process.env.ROUTER_BASE_URL || 'http://localhost:20128/v1',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  HISTORY_DIR: process.env.HISTORY_DIR || './conversations',
};

export const API_ROUTES = {
  CHAT: '/api/chat',
  UPLOAD: '/api/upload',
  HISTORY: '/api/history',
  CONVERSATION: '/api/conversation/:id',
};
