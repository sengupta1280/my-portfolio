import { useState, useEffect } from 'react';
import { ChatBox } from '../components/ChatBox';
import { MessageInput } from '../components/MessageInput';
import { Sidebar } from '../components/Sidebar';
import { useChat } from '../hooks/useChat';
import '../styles/ChatPage.css';

export const ChatPage = () => {
  const { conversationId, messages, loading, error, startNewConversation, loadConversation, sendMessage } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    startNewConversation();

    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSendMessage = async (message, fileIds) => {
    try {
      await sendMessage(message, fileIds);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleSelectConversation = async (id) => {
    try {
      await loadConversation(id);
      if (isMobile) setSidebarOpen(false);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  const handleNewConversation = async () => {
    try {
      await startNewConversation();
      if (isMobile) setSidebarOpen(false);
    } catch (err) {
      console.error('Failed to start new conversation:', err);
    }
  };

  return (
    <div className="chat-page">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}

      <Sidebar
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        currentId={conversationId}
        isVisible={isMobile ? sidebarOpen : true}
      />

      <div className="chat-main">
        <div className="chat-header">
          <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle menu">
            {sidebarOpen ? '✕' : '☰'} {isMobile ? '' : 'Menu'}
          </button>
          <h1>Claude Chatbot</h1>
          {error && <div className="error-message">{error}</div>}
        </div>

        <ChatBox messages={messages} loading={loading} />

        <MessageInput onSendMessage={handleSendMessage} disabled={loading} />
      </div>
    </div>
  );
};
