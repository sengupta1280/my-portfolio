import { v4 as uuidv4 } from 'uuid';
import { saveFile, getFile, deleteFile } from '../utils/fileStore.js';
import { addFileToConversation } from '../utils/historyStore.js';

// Handle file upload
export const uploadFile = async (file, conversationId) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // Generate unique file ID
    const fileId = uuidv4();

    // Save file to disk
    const savedFile = saveFile(fileId, file.originalname, file.mimetype, file.buffer);

    // Add file reference to conversation
    if (conversationId) {
      addFileToConversation(
        conversationId,
        fileId,
        file.originalname,
        file.mimetype,
        file.size
      );
    }

    return {
      success: true,
      fileId: fileId,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadedAt: savedFile.uploadedAt,
    };
  } catch (error) {
    console.error('Error uploading file:', error.message);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

// Get file details
export const getFileDetails = (fileId) => {
  try {
    const file = getFile(fileId);

    if (!file) {
      throw new Error('File not found');
    }

    return {
      fileId: file.fileId,
      size: file.size,
      uploadedAt: file.uploadedAt,
    };
  } catch (error) {
    console.error('Error getting file:', error.message);
    throw new Error(`Failed to get file: ${error.message}`);
  }
};

// Delete file
export const removeFile = (fileId) => {
  try {
    const deleted = deleteFile(fileId);

    if (!deleted) {
      throw new Error('File not found');
    }

    return {
      success: true,
      fileId: fileId,
      message: 'File deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting file:', error.message);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};
