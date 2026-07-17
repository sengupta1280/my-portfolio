# Claude Free AI Chatbot with File Review

A completely free to use full-stack conversational AI chatbot that connects to Claude AI through an API proxy, supporting **file upload, image analysis, and persistent conversation history**. Built with Node.js/Express on the backend and a modern React web app on the frontend. Use the best models completely for free.

---

## 🚀 Overview

This project is a production-ready chatbot interface that lets you:

- 💬 **Chat with Claude AI** through a conversational web interface
- 📎 **Upload files** (images, PDFs, documents) and have Claude analyze them
- 🖼️ **Send images** as base64 content blocks for vision-capable models
- 📜 **Persist conversation history** across sessions (stored locally as JSON files)
- 📱 **Access from anywhere on your local network** (mobile-responsive UI)
- 🔄 **Stream responses** in real-time via SSE

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────┐     ┌─────────────┐
│  User's Browser │────▶│  React Frontend  │────▶│  Express API │────▶│  9Router    │
│  (Phone/Desktop)│     │  (Port 3000)     │     │  (Port 5000) │     │  Proxy/Gate │
└─────────────────┘     └──────────────────┘     └──────────────┘     └──────┬──────┘
                                                                             │
                                                                      ┌──────▼──────┐
                                                                      │  Claude AI  │
                                                                      └─────────────┘
```

| Component | Tech Stack | Purpose |
|-----------|-----------|---------|
| **Frontend** | React, Vite, Axios | Chat UI, file upload, history viewer |
| **Backend** | Node.js, Express, Multer | API routes, file storage, proxy to Claude |
| **Storage** | JSON files (local) | Conversation history, uploaded files |
| **AI Proxy** | 9Router → Claude API | Routes requests to Claude with auth |

---

## ✨ Features

### Chat Interface
- Real-time messaging with streaming responses
- Text input with Shift+Enter for multi-line
- Auto-scroll to latest messages
- Typing indicators during processing

### File Upload
- Drag-and-drop file selection
- Supports: JPEG, PNG, GIF, WebP, PDF, DOCX, TXT
- Images sent as base64 content blocks for vision-capable models
- Non-image files included as text annotations
- 50MB file size limit

### Conversation Management
- Auto-save every message to local JSON storage
- Sidebar with all past conversations
- Create new conversations any time
- Delete conversations
- Resume previous conversations with full context

### Image Preview
- Inline image thumbnails in chat
- Click to expand into a full-size lightbox overlay
- Backend serves images via `/api/files/:id/content`

### Mobile Responsive
- Touch-friendly interface
- Slide-out sidebar on mobile
- Adaptive layout for phones, tablets, and desktops
- Safe area support for modern mobile browsers

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, Axios |
| **Backend** | Node.js 22, Express 5 |
| **File Upload** | Multer (memory storage) |
| **File Storage** | Raw files + JSON metadata sidecars |
| **History Storage** | JSON files per conversation |
| **AI API** | Anthropic/OpenAI-compatible proxy (9Router) |
| **Streaming** | Server-Sent Events (SSE) |

---

## 📁 Project Structure

```
Claude AI Chatbot with File Review/
├── backend/
│   ├── server.js                 # Express entry point
│   ├── config/
│   │   └── constants.js          # Environment configuration
│   ├── controllers/
│   │   ├── chatController.js     # AI chat logic + content block builder
│   │   └── fileController.js     # File upload management
│   ├── routes/
│   │   ├── chat.js               # Chat API endpoints
│   │   ├── files.js              # File upload/preview endpoints
│   │   └── history.js            # Conversation history endpoints
│   ├── utils/
│   │   ├── fileStore.js          # File I/O with metadata sidecars
│   │   └── historyStore.js       # Conversation CRUD operations
│   ├── middleware/
│   │   └── errorHandler.js       # Global error handling
│   ├── uploads/                  # Uploaded file storage (gitignored)
│   ├── conversations/            # Conversation JSON storage (gitignored)
│   ├── .env                      # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx               # Root component
│   │   ├── pages/
│   │   │   └── ChatPage.jsx      # Main chat page with sidebar toggle
│   │   ├── components/
│   │   │   ├── ChatBox.jsx       # Message display + image previews
│   │   │   ├── ImagePreview.jsx  # Click-to-expand image viewer
│   │   │   ├── MessageInput.jsx  # Text input + file upload button
│   │   │   └── Sidebar.jsx       # Conversation history sidebar
│   │   ├── services/
│   │   │   └── api.js            # Axios API client
│   │   ├── hooks/
│   │   │   ├── useChat.js        # Chat state management
│   │   │   └── useFetch.js       # Generic fetch hook
│   │   ├── styles/               # CSS modules per component
│   │   └── utils/                # Date formatting, constants
│   ├── dist/                     # Production build output
│   ├── deploy-server.js          # Production HTTP server
│   ├── .env.local                # Frontend env config
│   └── package.json
│
└── README.md                     # This file
```

---

## 🚦 API Endpoints

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send message, receive AI response |
| `POST` | `/api/chat/stream` | Stream AI response via SSE |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/files/upload` | Upload a file (base64 → content block) |
| `GET` | `/api/files/:id` | Get file metadata |
| `GET` | `/api/files/:id/content` | Download raw file bytes |
| `DELETE` | `/api/files/:id` | Delete a file |

### History
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/history` | List all conversations |
| `POST` | `/api/history` | Create new conversation |
| `GET` | `/api/history/:id` | Get conversation with messages |
| `PUT` | `/api/history/:id` | Rename a conversation |
| `DELETE` | `/api/history/:id` | Delete a conversation |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ installed
- Access to a Claude API proxy (9Router or similar)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
ANTHROPIC_AUTH_TOKEN=your_api_key_here
ANTHROPIC_MODEL=your_model_here
ROUTER_BASE_URL=http://localhost:20128/v1
UPLOAD_DIR=./uploads
HISTORY_DIR=./conversations
```

Start the server:
```bash
npm start
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev     # Development mode
# OR
npm run build && npm start   # Production mode
```

### 3. Open the App

```
Local:    http://localhost:3000
Network:  http://<YOUR_PC_IP>:3000
```

---

## 🔧 Configuration

### Backend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Backend server port |
| `ANTHROPIC_AUTH_TOKEN` | — | API key for Claude proxy |
| `ANTHROPIC_MODEL` | — | Model ID (e.g. `claude-opus-4-8`) |
| `ROUTER_BASE_URL` | `http://localhost:20128/v1` | API gateway URL |
| `UPLOAD_DIR` | `./uploads` | Where uploaded files are stored |
| `HISTORY_DIR` | `./conversations` | Where conversation JSON files are stored |

### Frontend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:5000` | Backend API URL |

---

## 💡 Key Implementation Details

### Image Handling
Uploaded images are saved to disk via Multer, then read back and converted to base64 content blocks when sent to the AI. The backend builds a multi-block message:
```json
[
  {"type": "text", "text": "Describe this image"},
  {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": "..."}}
]
```

### Conversation Storage
Each conversation is stored as an independent JSON file in the `conversations/` directory. Messages are appended to the file on every turn. The last 10 messages are included in each API request for context.

### Dual Response Format
The backend handles both Anthropic (`content[].text`) and OpenAI-compatible (`choices[0].message.content`) response formats, making it compatible with various API proxies.

---

## 👤 Author

**Abhishek Sengupta**  
- 💼 [LinkedIn](https://www.linkedin.com/in/sengupta1280)  
- ✉️ sengupta1280@gmail.com  

---

## 📜 License

This project is part of my personal portfolio. Feel free to explore, fork, and adapt it for your own learning.
