import { useEffect, useRef } from 'react';
import { formatTime } from '../utils/formatDate';
import { fileAPI } from '../services/api';
import ImagePreview from './ImagePreview';
import '../styles/ChatBox.css';

/**
 * Return true if content is an array of content blocks (image + text).
 */
const isRichContent = (content) => Array.isArray(content);

/**
 * Extract the text portion from an array of content blocks, or return the
 * string directly.
 */
const extractText = (content) => {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('');
  }
  return String(content);
};

/**
 * Check whether a fileId stored in the message metadata is an image we can
 * preview. We optimistically assume any file in fileIds is a renderable image
 * since we don't store per-fileId type in the message metadata.
 */
const isPreviewable = (fileId) =>
  /\.(jpe?g|png|gif|webp)$/i.test(fileId) || fileId.length > 20; // UUIDs are always "unknown" — try rendering

export const ChatBox = ({ messages, loading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-box">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h2>Start a Conversation</h2>
            <p>Upload files or type a message to begin</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={msg.id || index} className={`message message-${msg.role}`}>
              <div className="message-header">
                <span className="message-role">
                  {msg.role === 'user' ? '👤 You' : '🤖 Claude'}
                </span>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
              <div className="message-content">
                {isRichContent(msg.content) ? (
                  msg.content.map((block, bi) => {
                    if (block.type === 'image') {
                      return (
                        <ImagePreview
                          key={bi}
                          src={`data:${block.source.media_type};base64,${block.source.data}`}
                          alt="attached"
                        />
                      );
                    }
                    if (block.type === 'text') {
                      return <p key={bi}>{block.text}</p>;
                    }
                    return null;
                  })
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
              {msg.fileIds && msg.fileIds.length > 0 && (
                <div className="message-files">
                  {msg.fileIds.map((fileId) => (
                    <div key={fileId} className="file-tag file-tag-image">
                      <img
                        src={fileAPI.getFileContentUrl(fileId)}
                        alt=""
                        className="file-thumb"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span>📎 {fileId.substring(0, 8)}...</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
        {loading && (
          <div className="message message-assistant">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
