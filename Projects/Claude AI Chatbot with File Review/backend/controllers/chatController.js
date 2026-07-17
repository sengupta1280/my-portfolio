import axios from 'axios';
import { config } from '../config/constants.js';
import { addMessage, getConversation, createConversation } from '../utils/historyStore.js';
import { getFile as getFileMeta, getFileContent } from '../utils/fileStore.js';

// Initialize axios client for 9Router
const router9 = axios.create({
  baseURL: config.ROUTER_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.ANTHROPIC_AUTH_TOKEN}`,
    'anthropic-version': '2023-06-01',
  },
});

// ── helpers ────────────────────────────────────────────────────────────────

/** MIME type prefixes we know how to send as image content blocks */
const IMAGE_PREFIXES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * Build the `content` of a user message.
 * - No files: returns a plain string (backward-compatible).
 * - With files: returns an array of content blocks — text first, then base64
 *   image blocks for image files, plus a text annotation for non-image files.
 */
const buildContentBlocks = (message, fileIds) => {
  if (!fileIds || fileIds.length === 0) return message;

  const blocks = [{ type: 'text', text: message }];
  const skipped = [];

  for (const fileId of fileIds) {
    const meta = getFileMeta(fileId);
    if (!meta) {
      skipped.push(fileId.slice(0, 8));
      continue;
    }

    const isImage = IMAGE_PREFIXES.some((prefix) => meta.mimeType.startsWith(prefix));

    if (isImage) {
      const buffer = getFileContent(fileId);
      if (!buffer) {
        skipped.push(meta.originalName || fileId.slice(0, 8));
        continue;
      }
      blocks.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: meta.mimeType,
          data: buffer.toString('base64'),
        },
      });
    } else {
      skipped.push(meta.originalName || fileId.slice(0, 8));
    }
  }

  if (skipped.length > 0) {
    blocks.push({
      type: 'text',
      text: `\n[Attached file(s) could not be sent as images: ${skipped.join(', ')}]`,
    });
  }

  return blocks;
};

const getResponseText = (data) => {
  const anthropicText = data?.content
    ?.filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');

  if (anthropicText) {
    return anthropicText;
  }

  const openAiContent = data?.choices?.[0]?.message?.content;
  if (typeof openAiContent === 'string' && openAiContent) {
    return openAiContent;
  }

  throw new Error('9Router returned a response with no assistant text');
};

const getGatewayError = (error) => {
  const status = error.response?.status;
  const message = error.response?.data?.error?.message
    || error.response?.data?.message
    || error.message;

  return status ? `9Router request failed (${status}): ${message}` : message;
};

// ── sendMessage (non-streaming) ────────────────────────────────────────────

export const sendMessage = async (conversationId, userMessage, fileIds = []) => {
  try {
    // Get or create conversation
    let conversation = getConversation(conversationId);
    if (!conversation) {
      conversation = createConversation();
      conversationId = conversation.id;
    }

    // Build rich content blocks — a plain string when there are no files
    const content = buildContentBlocks(userMessage, fileIds);

    // Add user message to history — content is stored as-is (string or array)
    addMessage(conversationId, 'user', content, fileIds);

    // Build messages array for Claude (last 10 messages for context)
    // The history now already includes the latest user message, so we slice
    // before the push below. We reconstruct messages from the stored history
    // plus the assistant reply that we'll fetch.
    const historyMessages = getConversation(conversationId).messages;

    const latestCount = historyMessages.length;
    const contextMessages = historyMessages.slice(Math.max(0, latestCount - 10)).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Prepare request to 9Router
    const requestData = {
      model: config.ANTHROPIC_MODEL,
      messages: contextMessages,
      max_tokens: 4096,
      stream: false,
    };

    // Send to Claude via 9Router
    const response = await router9.post('/messages', requestData);

    // Extract response text
    const assistantMessage = getResponseText(response.data);

    // Add assistant message to history
    addMessage(conversationId, 'assistant', assistantMessage);

    return {
      success: true,
      conversationId,
      assistantMessage,
      messages: getConversation(conversationId).messages,
    };
  } catch (error) {
    const gatewayError = getGatewayError(error);
    console.error('Error sending message to 9Router:', gatewayError);
    throw new Error(`Failed to process message: ${gatewayError}`);
  }
};

// ── streamMessage (SSE) ────────────────────────────────────────────────────

export const streamMessage = async (conversationId, userMessage, fileIds = [], onChunk) => {
  try {
    // Get or create conversation
    let conversation = getConversation(conversationId);
    if (!conversation) {
      conversation = createConversation();
      conversationId = conversation.id;
    }

    // Build rich content blocks
    const content = buildContentBlocks(userMessage, fileIds);

    // Add user message to history
    addMessage(conversationId, 'user', content, fileIds);

    // Build messages array for Claude (last 10 messages for context)
    const historyMessages = getConversation(conversationId).messages;
    const latestCount = historyMessages.length;
    const contextMessages = historyMessages.slice(Math.max(0, latestCount - 10)).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Prepare request to 9Router with streaming
    const requestData = {
      model: config.ANTHROPIC_MODEL,
      messages: contextMessages,
      max_tokens: 4096,
      stream: true,
    };

    // Create streaming request
    const response = await router9.post('/messages', requestData, {
      responseType: 'stream',
    });

    let fullResponse = '';

    // Handle streaming data
    return new Promise((resolve, reject) => {
      response.data.on('data', (chunk) => {
        const text = chunk.toString();

        if (text.includes('delta')) {
          try {
            const jsonMatch = text.match(/data: ({.*})/);
            if (jsonMatch) {
              const data = JSON.parse(jsonMatch[1]);
              if (data.delta?.text) {
                fullResponse += data.delta.text;
                if (onChunk) onChunk(data.delta.text);
              }
            }
          } catch (e) {
            // Ignore parse errors in streaming
          }
        } else {
          fullResponse += text;
          if (onChunk) onChunk(text);
        }
      });

      response.data.on('end', async () => {
        try {
          addMessage(conversationId, 'assistant', fullResponse);
          resolve({ conversationId, assistantMessage: fullResponse });
        } catch (error) {
          reject(error);
        }
      });

      response.data.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error streaming message from 9Router:', error.message);
    throw new Error(`Failed to stream message: ${error.message}`);
  }
};
