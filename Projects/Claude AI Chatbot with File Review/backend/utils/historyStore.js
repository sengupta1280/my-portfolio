import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/constants.js';

// Ensure history directory exists
const ensureHistoryDir = () => {
  if (!fs.existsSync(config.HISTORY_DIR)) {
    fs.mkdirSync(config.HISTORY_DIR, { recursive: true });
  }
};

// Create a new conversation
export const createConversation = (title = 'New Conversation') => {
  ensureHistoryDir();
  const conversationId = uuidv4();
  const conversation = {
    id: conversationId,
    title: title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [],
    files: [],
  };

  const filePath = path.join(config.HISTORY_DIR, `${conversationId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(conversation, null, 2));

  return conversation;
};

// Get conversation by ID
export const getConversation = (conversationId) => {
  ensureHistoryDir();
  const filePath = path.join(config.HISTORY_DIR, `${conversationId}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Add message to conversation
export const addMessage = (conversationId, role, content, fileIds = []) => {
  let conversation = getConversation(conversationId);

  if (!conversation) {
    conversation = createConversation();
  }

  const message = {
    id: uuidv4(),
    role: role,
    content: content,
    fileIds: fileIds,
    timestamp: new Date().toISOString(),
  };

  conversation.messages.push(message);
  conversation.updatedAt = new Date().toISOString();

  const filePath = path.join(config.HISTORY_DIR, `${conversationId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(conversation, null, 2));

  return message;
};

// Add file reference to conversation
export const addFileToConversation = (conversationId, fileId, fileName, fileType, fileSize) => {
  let conversation = getConversation(conversationId);

  if (!conversation) {
    conversation = createConversation();
  }

  const file = {
    fileId: fileId,
    fileName: fileName,
    fileType: fileType,
    fileSize: fileSize,
    uploadedAt: new Date().toISOString(),
  };

  conversation.files.push(file);
  conversation.updatedAt = new Date().toISOString();

  const filePath = path.join(config.HISTORY_DIR, `${conversationId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(conversation, null, 2));

  return file;
};

// Get all conversations (sorted by most recent)
export const getAllConversations = () => {
  ensureHistoryDir();
  const conversations = [];

  const files = fs.readdirSync(config.HISTORY_DIR).filter(f => f.endsWith('.json'));

  files.forEach(file => {
    const filePath = path.join(config.HISTORY_DIR, file);
    const data = fs.readFileSync(filePath, 'utf-8');
    const conversation = JSON.parse(data);
    conversations.push({
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
      messageCount: conversation.messages.length,
    });
  });

  // Sort by updatedAt descending
  return conversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};

// Delete conversation
export const deleteConversation = (conversationId) => {
  const filePath = path.join(config.HISTORY_DIR, `${conversationId}.json`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }

  return false;
};

// Update conversation title
export const updateConversationTitle = (conversationId, title) => {
  const conversation = getConversation(conversationId);

  if (!conversation) {
    return null;
  }

  conversation.title = title;
  conversation.updatedAt = new Date().toISOString();

  const filePath = path.join(config.HISTORY_DIR, `${conversationId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(conversation, null, 2));

  return conversation;
};
