import express from 'express';
import multer from 'multer';
import { uploadFile, getFileDetails, removeFile } from '../controllers/fileController.js';
import { getFile as getFileMeta, getFileContent } from '../utils/fileStore.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// POST /api/upload - Upload a file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { conversationId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const result = await uploadFile(req.file, conversationId);
    res.json(result);
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/files/:fileId - Get file details
router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const details = getFileDetails(fileId);
    res.json(details);
  } catch (error) {
    console.error('Get file error:', error.message);
    res.status(404).json({ error: error.message });
  }
});

// GET /api/files/:fileId/content - Download raw file bytes for previews
router.get('/:fileId/content', async (req, res) => {
  try {
    const { fileId } = req.params;
    const meta = getFileMeta(fileId);

    if (!meta) {
      return res.status(404).json({ error: 'File not found' });
    }

    const buffer = getFileContent(fileId);
    if (!buffer) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.setHeader('Content-Type', meta.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${meta.originalName}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(buffer);
  } catch (error) {
    console.error('Get file content error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/files/:fileId - Delete a file
router.delete('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const result = removeFile(fileId);
    res.json(result);
  } catch (error) {
    console.error('Delete file error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
