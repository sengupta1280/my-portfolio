# 🤖 AI Projects Agent — LangGraph + OpenAI (Terminal)

A minimal, extensible **console agent** that streams responses using a LangGraph **ReAct** executor with OpenAI. Perfect starting point to add your own tools and workflows.

---

## ✨ What it does
- Loads your API key from `.env`
- Initializes `ChatOpenAI(temperature=0)`
- Builds a LangGraph **ReAct** agent (currently no custom tools)
- Streams the assistant’s output token-by-token in the terminal  
*(See `main.py` for the full loop and streaming logic.)*

---

## 🧰 Tech Stack
- **Python**
- **LangGraph** (`langgraph.prebuilt.create_react_agent`)
- **LangChain** core messages
- **langchain-openai** (OpenAI chat model wrapper)
- **python-dotenv** (reads `.env`)

---

## 📦 Setup

```bash
# 1) Create and activate a virtual environment
uv venv
# (activate on your shell, e.g., Linux/macOS: source .venv/bin/activate, Windows PowerShell: .venv\Scripts\Activate.ps1)

# 2) Install deps with uv's pip
uv pip install langgraph langchain python-dotenv langchain-openai
