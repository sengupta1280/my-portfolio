import { useEffect, useState } from 'react';
import { historyAPI } from '../services/api';
import { formatDate } from '../utils/formatDate';
import '../styles/Sidebar.css';

export const Sidebar = ({ onSelectConversation, onNewConversation, currentId, isVisible }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await historyAPI.getAllConversations();
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (e, conversationId) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      await historyAPI.deleteConversation(conversationId);
      await loadConversations();
      if (currentId === conversationId) {
        onNewConversation();
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  return (
    <div className={`sidebar ${isVisible ? 'visible' : ''}`}>
      <div className="sidebar-header">
        <h1>💬 ChatBot</h1>
      </div>

      <button className="new-chat-btn" onClick={onNewConversation}>
        ✨ New Chat
      </button>

      <div className="conversations-container">
        <h3>History</h3>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : conversations.length === 0 ? (
          <div className="empty-history">No conversations yet</div>
        ) : (
          <div className="conversations-list">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${currentId === conv.id ? 'active' : ''}`}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className="conv-info">
                  <div className="conv-title">{conv.title}</div>
                  <div className="conv-meta">
                    {conv.messageCount} messages • {formatDate(conv.updatedAt)}
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={(e) => handleDeleteConversation(e, conv.id)}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
