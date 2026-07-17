import { useState, useCallback } from 'react';
import { chatAPI, historyAPI } from '../services/api';

export const useChat = () => {
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Start a new conversation
  const startNewConversation = useCallback(async (title = 'New Conversation') => {
    try {
      setError(null);
      const response = await historyAPI.createConversation(title);
      const newConversationId = response.data.conversation.id;
      setConversationId(newConversationId);
      setMessages([]);
      return newConversationId;
    } catch (err) {
      setError(err.message);
      console.error('Error starting new conversation:', err);
      throw err;
    }
  }, []);

  // Load existing conversation
  const loadConversation = useCallback(async (id) => {
    try {
      setError(null);
      const response = await historyAPI.getConversation(id);
      setConversationId(id);
      setMessages(response.data.conversation.messages || []);
      return response.data.conversation;
    } catch (err) {
      setError(err.message);
      console.error('Error loading conversation:', err);
      throw err;
    }
  }, []);

  // Send message
  const sendMessage = useCallback(
    async (message, fileIds = []) => {
      if (!conversationId) {
        // Create new conversation if none exists
        await startNewConversation();
      }

      try {
        setError(null);
        setLoading(true);

        // Add user message to UI immediately
        const userMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: message,
          fileIds: fileIds,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, userMessage]);

        // Send to backend
        const response = await chatAPI.sendMessage(conversationId, message, fileIds);

        // Add assistant message
        const assistantMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.assistantMessage,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        return response.data;
      } catch (err) {
        setError(err.message);
        console.error('Error sending message:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [conversationId, startNewConversation]
  );

  return {
    conversationId,
    messages,
    loading,
    error,
    startNewConversation,
    loadConversation,
    sendMessage,
    setMessages,
  };
};
