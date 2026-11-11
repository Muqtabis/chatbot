# 🤖 Gemini AI Streaming Chatbot

A full-stack **AI Chatbot** web application powered by **FastAPI**, **React**, **Tailwind CSS**, and **Google Gemini (`gemini-2.5-flash-lite`)** with real-time token streaming, syntax-highlighted Markdown responses, and request cancellation.

👤 **Profile:** [Muqtabis](https://github.com/Muqtabis)

---

## ✨ Key Features

- **⚡ Real-Time Streaming Responses (`POST /chat`)**
  - Streams AI responses chunk-by-chunk from the FastAPI backend using `StreamingResponse` and the browser `ReadableStream` API (`res.body.getReader()`).
  - Configured with `gemini-2.5-flash-lite`, `max_output_tokens=500`, `temperature=0.7`, and a sliding window over the last 10 conversation turns (`history[-11:-1]`).
- **⏹️ Abort / Stop Generation**
  - Client-side `AbortController` integration lets you cancel in-progress generations at any time via the **Stop Generating** button.
- **💻 Markdown & Syntax-Highlighted Code Blocks**
  - Renders formatted assistant replies using `react-markdown` and `react-syntax-highlighter` (`vscDarkPlus` Prism theme) with language labels and one-click **Copy** buttons.
- **🎨 Responsive Chat Interface**
  - Collapsible sidebar with Framer Motion spring transitions and mobile backdrop overlay.
  - Quick-start prompt cards, auto-resizing multi-line composer (`Enter` to send, `Shift + Enter` for a new line), loading indicators, and automatic scroll-to-bottom behavior.
- **🩺 Gemini Model Diagnostic Utility**
  - Includes `backend/check_models.py` to validate `GOOGLE_API_KEY` and list all Gemini models supporting `generateContent`.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19 (`react-scripts`), Tailwind CSS v4, Framer Motion, `react-markdown`, `react-syntax-highlighter`, `react-icons` |
| **Backend API** | Python, FastAPI, Uvicorn (`uvicorn[standard]`), Pydantic, `python-dotenv` |
| **AI Model SDK** | Google Generative AI Python SDK (`google-generativeai`, `gemini-2.5-flash-lite`) |

---

## 📁 Project Structure

```text
chatbot/
├── backend/
│   ├── check_models.py        # Script to verify GOOGLE_API_KEY and list available models
│   ├── main.py                # FastAPI app, CORS config, / and streaming /chat endpoints
│   └── requirements.txt       # Full pinned Python environment dependencies
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js             # Main chat layout, sidebar, prompt cards, message feed
│   │   ├── ChatInput.js       # Auto-resizing textarea & send controls
│   │   ├── ChatMessage.js     # Markdown renderer & syntax-highlighted code block copy UI
│   │   ├── useChat.js         # Streaming fetch hook, AbortController & chat state
│   │   ├── ChatBubble.js      # Additional chat bubble component
│   │   ├── ChatWindow.js      # Additional chat window component
│   │   └── WelcomeScreen.js   # Additional welcome screen component
│   └── package.json
└── requirements.txt           # Core backend Python packages
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Python 3.10+
- Node.js (v18+ recommended) and npm
- A Google Gemini API key (`GOOGLE_API_KEY`)

### 1. Clone the repository
```bash
git clone https://github.com/Muqtabis/chatbot.git
cd chatbot
```

### 2. Backend Setup (FastAPI)
Create a virtual environment and install dependencies:
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r ../requirements.txt
```

Configure `backend/.env` with your Google API key:
```env
GOOGLE_API_KEY=your_google_gemini_api_key
```

*(Optional)* Verify your API key and inspect accessible Gemini models:
```bash
python check_models.py
```

Start the FastAPI server on port `8000`:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup (React)
In a separate terminal:
```bash
cd frontend
npm install
npm start
```
The frontend launches at `http://localhost:3000`. When running on `localhost`, `frontend/src/useChat.js` automatically sends requests to `http://127.0.0.1:8000/chat` (and falls back to the hosted Render URL in production).

---

## 🔌 Backend API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check returning `{"status": "ok", "message": "Backend is running!"}` |
| `POST` | `/chat` | Accepts `{ "history": [{ "role": "user" \| "model", "content": "..." }], "system_prompt": "..." }` and streams `text/plain` chunks |
