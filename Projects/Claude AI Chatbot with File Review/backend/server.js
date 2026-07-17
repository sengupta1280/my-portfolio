import express from 'express';
import cors from 'cors';
import { config } from './config/constants.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Import routes
import chatRoutes from './routes/chat.js';
import fileRoutes from './routes/files.js';
import historyRoutes from './routes/history.js';

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for local network access
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Chatbot server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/history', historyRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Chatbot server running on http://localhost:${PORT}`);
  console.log(`📁 Uploads directory: ${config.UPLOAD_DIR}`);
  console.log(`💾 Conversations directory: ${config.HISTORY_DIR}`);
  console.log(`🔗 9Router endpoint: ${config.ROUTER_BASE_URL}`);
  console.log(`✅ Ready to accept connections!\n`);
});
