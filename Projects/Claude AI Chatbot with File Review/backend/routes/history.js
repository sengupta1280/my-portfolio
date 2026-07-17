import express from 'express';
import {
  getAllConversations,
  getConversation,
  deleteConversation,
  updateConversationTitle,
  createConversation,
} from '../utils/historyStore.js';

const router = express.Router();

// GET /api/history - Get all conversations
router.get('/', (req, res) => {
  try {
    const conversations = getAllConversations();
    res.json({
      success: true,
      conversations: conversations,
      total: conversations.length,
    });
  } catch (error) {
    console.error('Get history error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/history - Create new conversation
router.post('/', (req, res) => {
  try {
    const { title = 'New Conversation' } = req.body;
    const conversation = createConversation(title);
    res.json({
      success: true,
      conversation: conversation,
    });
  } catch (error) {
    console.error('Create conversation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/history/:conversationId - Get specific conversation
router.get('/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = getConversation(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({
      success: true,
      conversation: conversation,
    });
  } catch (error) {
    console.error('Get conversation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/history/:conversationId - Update conversation title
router.put('/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const conversation = updateConversationTitle(conversationId, title);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({
      success: true,
      conversation: conversation,
    });
  } catch (error) {
    console.error('Update conversation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/history/:conversationId - Delete conversation
router.delete('/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const deleted = deleteConversation(conversationId);

    if (!deleted) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({
      success: true,
      message: 'Conversation deleted',
      conversationId: conversationId,
    });
  } catch (error) {
    console.error('Delete conversation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
