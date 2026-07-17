import { useState, useRef } from 'react';
import { fileAPI } from '../services/api';
import '../styles/MessageInput.css';

export const MessageInput = ({ onSendMessage, disabled, onFileUpload }) => {
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const fileIds = uploadedFiles.map((f) => f.fileId);
    await onSendMessage(message, fileIds);

    setMessage('');
    setUploadedFiles([]);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        const response = await fileAPI.uploadFile(file, null);
        setUploadedFiles((prev) => [
          ...prev,
          {
            fileId: response.data.fileId,
            fileName: response.data.fileName,
            fileSize: response.data.fileSize,
          },
        ]);
        if (onFileUpload) {
          onFileUpload(response.data);
        }
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file: ' + error.message);
    } finally {
      setUploading(false);
      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.fileId !== fileId));
  };

  return (
    <div className="message-input">
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          {uploadedFiles.map((file) => (
            <div key={file.fileId} className="file-item">
              <span className="file-name">📎 {file.fileName}</span>
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeFile(file.fileId)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="input-form">
        <div className="input-wrapper">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message... (Shift+Enter for new line)"
            disabled={disabled || uploading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            className="message-textarea"
            rows="3"
          />

          <div className="input-actions">
            <button
              type="button"
              className="file-upload-btn"
              disabled={disabled || uploading}
              onClick={() => fileInputRef.current?.click()}
              title="Upload file"
            >
              {uploading ? '⏳' : '📁'} {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
            />
            <button
              type="submit"
              className="send-btn"
              disabled={disabled || uploading || !message.trim()}
            >
              {disabled ? '⏳' : '📤'} Send
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
