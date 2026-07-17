import express from 'express';
import { sendMessage, streamMessage } from '../controllers/chatController.js';

const router = express.Router();

// POST /api/chat - Send a message
router.post('/', async (req, res) => {
  try {
    const { conversationId, message, fileIds = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await sendMessage(conversationId, message, fileIds);
    res.json(result);
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chat/stream - Stream a message
router.post('/stream', async (req, res) => {
  try {
    const { conversationId, message, fileIds = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Set up response headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Handle chunks
    let buffer = '';
    const onChunk = (chunk) => {
      buffer += chunk;
      // Send chunk to client
      res.write(`data: ${JSON.stringify({ chunk: chunk })}\n\n`);
    };

    // Stream the message
    const result = await streamMessage(conversationId, message, fileIds, onChunk);

    // Send final result
    res.write(`data: ${JSON.stringify({ complete: true, conversationId: result.conversationId })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Stream error:', error.message);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

export default router;
